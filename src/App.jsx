import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import DashboardPage from "./pages/DashboardPage";
import { isLoggedIn } from "./utils/auth";
import RegisterPage from "./components/RegisterPage";

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
        <Route path="/tasks/:projectId" element={<PrivateRoute><TaskPage /></PrivateRoute>} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
