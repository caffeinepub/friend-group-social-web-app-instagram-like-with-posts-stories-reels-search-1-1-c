# IIT Prep Study Dashboard

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- To-do list with tasks (title, due date/time, checkbox to mark done) and a daily target counter
- Notes section with Apple Notes style: rich text (bold, italic, bullets, headings), drawing/handwriting canvas, and image upload inside notes
- Subjects organization: fixed subjects (Physics, Chemistry, Maths, Biology, English) plus ability to create custom subjects
- All notes and images saved persistently in backend storage
- Dashboard overview showing daily progress, tasks completed vs target, and subject-wise notes count

### Modify
- None

### Remove
- None

## Implementation Plan

### Backend (Motoko)
- Data types: Subject, Task, Note, NoteImage
- Task CRUD: createTask, getTasks, updateTask (toggle done), deleteTask, setDailyTarget, getDailyTarget
- Note CRUD: createNote, getNotes, updateNote, deleteNote
- Note image storage: saveNoteImage (base64), getNoteImages
- Subject CRUD: getSubjects, addSubject, deleteSubject (custom subjects only)
- All data stored per user (using caller principal)

### Frontend
- Main layout: sidebar with subject list + top navigation tabs (Dashboard, Tasks, Notes)
- Dashboard tab: daily target progress bar, tasks completed today, quick stats per subject
- Tasks tab: add task form (title, due date, subject, priority), task list with checkboxes, filter by subject/date, daily target setter
- Notes tab: note list per subject, note editor with:
  - Rich text toolbar (bold, italic, underline, bullet, heading)
  - Drawing/handwriting canvas (HTML5 Canvas with touch support)
  - Image upload button (stored as base64)
  - View saved images in note
- Subject management: add/delete custom subjects
- Mobile-friendly responsive layout
