const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// ─── Profile mapping (same as build-android.js) ─────────────────────────────
const profileMap = {
  "--dev": "development",
  "--stag": "preview",
  "--prod": "production",
};

// ─── Firebase App IDs per profile ────────────────────────────────────────────
// Firebase App IDs from google-services.json
const firebaseAppIdMap = {
  development: "1:161594638586:android:fcee0ad9b84a92787a0943", // com.phuongbao90.monorepocicd.dev
  preview: "1:161594638586:android:d370f067434e28d47a0943", // com.phuongbao90.monorepocicd.stag
  production: "1:161594638586:android:619f28b74c667e007a0943", // com.phuongbao90.monorepocicd
};

// Service account key for non-interactive authentication
const serviceAccountKeyPath = path.resolve(
  __dirname,
  "..",
  "google-service-account-key.json",
);

// ─── Parse CLI arguments ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
const profileFlag = args.find((arg) => profileMap[arg]);
const formatFlag = args.find((arg) => arg === "--apk" || arg === "--aab");

if (!profileFlag) {
  console.error("❌ Error: Missing profile argument.");
  console.log("\nUsage: node scripts/upload-firebase.js <profile> [format]");
  console.log("Profiles: --dev, --stag, --prod");
  console.log(
    "Formats:  --apk, --aab (optional, defaults to .apk if both exist)",
  );
  console.log("\nExample: node scripts/upload-firebase.js --prod --apk");
  process.exit(1);
}

const profile = profileMap[profileFlag];
const formatExt = formatFlag ? formatFlag.replace("--", "") : null;

// ─── Locate build artifact ──────────────────────────────────────────────────
const rootDir = path.resolve(__dirname, "../../..");
const buildDir = path.join(rootDir, "build");

if (!fs.existsSync(buildDir)) {
  console.error(`❌ Build directory not found: ${buildDir}`);
  process.exit(1);
}

// Look for the build file matching the profile (try requested format first, then fallback)
const apkPath = path.join(buildDir, `${profile}.apk`);
const aabPath = path.join(buildDir, `${profile}.aab`);

let buildFile;

if (formatExt === "apk") {
  if (fs.existsSync(apkPath)) buildFile = apkPath;
} else if (formatExt === "aab") {
  if (fs.existsSync(aabPath)) buildFile = aabPath;
} else {
  // Fallback logic if no explicit format provided: APK preferred
  if (fs.existsSync(apkPath)) {
    buildFile = apkPath;
  } else if (fs.existsSync(aabPath)) {
    buildFile = aabPath;
  }
}

if (!buildFile) {
  console.error(
    `❌ No build file found for profile "${profile}"${formatExt ? ` with format "${formatExt}"` : ""}.`,
  );
  console.error(`   Looked for:`);
  if (formatExt === "apk" || !formatExt) console.error(`   - ${apkPath}`);
  if (formatExt === "aab" || !formatExt) console.error(`   - ${aabPath}`);
  console.log(
    "\n💡 Run the build first: node scripts/build-android.js " +
      profileFlag +
      " " +
      (formatFlag || "--apk"),
  );
  process.exit(1);
}

const firebaseAppId = firebaseAppIdMap[profile];
const ext = path.extname(buildFile).replace(".", "").toUpperCase();

// ─── Release notes ──────────────────────────────────────────────────────────
const releaseNotes = args
  .filter((arg) => !profileMap[arg])
  .join(" ")
  .trim();

// ─── Upload ─────────────────────────────────────────────────────────────────
console.log(`\n🔥 Firebase App Distribution Upload`);
console.log(`   Profile:  ${profile}`);
console.log(`   File:     ${buildFile} (${ext})`);
console.log(`   App ID:   ${firebaseAppId}`);
if (releaseNotes) {
  console.log(`   Notes:    ${releaseNotes}`);
}

const notesArg = releaseNotes ? ` --release-notes "${releaseNotes}"` : "";

// Verify service account key exists
if (!fs.existsSync(serviceAccountKeyPath)) {
  console.error(`❌ Service account key not found: ${serviceAccountKeyPath}`);
  console.error(
    "   Download it from Firebase Console → Project Settings → Service Accounts",
  );
  process.exit(1);
}

const command = [
  "npx firebase-tools",
  "appdistribution:distribute",
  `"${buildFile}"`,
  `--app ${firebaseAppId}`,
  notesArg,
].join(" ");

console.log(`\n🚀 Running: ${command}\n`);

try {
  execSync(command, {
    stdio: "inherit",
    shell: true,
    cwd: rootDir,
    env: {
      ...process.env,
      GOOGLE_APPLICATION_CREDENTIALS: serviceAccountKeyPath,
    },
  });
  console.log(`\n✅ Upload completed successfully!`);
} catch {
  console.error(`\n❌ Upload failed.`);
  process.exit(1);
}
