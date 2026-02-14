# Specification

## Summary
**Goal:** Build a friend-group social web app with Internet Identity auth, persistent profiles/content in a single Motoko canister, Instagram-like posting (posts/stories/reels), searchable 1:1 chat, and additional offline-first sections (games, music, study tools, local “AI tools”), all under a consistent non-blue/purple visual theme.

**Planned changes:**
- Add Internet Identity sign-in/out and an in-app user profile model (display name, username/handle, optional bio, optional avatar), prompting completion on first login and loading on return.
- Implement profile discovery via username/handle search with partial matching and the ability to start/open a 1:1 chat from results.
- Build 1:1 chat UI with conversation list, send text messages, and polling-based refresh; persist message history in the Motoko canister across logins.
- Implement posts: create with caption + optional image upload, store in canister, and render a newest-first feed.
- Implement stories: create with optional image + short text, store/list in canister, and provide a viewer grouped by author.
- Implement reels MVP: create with caption/title and either uploaded small video or a link fallback; store metadata in canister and provide list/viewer.
- Ensure all social data + uploaded media (avatars, post/story images, and reel media if supported) persist in the single Motoko canister with basic authorization (users modify only their own data; messages sent as self).
- Add a global header across all sections with a left-aligned logo and the exact text: "owner Piyush Singh for Yash Jay Anush Harsh Abhay" (English-only UI text).
- Add Games section with at least five distinct in-browser mini-games (e.g., Tic-Tac-Toe, Memory Match, Snake, 2048, simple Quiz), each with restart and instructions.
- Add Music section with an offline-ready local music library UI using bundled/licensed/demo audio files + metadata, including filtering by tags (e.g., India/Pakistan) and playback controls.
- Add Study Tools section with a whiteboard (draw/erase/colors/clear/export PNG) and a PPT-like slide tool (create slides, add text blocks, reorder, present/preview).
- Add AI Tools section with local-only AI writing helpers (templates/heuristics) and a local canvas-based image generator exporting PNG, plus a small local rules-based chatbot for FAQ/navigation shortcuts.
- Apply a coherent, distinctive visual theme across the app that does not primarily use a blue/purple palette.
- Integrate static assets so generated/brand images live in `frontend/public/assets/generated` and the header logo loads from that path.

**User-visible outcome:** Users can sign in with Internet Identity, set up a persistent profile, browse a feed, create posts/stories/reels, search accounts, and chat 1:1 with history preserved across sessions; they can also use built-in games, a local music player, study tools, and local “AI tools” (writing helpers, image generator, and a simple chatbot), all within a consistently themed English UI with a global header and logo.
