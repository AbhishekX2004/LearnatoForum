# Backend Server (Learnato Forum)

This Node.js service provides the complete backend API for the Learnato Forum. It handles authentication, database logic, and real-time communication.

## 🛠️ Tech Stack

* **Framework:** Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** Passport.js (Google OAuth 2.0), JWT
* **Real-time:** Socket.io
* **Validation:** Mongoose validation

---

## 🏃‍♂️ How to Run (Standalone)

1.  **Navigate to directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:**
    Create a `.env` file in the `/server` directory:
    ```.env
    MONGO_URI=...
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    JWT_SECRET=...
    COOKIE_KEY=...
    PORT=5001
    ```
4.  **Run development server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5001`.

---

## 🗺️ API Endpoints

### Auth (`/auth`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/google` | Initiates Google OAuth login. |
| `GET` | `/google/callback` | Google redirect URI. Handles login/registration. |
| `POST` | `/set-role` | (Auth) Sets user role on first login. |
| `GET` | `/me` | (Auth) Gets the currently logged-in user. |
| `POST` | `/logout` | (Auth) Clears the JWT cookie to log out. |

### Users (`/api/users`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `PATCH` | `/me` | (Auth) Updates the current user's profile. |
| `GET` | `/me/upvoted-posts` | (Auth) Gets all posts upvoted by the current user. |
| `GET` | `/:userId` | Gets a user's public profile information. |
| `GET` | `/:userId/posts` | Gets all posts created by a specific user. |

### Posts (`/api/posts`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Gets all posts with pagination. |
| `POST` | `/` | (Auth) Creates a new post. |
| `GET` | `/:postId` | Gets a single post and its replies. |
| `DELETE` | `/:postId` | (Auth) Deletes a post (author only). |
| `POST` | `/:postId/reply` | (Auth) Adds a reply to a post. |
| `POST` | `/:postId/upvote` | (Auth) Toggles an upvote on a post. |
| `PATCH` | `/:postId/answer`| (Auth) Marks a post as answered (author/instructor). |

### Search (`/api/search`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Searches posts. (e.g., `?q=node&sortBy=votes`) |