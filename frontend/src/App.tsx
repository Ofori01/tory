import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./layouts/auth/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import "webrtc-adapter"; // side-effect import: polyfills WebRTC across browsers
import { io } from "socket.io-client";
import { endpoints } from "./backend/constants";

// Lazy-loaded pages 
const GeneralPage = lazy(() => import("./pages/general/GeneralPage"));
const CameraPage = lazy(() => import("./pages/camera/CameraPage"));
const LogsPage = lazy(() => import("./pages/LogsPage"));

const socket = io(endpoints.streamingApi);
function App() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-400">
          Loading…
        </div>
      }
    >
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
    </Suspense>
  );
}

export default App;
