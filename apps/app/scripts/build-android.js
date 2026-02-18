const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Mapping CLI flags to EAS profiles
 */
const profileMap = {
  "--dev": "development",
  "--stag": "preview",
  "--prod": "production",
};

const args = process.argv.slice(2);
const profileFlag = args.find((arg) => profileMap[arg]);
const formatFlag = args.find((arg) => arg === "--apk" || arg === "--aab");
const shouldUploadFirebase = args.includes("--firebase");

const profile = profileMap[profileFlag];
const format = formatFlag ? formatFlag.replace("--", "") : null;

if (!profile || !format) {
  console.error("❌ Error: Missing required arguments.");
  console.log(
    "\nUsage: node scripts/build-android.js <profile> <format> [options]",
  );
  console.log("Profiles: --dev, --stag, --prod");
  console.log("Formats:  --apk, --aab");
  console.log(
    "Options:  --firebase  (upload to Firebase App Distribution after build)",
  );
  console.log(
    "\nExample: node scripts/build-android.js --prod --aab --firebase",
  );
  process.exit(1);
}

// Configuration
const appDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(appDir, "../..");
const buildDir = path.join(rootDir, "build");
const outputPath = path.join(buildDir, `${profile}.${format}`);

/**
 * Helper to run shell commands with inherited IO
 */
function runCommand(command, cwd) {
  console.log(`\n🚀 Running in ${cwd}: ${command}`);
  try {
    execSync(command, { stdio: "inherit", shell: true, cwd });
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    process.exit(1);
  }
}

// 0. Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  console.log(`📁 Creating build directory at ${buildDir}`);
  fs.mkdirSync(buildDir, { recursive: true });
}

console.log(`🛠️  Starting build`);
console.log(`   Profile:  ${profile}`);
console.log(`   Format:   ${format.toUpperCase()}`);
console.log(
  `   Firebase: ${shouldUploadFirebase ? "yes (upload after build)" : "no"}`,
);

// 1. Pull environment variables from EAS
// We use the profile name as the environment name, and explicitly target .env.local
runCommand(`eas env:pull ${profile} --non-interactive`, appDir);
// 2. Prebuild (clean)
// Use --overload to ensure .env.local variables take precedence over system env
runCommand(
  "npx @dotenvx/dotenvx run --overload -f .env.local -- npx expo prebuild --clean --platform android",
  appDir,
);

// 3. Build locally
runCommand(
  `npx @dotenvx/dotenvx run --overload -f .env.local -- eas build --local --platform android --profile ${profile} --clear-cache --output ${outputPath}`,
  appDir,
);

console.log(`\n✅ Build completed successfully!`);
console.log(`📦 Output located at: ${outputPath}`);

// 4. Upload to Firebase App Distribution (if --firebase flag is set)
if (shouldUploadFirebase) {
  console.log(`\n🔥 Uploading to Firebase App Distribution...`);
  const uploadScript = path.join(__dirname, "upload-firebase.js");
  runCommand(`node "${uploadScript}" ${profileFlag} ${formatFlag}`, appDir);
}
