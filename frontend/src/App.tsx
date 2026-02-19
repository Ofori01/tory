import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./layouts/auth/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import GeneralPage from "./pages/general/GeneralPage";
import CameraPage from "./pages/camera/CameraPage";
import LogsPage from "./pages/LogsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/*" element={<MainLayout />} >
          <Route index  element={<GeneralPage />} />
          <Route path="camera" element={<CameraPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
