const IS_DEV = process.env.APP_VARIANT === "development";
const IS_STAG = process.env.APP_VARIANT === "staging";

export default () => {
  return {
    name: "app",
    slug: "monorepo-ci-cd",
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
        projectId: "2b926d19-2f7e-47c7-8a8b-3113c4434caf",
      },
    },
    owner: "phuongbao90",
  };
};
