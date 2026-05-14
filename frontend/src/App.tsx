import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import AboutPage from '@/pages/AboutPage'
import ForumPage from '@/pages/ForumPage'
import ForumThreadPage from '@/pages/ForumThreadPage'
import ThreadDetailPage from '@/pages/ThreadDetailPage'
import ProfilePage from '@/pages/ProfilePage'
import AdminPanelPage from './pages/AdminPanelPage'

const ProtectedRoute = () => {
  const auth = useAuth()

  if (auth.accessToken === null) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/:id" element={<ForumThreadPage />} />
            <Route path="/forum/:id/thread/:threadId" element={<ThreadDetailPage />} />
            <Route path="/profile" element={<ProtectedRoute />} >
              <Route path="" element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
