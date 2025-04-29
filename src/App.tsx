import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"
import Layout from "./components/Layout"
import DashboardPage from "./components/DashboardPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import OtpPage from "./pages/OtpPage"
import ProfilePage from "./pages/ProfilePage"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App