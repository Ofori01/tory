import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./layouts/auth/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import GeneralPage from "./pages/general/GeneralPage";
import CameraPage from "./pages/camera/CameraPage";
import LogsPage from "./pages/LogsPage";
// eslint--next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { endpoints } from "./backend/constants";

const socket = io(endpoints.streamingApi);
function App() {
  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/*" element={<MainLayout />}>
          <Route index element={<GeneralPage />} />
          <Route path="camera" element={<CameraPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
