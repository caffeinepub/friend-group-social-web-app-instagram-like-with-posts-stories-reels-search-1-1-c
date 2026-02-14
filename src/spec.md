# Specification

## Summary
**Goal:** Add password-locked rooms (global and user-created), user music uploads, owner-only deletion for feed content, and refresh the authenticated header/menu UI.

**Planned changes:**
- Update the authenticated header to show only the single line text “created by Piyush Singh” in black, removing prior multi-line header text.
- In the header area, show the logged-in user’s username, and below it show the static line “Inbox owner in your account” followed by the static username “psrpiyush”, with a safe placeholder when the profile username is not available.
- Add a horizontally scrollable functional button row below the header with exactly: “Whiteboard”, “AI Image Generation”, “AI Writing”, “Chatbot”, linking to existing feature screens.
- Add owner-only delete actions for posts, stories, and reels in the UI, with backend enforcement and persistent deletion so items don’t return after refresh/re-login.
- Extend the Music section to let users upload audio files, store them persistently in the canister, list their uploaded tracks, and play them in-app.
- Implement a global password-locked “Notifications & Info” room (password “piyush1618rajput1816”) with a persistent shared text feed.
- Add an admin unlock mode inside the global locked room (admin password “piyush13775”) to ban users from accessing the room, persisting bans across sessions.
- Support user-created private password-locked chat rooms (name + password) with persistent messages in the canister.
- Ensure screenshot/screen-recording blocking is not implemented and no related UI/text exists.

**User-visible outcome:** Logged-in users see an updated header and scrollable feature menu, can delete only their own posts/stories/reels, can upload and play their own music, and can access password-protected rooms (including a global notifications/info room with admin bans and user-created private locked rooms) with data persisting across refresh and re-login.
