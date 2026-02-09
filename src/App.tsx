import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./layouts/auth/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
