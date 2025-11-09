import './App.css'
import { Routes, Route } from 'react-router-dom';

// Layout & Route Handlers
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelectionRoute from './components/RoleSelectionRoute';

// --- Page Components (We'll create placeholders next) ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SelectRolePage from './pages/SelectRolePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Routes with Navbar */}
      <Route path="/" element={<Layout />}>
        {/* --- Protected Routes (Must be logged in with a role) --- */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="create-post" element={<CreatePostPage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        {/* --- Role Selection Route --- */}
        <Route element={<RoleSelectionRoute />}>
          <Route path="select-role" element={<SelectRolePage />} />
        </Route>
      </Route>

      {/* --- Public Routes (No Navbar) --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
