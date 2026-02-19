# Onboarding Guide for New Interns

Welcome to the team! This guide will help you set up your development environment and get the project running locally.

## 📋 Prerequisites

Before you start, make sure you have the following installed:

### Required

- **Node.js** (>= 18) - [Download here](https://nodejs.org/)
- **Bun** (v1.3.6) - Our package manager
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **Git** - For version control

### For Mobile Development (Expo App)

- **Android Studio** (for Android emulator) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS simulator - macOS only) - Install from Mac App Store
- **Expo Go app** on your physical device (optional) - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### For Web Development

- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd monorepo-ci-cd
```

### 2. Install Dependencies

```bash
bun install
```

This will install all dependencies for the monorepo, including:

- Root-level dev tools (Turborepo, Biome, Husky)
- All apps (`apps/app`, `apps/web`)
- All packages (`packages/ui`, `packages/typescript-config`)

### 3. Set Up Git Hooks

Husky hooks are automatically installed when you run `bun install`. This will run linting before commits.

## 🔐 Environment Variables Setup

We use **EAS (Expo Application Services)** to manage environment variables. Never commit `.env` files to git!

### Get Access

1. Ask your team lead to add you to the **Dev/Staging Expo project**
2. You'll receive an invitation email - accept it

### Pull Environment Variables

Once you have access, pull the development environment variables:

```bash
cd apps/app

# Pull development environment variables
EXPO_PUBLIC_APP_VARIANT=development eas env:pull --environment development
```

This creates a `.env.local` file in `apps/app/` with all necessary environment variables.

> **⚠️ Important:** Always prefix with `EXPO_PUBLIC_APP_VARIANT=<environment>`. The `app.config.js` uses this to determine which Expo project to target.

### Environment Mapping

| `EXPO_PUBLIC_APP_VARIANT` | EAS Environment | Expo Channel  | Use Case          |
| ------------- | --------------- | ------------- | ----------------- |
| `development` | `development`   | `development` | Local development |
| `staging`     | `preview`       | `preview`     | Testing/QA        |
| `production`  | `production`    | `production`  | Live app          |

**As an intern, you'll only use `development` environment.**

## 🏃 Running the Apps

### Run All Apps (Turborepo)

```bash
# From the root of the monorepo
bun dev
```

This starts both the web app and Expo app in parallel.

### Run Individual Apps

#### Web App (Next.js)

```bash
cd apps/web
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Mobile App (Expo)

```bash
cd apps/app

# Start the development server
bun dev

# Or start with specific platform
bun android    # Android emulator
bun ios        # iOS simulator (macOS only)
bun web        # Web version
```

Once started, you'll see a QR code and options to open the app:

- Press `a` to open Android emulator
- Press `i` to open iOS simulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your physical device

## 📁 Project Structure

```
monorepo-ci-cd/
├── apps/
│   ├── app/                 # Expo React Native app
│   │   ├── src/
│   │   │   ├── app/         # Expo Router screens
│   │   │   ├── components/  # Reusable components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── utils/       # Utility functions
│   │   ├── app.config.js    # Expo configuration
│   │   └── eas.json         # EAS build configuration
│   └── web/                 # Next.js web app
│       └── app/             # Next.js app router
├── packages/
│   ├── typescript-config/   # Shared TypeScript configs
│   └── ui/                  # Shared UI components
├── .github/workflows/       # CI/CD workflows
├── turbo.json               # Turborepo configuration
└── biome.json               # Linting/formatting config
```

## 🛠️ Development Workflow

### Code Quality Tools

We use **Biome** for linting and formatting:

```bash
# From the root of the monorepo

# Check for linting errors
bun lint:check

# Auto-fix linting errors
bun lint:write

# Format code with Prettier
bun format

# Check TypeScript types
bun check-types
```

### Pre-commit Hooks

Husky runs automatically before each commit:

- Lints staged files with Biome
- Blocks commit if there are linting errors

### Branching Strategy

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push and create a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
bun test

# Run tests for specific app
cd apps/app
bun test
```

## 🔧 Troubleshooting

### Common Issues

#### 1. `bun install` fails

```bash
# Clear bun cache and reinstall
rm -rf node_modules bun.lock
bun install
```

#### 2. Expo app won't start

```bash
cd apps/app

# Clear Metro bundler cache
npx expo start --clear

# Or reset the entire project
bun reset-project
```

#### 3. Environment variables not loading

Make sure you:

1. Are in the `apps/app` directory
2. Use the correct prefix: `EXPO_PUBLIC_APP_VARIANT=development`
3. Have accepted the Expo project invitation

```bash
cd apps/app
EXPO_PUBLIC_APP_VARIANT=development eas env:pull --environment development
```

#### 4. Linting errors on commit

```bash
# Auto-fix all linting errors
bun lint:write

# Or stage and try committing again
git add .
git commit -m "your message"
```

#### 5. Port already in use

```bash
# Find and kill process on port 3000 (web)
lsof -ti:3000 | xargs kill -9

# For Metro bundler (default port 8081)
lsof -ti:8081 | xargs kill -9
```

### Getting Help

1. Check this guide first
2. Search existing issues in the repository
3. Ask in the team Slack/Discord channel
4. Tag your mentor for help

## 📚 Useful Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Biome Documentation](https://biomejs.dev/)
- [EAS Documentation](https://docs.expo.dev/eas/)

## ✅ Onboarding Checklist

Before starting your first task, make sure you can:

- [ ] Clone the repository
- [ ] Run `bun install` successfully
- [ ] Pull development environment variables
- [ ] Start the web app on `localhost:3000`
- [ ] Start the Expo app on Android emulator or iOS simulator
- [ ] Run `bun lint:check` without errors
- [ ] Make a test commit and push to a branch

## 🎯 Next Steps

Once your environment is set up:

1. Read the project README files:
   - `/README.md` - General monorepo info
   - `/apps/app/README.md` - Expo app specifics
   - `/apps/web/README.md` - Next.js app specifics

2. Explore the codebase to understand the architecture

3. Ask your mentor for your first task!

---

**Questions?** Don't hesitate to ask your team lead or mentor. We're here to help! 🚀
