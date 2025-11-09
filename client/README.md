# Frontend Client (Learnato Forum)

This is the React.js client for the Learnato Forum. It's built with Vite and styled with Tailwind CSS.

## Tech Stack

* **Framework:** React.js
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router v6
* **API Client:** Axios
* **State Management:** React Context (`AuthContext`)

---

## How to Run (Standalone)
1.  **Navigate to directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run development server:**
    ```bash
    npm run dev
    ```
    The client will start on `http://localhost:5173`.

**Note:** The backend server (on port `5001`) must be running for the client to function.

---

## Project Structure

### `src/pages`
* `HomePage.jsx`: The main post feed (`/`).
* `LoginPage.jsx`: The public login page (`/login`).
* `SelectRolePage.jsx`: First-time login page (`/select-role`).
* `PostDetailPage.jsx`: View a single post and replies (`/post/:id`).
* `CreatePostPage.jsx`: Form to create a new post (`/create-post`).
* `ProfilePage.jsx`: User profile page (`/profile/:id`).
* `SearchPage.jsx`: Search results page (`/search`).
* `NotFoundPage.jsx`: 404 fallback page.

### `src/components`
* `Navbar.jsx`: Site-wide header and navigation.
* `PostCard.jsx`: Reusable card for the post feed.
* `UpvoteButton.jsx`: Self-contained upvote component.
* `ReplyItem.jsx`: Component for a single reply.
* `ProtectedRoute.jsx`: Router-level component to protect private pages.

### `src/contexts`
* `AuthContext.jsx`: Manages global user state and authentication status.

### `src/api`
* `index.js`: The central Axios instance, configured with `withCredentials: true` to handle auth cookies.