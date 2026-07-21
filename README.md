# Task Management Application

This is a fullstack application that allows managing TODO tasks: creating, removing, and updating status.

## Tech Stack

### Frontend (Workspace: `frontend`)
*   **Framework:** React, Next.js (App Router)
*   **Styling:** Tailwind CSS, shadcn/ui
*   **State Management & Data Fetching:** TanStack Query (React Query), Zustand (for local draft state)
*   **Forms & Validation:** Formik, Yup
*   **Utilities:** date-fns, use-debounce, lucide-react, react-hot-toast

### Backend (Workspace: `backend`)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB, Mongoose
*   **Validation:** celebrate (Joi)
*   **Error Handling:** http-errors

### Shared (Workspace: `interfaces`)
*   Shared TypeScript interfaces and types between frontend and backend.
---

## Key Features & Architecture
*   **Monorepo Structure:** Managed via npm workspaces for seamless dependency management and code sharing (interfaces) between the frontend and backend.
*   **BFF (Backend For Frontend) Pattern:** The Next.js API routes act as a secure proxy layer. The client browser only communicates with the Next.js server, which then securely forwards requests to the Express backend. The actual backend URL is safely hidden from the browser using server-only environment variables.
*   **Server vs. Client Components:** Strictly followed Next.js best practices by isolating interactive UI elements with `"use client"` directives while keeping layouts and static parts as Server Components for optimized performance.
*   **TanStack Query & Optimistic Updates:** Implemented optimistic updates for task status changes, ensuring the UI updates instantly before the server responds, resulting in a perfectly smooth UX.
*   **Database-Level Delegation:** Sorting and filtering are delegated directly to MongoDB queries (`.find()`, `.sort()`).
*   **Debounced Search:** Integrated a 1-second debounce on the search input to significantly reduce unnecessary network requests while typing.
*   **Error & Loading States:** 
    *   Global `loading.tsx`, `error.tsx`, and `not-found.tsx` for core Next.js routing.
    *   Graceful local fallback UI components if the database connection fails.
    *   Smooth visual transitions during background background fetching.
*   **Responsive Design & Accessibility:** Mobile-first approach using Tailwind CSS. Enhanced accessibility (a11y) including screen reader support and keyboard navigation visibility.

---

## API Endpoints & Validation

### Endpoints
*   `GET /api/tasks` - Fetch tasks (accepts `search`, `status`, `sorting` query parameters).
*   `POST /api/tasks` - Create a new task.
*   `PATCH /api/tasks/:taskId` - Update task status (`isDone`).
*   `DELETE /api/tasks/:taskId` - Delete a task.

### Validation
*   **Backend:** Incoming requests are strictly validated using `celebrate` (Joi). It ensures correct date formats, checks string lengths, verifies numeric ranges, and guards against invalid MongoDB ObjectIds, returning descriptive `400 Bad Request` messages.
*   **Frontend:** `Yup` schema validation prevents submission of invalid forms and provides immediate inline error feedback to the user.

---

## Architectural Decisions

**Form Handling (Formik vs. React Hook Form):**
For form management, I used Formik and Yup as I have the most extensive experience with them, which allowed me to implement the functionality quickly and reliably. I am fully aware that in the shadcn/ui ecosystem, the modern standard is React Hook Form + Zod, and I am ready to quickly switch to that stack if needed. However, within the limited time constraints of this task, I prioritized stability and flawless execution.

---

## Local Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies
Since this is an npm workspaces monorepo, simply run the install command in the **root** folder. It will install dependencies for frontend, backend, and interfaces simultaneously.
```bash
npm install
```

### 3. Environment Variables
Create the necessary environment files in their respective workspace folders based on the examples below.

**Backend (`backend/.env`):**
```env
PORT=3000
# Replace with your actual database connection string
MONGODB_URL=mongodb+srv://<username>_db_user:<password>@<username>cluster.xvioasn.mongodb.net/tasks?appName=<username>Cluster
```
**Frontend (`frontend/.env`):**
```env
# Use the deployed backend URL
BACKEND_API_URL=[https://todo-list-dw8a.onrender.com](https://todo-list-dw8a.onrender.com)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run the application
Open two separate terminal windows (or tabs) in the **root** folder of the project.

**Terminal 1 (Start the Backend):**
```bash
npm run dev:backend
```

**Terminal 2 (Start the Frontend):**
```bash
npm run dev:frontend
```

The application should now be running. You can access the frontend at `http://localhost:3001` (or whichever port Next.js assigns).