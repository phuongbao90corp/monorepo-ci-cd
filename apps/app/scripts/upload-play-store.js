const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// ─── Profile mapping ────────────────────────────────────────────────────────
const profileMap = {
  "--prod": "production",
};

// ─── Parse CLI arguments ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
const profileFlag = args.find((arg) => profileMap[arg]);

if (!profileFlag) {
  console.error("❌ Error: Missing profile argument.");
  console.log("\nUsage: node scripts/upload-play-store.js <profile>");
  console.log("Profiles: --prod (must be --prod for Play Store)");
  console.log("\nExample: node scripts/upload-play-store.js --prod");
  process.exit(1);
}

const profile = profileMap[profileFlag];

// ─── Locate build artifact (.aab only) ──────────────────────────────────────
const rootDir = path.resolve(__dirname, "../../..");
const buildDir = path.join(rootDir, "build");
const aabPath = path.join(buildDir, `${profile}.aab`);

if (!fs.existsSync(aabPath)) {
  console.error(`❌ Build file not found: ${aabPath}`);
  console.error("   Google Play Store requires .aab files.");
  console.log(
    "\n💡 Run the build first: node scripts/build-android.js " +
      profileFlag +
      " --aab",
  );
  process.exit(1);
}

// ─── Upload ─────────────────────────────────────────────────────────────────
console.log(`\n📦 Google Play Store Submission`);
console.log(`   Profile:  ${profile}`);
console.log(`   File:     ${aabPath}`);

const command = [
  "eas submit",
  "--platform android",
  `--profile ${profile}`,
  `--path "${aabPath}"`,
  "--non-interactive",
].join(" ");

console.log(`\n🚀 Running: ${command}\n`);

try {
  execSync(command, {
    stdio: "inherit",
    shell: true,
    cwd: path.resolve(__dirname, ".."), // Run from apps/app directory
  });
  console.log(`\n✅ Submission to Play Store initiated successfully!`);
  console.log("   Check the status in Expo Dashboard or Google Play Console.");
} catch (error) {
  console.error(`\n❌ Submission failed.`);
  process.exit(1);
}
