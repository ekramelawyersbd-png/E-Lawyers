# Cloudflare R2 Object Storage Integration for LMS Course Materials

This plan introduces direct browser-to-Cloudflare R2 file uploads via backend-generated presigned URLs for LMS course materials (Video lessons, PDF reading notes, and PPT slide decks), paired with time-limited signed read URLs so only authenticated, enrolled students can stream or view protected class assets.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during clarification and govern the implementation:

- **Confirmed Scope — LMS Course Materials Only**: Cloudflare R2 storage will power the 10-class LMS curriculum assets across courses (**Video lessons**, **PDF reading notes**, and **PPT slide decks**) managed in the Admin LMS Course Editor and viewed in the full-page Student Class Learning Viewer.
- **Confirmed Upload Strategy — Direct Browser Upload via Presigned PUT URLs**: The Express backend will generate short-lived S3-compatible R2 presigned `PUT` URLs (`@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`). The browser uploads files directly to Cloudflare R2 with real-time byte-level progress (`XMLHttpRequest` upload progress events) without bottlenecking the Node.js server.
- **Confirmed Access Control — Signed Temporary Read URLs for Enrolled Students**: Object keys are stored in Firestore course lesson records, never public permanent URLs. When an enrolled student opens a class page (`Watch Video`, `Read Notes`, `View PPT`), the client requests a short-lived signed `GET` URL from the backend, which verifies the user's authorization and course/lesson access before signing.
- **Graceful Local Fallback Mode (When R2 Credentials Are Not Yet Configured)**: If Cloudflare R2 environment variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) are absent in development, the backend transparently falls back to a local signed object store with identical presigned PUT/GET semantics and displays a clear configuration status indicator in the Admin Course Editor.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Admin Course Material Uploader**: Enables administrators inside the **Admin LMS Dashboard (`1. Course & Class Editor`)** to select or drag-and-drop Video files (`.mp4`, `.webm`), Reading Notes (`.pdf`), and Presentation Decks (`.pdf`, `.pptx`) for each of the 10 classes (`cls_01` – `cls_10`), upload them directly to Cloudflare R2 with live progress bars, and persist the R2 object metadata into Firestore (`lms_courses`).
  2. **Authorized Student Streaming & Document Viewing**: Enhances the full-page **Class Learning Viewer** so that when an enrolled student navigates to a class's `/video`, `/notes`, or `/ppt` page route, the app fetches a time-limited signed R2 read URL and renders the native HTML5 video stream, embedded PDF/Notes reader, or PPT slide deck viewer alongside the existing structured chapters, notes sections, and watermarks.
- **Target Audience / Persona**:
  - **Course Administrators**: Legal and tax educators uploading large high-definition lecture videos, statutory reading PDFs, and presentation decks per class without server timeout limits.
  - **Enrolled Students**: Learners accessing protected video streams, notes, and slides on dedicated full-page LMS routes with zero unauthorized link sharing.
- **Key Value**: Eliminates server memory/payload limits for large video files, enforces strict expiration on media URLs to prevent piracy, and keeps Firestore synchronized with immutable R2 object keys.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Admin Presigned Upload Flow**:
     - Admin opens **Course Management → 1. Course & Class Editor**, selects a course and a class (`cls_01` through `cls_10`).
     - In the **Learning Materials & R2 Object Storage** section, each material slot (**Video Lesson**, **Reading Notes PDF**, **PPT Presentation**) displays its current R2 storage status (Object Key, File Name, File Size in MB, MIME type, Upload Timestamp, and R2 Bucket connection badge).
     - Admin clicks **Upload to R2** (or drops a file) on any of the three material cards.
     - The client requests a presigned `PUT` URL from `/api/r2/presign-upload`, uploads the file directly to R2 with a live percentage progress bar (`tabular-nums`), and upon `200 OK` automatically updates the lesson's asset metadata and persists it to Firestore.
     - Admin can click **Preview Signed Stream / File** to verify the uploaded R2 object immediately or **Remove R2 Object** to detach/delete it.
  2. **Student Protected Playback & Viewing Flow**:
     - Enrolled student clicks **Watch Video**, **Read Notes**, or **View PPT** to open the dedicated full-page route (`/student/course/:courseId/lesson/:lessonId/video`, `/notes`, or `/ppt`).
     - If the lesson has an uploaded R2 object key (`r2ObjectKey`) and the class is unlocked via sequential Firestore validation, the page requests a temporary signed `GET` URL from `/api/r2/presign-read`.
     - **Video Route (`/video`)**: Plays the real signed R2 video stream inside the watermarked video stage, automatically tracking real playback progress (`onTimeUpdate` / `onEnded`) toward the 80% completion threshold while retaining chapter jump markers.
     - **Notes Route (`/notes`) & PPT Route (`/ppt`)**: Renders an interactive embedded document viewer for the signed R2 PDF/PPT file alongside the structured statutory sections/slides, with zoom controls and page/section completion tracking.

- **Visual Identity & Theme**:
  - **Aesthetic Direction**: High-craft institutional SaaS console and legal academy workspace—clean 1px borders (`border-slate-200`), crisp typographic hierarchy, and zero nested card clutter.
  - **Color Palette & Mood**:
    - Surface canvas: Clean white (`#FFFFFF`) over cool slate (`#F8FAFC`) in Admin and Student workspaces, paired with dark slate (`#0F172A`) media stages for video playback.
    - Semantic status tokens:
      - Emerald (`#16A34A` / `text-emerald-700`): R2 Connected, Upload Complete, Signed URL Active.
      - Amber (`#D97706` / `text-amber-700`): Presigning / Uploading in progress, Local Fallback Mode notice.
      - Rose (`#DC2626` / `text-rose-700`): Upload error, invalid file type, or expired signature retry.
  - **Typography & Hierarchy**:
    - All upload percentages, byte counters (`14.8 MB / 42.0 MB`), expiration timers (`Expires in 59:42`), object keys, and asset IDs use monospace tabular numerals (`font-mono tabular-nums`) to prevent layout jitter during live progress updates.
  - **Interactive Feedback & Motion**:
    - Smooth progress bar fills during `XMLHttpRequest` upload progress events, clear cancel/retry buttons if network interruption occurs, and automatic signed URL refresh if a student remains on a lesson page past URL expiration.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: S3-Compatible Presigned PUT & GET Architecture**
  - *Chosen Approach*: Use AWS SDK v3 (`@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`) pointed at `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com` with `region: "auto"`.
  - *Why*: Cloudflare R2 is S3-API compatible. Generating presigned URLs on the server keeps `R2_SECRET_ACCESS_KEY` strictly server-side while allowing multi-hundred-megabyte video files to stream directly from the admin's browser to Cloudflare R2.
  - *Alternatives Considered*: Proxying raw video files through Express (`multer`) was passed over as the primary mechanism because large video uploads consume server RAM and hit proxy body-size timeouts.
- **Decision 2: Structured Object Key Namespace by Course & Immutable Lesson ID**
  - *Chosen Approach*: Generate deterministic, collision-safe R2 object keys formatted as `lms/{courseId}/{lessonId}/{materialType}/{timestamp}-{sanitizedFileName}` (for example, `lms/personal-income-tax/cls_01/video/1760952000-class-01-intro.mp4`).
  - *Why*: Tying the R2 path to the immutable `lessonId` (`cls_01`..`cls_10`) ensures that renaming a class heading never orphans uploaded R2 files or breaks student completion records.
- **Decision 3: Dual-Mode Development Fallback When R2 Keys Are Unset**
  - *Chosen Approach*: Provide a `/api/r2/status` endpoint and a seamless local object storage fallback route when R2 environment variables are not configured in `.env`, while using real Cloudflare R2 presigned URLs whenever credentials are provided.
  - *Why*: Guarantees the upload workflow, progress bar, signed token verification, and student video/PDF playback work out-of-the-box in preview environments and switch to Cloudflare R2 without code changes once `.env` variables are set.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN LMS DASHBOARD (Browser)                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Course & Class Editor  ──►  R2MaterialUploadCard (Video / Notes / PPT) │  │
│  └───────────────┬───────────────────────────────────┬────────────────────┘  │
└──────────────────┼───────────────────────────────────┼───────────────────────┘
                   │ 1. POST /api/r2/presign-upload    │ 2. Direct PUT (XHR)
                   │    (Admin Auth + File Metadata)   │    with Progress %
                   ▼                                   ▼
┌──────────────────────────────────────┐   ┌───────────────────────────────────┐
│     EXPRESS BACKEND (server.ts)      │   │   CLOUDFLARE R2 OBJECT STORAGE    │
│  • S3Client (region: "auto")         │   │  Bucket: lms/{courseId}/{lesson}  │
│  • POST /api/r2/presign-upload       │   │  • /video/*.mp4, *.webm           │
│  • POST /api/r2/presign-read         │   │  • /notes/*.pdf                   │
│  • DELETE /api/r2/object             │   │  • /ppt/*.pdf, *.pptx             │
│  • GET  /api/r2/status               │   └───────────────────▲───────────────┘
└──────────────────┬───────────────────┘                       │
                   │ 3. Save r2ObjectKey & metadata            │ 5. Stream via
                   ▼                                           │    Signed URL
┌──────────────────────────────────────┐                       │
│     FIREBASE FIRESTORE DATABASE      │                       │
│  • lms_courses/{courseId}            │                       │
│    (videoAsset, notesAsset, pptAsset │                       │
│     with r2ObjectKey, fileSize, etc) │                       │
│  • lms_enrollments/{uid}             │                       │
└──────────────────┬───────────────────┘                       │
                   │ 4. Verify Sequential Unlock & Enrollment  │
                   ▼                                           │
┌──────────────────────────────────────────────────────────────┴───────────────┐
│                 FULL-PAGE CLASS LEARNING VIEWER (Browser)                    │
│  • /student/course/:courseId/lesson/:lessonId/video  (HTML5 Signed Stream)   │
│  • /student/course/:courseId/lesson/:lessonId/notes  (Signed PDF/Notes View) │
│  • /student/course/:courseId/lesson/:lessonId/ppt    (Signed Slide Deck View)│
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Extensions

- **Extended Asset Metadata (`LmsVideoAsset`, `LmsNotesAsset`, `LmsPptAsset`)**:
  - `r2ObjectKey?: string` — The canonical Cloudflare R2 key (`lms/{courseId}/{lessonId}/{type}/{filename}`).
  - `r2FileName?: string` — Original uploaded filename for display in Admin & Student headers.
  - `r2MimeType?: string` — Validated MIME type (`video/mp4`, `video/webm`, `application/pdf`, etc.).
  - `r2FileSizeBytes?: number` — File size in bytes for tabular display.
  - `r2UploadedAt?: string` — ISO timestamp of the last upload.
- **Environment Variables (`.env.example`)**:
  - `R2_ACCOUNT_ID` — Cloudflare Account ID.
  - `R2_ACCESS_KEY_ID` — Cloudflare R2 S3 API Access Key ID.
  - `R2_SECRET_ACCESS_KEY` — Cloudflare R2 S3 API Secret Access Key.
  - `R2_BUCKET_NAME` — Target R2 Bucket name for LMS assets.
  - `R2_SIGNED_URL_TTL_SECONDS` — Expiration window for student signed read URLs (default `3600` seconds / 1 hour).

### Interactive Component & State Mapping

1. **Admin R2 Material Uploader (`R2MaterialUploadCard` inside `AdminLmsDashboardPage`)**:
   - **File Validation**: Validates file extension and MIME type before requesting a presigned URL (`video/*` up to 2 GB for Video; `.pdf` up to 100 MB for Notes; `.pdf` / `.pptx` up to 150 MB for PPT).
   - **Presign & Upload Lifecycle**: Transitions through `idle` → `presigning` → `uploading (0%–100%)` → `verifying` → `completed` (or `error` with retry).Supports aborting an in-flight `XMLHttpRequest` upload.
   - **Firestore Sync**: Upon upload completion, updates the selected class's `videoAsset`, `notesAsset`, or `pptAsset` in `LmsContext` and commits the updated course document to Firestore `lms_courses/{courseId}`, logging an admin audit entry (`R2_ASSET_UPLOADED`).
2. **Student Signed Media Resolver (`ClassLearningPage`)**:
   - **Automatic Signed URL Acquisition**: When `lesson.videoAsset.r2ObjectKey`, `lesson.notesAsset.r2ObjectKey`, or `lesson.pptAsset.r2ObjectKey` is present and `canAccessLessonContent` is allowed, requests a signed `GET` URL from `POST /api/r2/presign-read` with `{ courseId, lessonId, materialType, r2ObjectKey, studentId }`.
   - **Real Video Progress Sync**: When streaming a real R2 video in `/video`, binds `<video onTimeUpdate>` to calculate watched percentage and dispatches `recordVideoCheckpoint` at 10% intervals, automatically marking the video criterion met at $\ge 80\%$.
   - **Embedded Document Viewer in `/notes` and `/ppt`**: Displays an embedded PDF/document frame for the signed R2 URL with a toggle to switch between the **Uploaded R2 Document View** and the **Interactive Statutory Breakdown / Slide View**, ensuring all completion criteria continue to work seamlessly.
