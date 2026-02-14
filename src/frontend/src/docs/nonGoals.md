# Non-Goals

This document lists features that are explicitly NOT implemented in this application.

## Screenshot/Screen Recording Blocking

Screenshot and screen recording blocking is **not implemented** and must not be referenced in any user-facing UI text.

**Reason:** Web applications running in browsers cannot technically block screenshots or screen recordings on mobile or desktop operating systems. The browser APIs do not provide this capability, and any attempt to implement such a feature would be ineffective.

**Implementation Note:** Do not add any UI elements, prompts, or text that claim to block screenshots or request a PIN/code for taking screenshots. This feature request has been explicitly skipped.
