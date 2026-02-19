const ENV = process.env.EXPO_PUBLIC_APP_VARIANT;
const IS_DEV = ENV === "development";
const IS_STAG = ENV === "staging";
const IS_PROD = ENV === "production";

console.warn("------------------------------------------------");
console.warn("SUPER_API_KEY ", process.env.SUPER_API_KEY);
console.warn("API_KEY ", process.env.API_KEY);
console.warn("EXPO_PUBLIC_API_ENDPOINT ", process.env.EXPO_PUBLIC_API_ENDPOINT);
console.warn("EXPO_PUBLIC_APP_VARIANT ", process.env.EXPO_PUBLIC_APP_VARIANT);
console.warn("EXPO_PUBLIC_SAME_ENV ", process.env.EXPO_PUBLIC_SAME_ENV);
console.warn("------------------------------------------------");

export default () => {
  return {
    name: IS_PROD ? "app" : IS_STAG ? "app-stag" : "app-dev",
    slug: IS_PROD ? "monorepo-ci-cd" : "monorepo-ci-cd-dev",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "app",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: "com.phuongbao90.app",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      versionCode: 3,
      version: "0.0.3",
      predictiveBackGestureEnabled: false,
      package: IS_DEV
        ? "com.phuongbao90.monorepocicd.dev"
        : IS_STAG
          ? "com.phuongbao90.monorepocicd.stag"
          : "com.phuongbao90.monorepocicd",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: IS_PROD
          ? "2b926d19-2f7e-47c7-8a8b-3113c4434caf" // production project
          : "2021007d-da18-4957-9319-0f1e3c34401f", // dev/staging project
      },
    },
    updates: {
      checkAutomatically: "NEVER",
      fallbackToCacheTimeout: 0,
      url: IS_PROD
        ? "https://u.expo.dev/2b926d19-2f7e-47c7-8a8b-3113c4434caf"
        : "https://u.expo.dev/2021007d-da18-4957-9319-0f1e3c34401f",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    owner: "phuongbao90corp",
  };
};
