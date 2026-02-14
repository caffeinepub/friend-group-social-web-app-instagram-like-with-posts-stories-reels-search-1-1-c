# Specification

## Summary
**Goal:** Fix the deployed app’s startup/loading reliability and provide a downloadable Android APK (built via the existing Capacitor setup) with a stable in-app download link.

**Planned changes:**
- Investigate and resolve the “app not loading” behavior so logged-out users see the Login screen quickly and logged-in users reliably reach the main app (no infinite spinner/blank screen).
- Harden frontend startup and actor initialization to avoid blocking rendering when optional secrets are missing, and show an English error state with a retry action on initialization failures.
- Build an Android APK artifact from the repo using the existing Capacitor Android setup and document the exact output path(s).
- Serve the APK as a static frontend asset and add an English-labeled “Download Android APK” link in an appropriate always-accessible location (e.g., Login screen and/or an Info/About section).
- Update documentation with prerequisites, exact build commands, how to place the APK into the static download path, and verification steps to ensure no white screen / stuck loading on web and Android.

**User-visible outcome:** The web app reliably loads into Login (logged out) or the authenticated experience (logged in), shows a clear English error with retry instead of spinning forever on failures, and provides a visible “Download Android APK” link that downloads an installable APK.
