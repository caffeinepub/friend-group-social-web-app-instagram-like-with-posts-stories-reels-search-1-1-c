# Building an Android APK

This guide explains how to build an installable Android APK from this web application using Capacitor.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js and pnpm** - Already required for the web app
2. **Java Development Kit (JDK) 17 or higher**
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
   - Verify installation: `java -version`
3. **Android Studio**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - During installation, ensure you install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (for emulator testing)
4. **Android SDK Command-line Tools**
   - Open Android Studio → Settings/Preferences → Appearance & Behavior → System Settings → Android SDK
   - Under "SDK Tools" tab, install:
     - Android SDK Build-Tools
     - Android SDK Command-line Tools
     - Android Emulator (optional, for testing)

## Environment Setup

Set the `ANDROID_HOME` environment variable:

**macOS/Linux:**
