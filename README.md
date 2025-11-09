# Learnato Discussion Forum

**Theme:** "Empower learning through conversation." [cite: 4]

This project is a full-stack, microservice-based discussion forum built for the Learnato Hackathon. It allows learners and instructors to post questions, share insights, and reply in real time.

**[View Live Demo](https://learnato-forum-381650529713.us-central1.run.app/)**

---

## Core Features
* **Google OAuth Authentication:** Secure login using Google (with JWTs). [cite: 25]
* **Role Selection:** Users choose "Learner" or "Instructor" on first login.
* **Post & Reply System:** Full CRUD functionality for creating posts and adding replies. [cite: 21]
* **Upvoting:** Users can upvote posts (but not their own). [cite: 21]
* **Real-time Updates:** New posts and replies are broadcast instantly (using Socket.io). [cite: 23]
* **Pagination:** Efficient cursor-based pagination on all feeds.
* **Profile Pages:** View user profiles, their posts, and (for your own profile) your upvoted posts.
* **Search:** A full-text search for all posts (via MongoDB Text Index). [cite: 23]
* **Mark as Answered:** Authors or Instructors can mark a post as resolved. [cite: 24]
* **Dockerized:** The entire application is containerized for production. [cite: 14]

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with Mongoose) |
| **Real-time** | Socket.io |
| **Authentication** | Passport.js (Google OAuth 2.0), JSON Web Tokens (JWT) |
| **Deployment** | Docker, Google Cloud Run |

---

## Environment Variables

To run this project, you need to create a `.env` file in the root directory.

```.env
# .env.example

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://...

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Random strings for securing tokens and cookies
JWT_SECRET=a_very_long_and_random_secret_key
COOKIE_KEY=another_long_and_random_secret_key