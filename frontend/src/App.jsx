import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import Toolbox from "./components/Toolbox";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import DashBoard from "./components/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./store/authProvider";
import CanvasPage from "./components/CanvasPage";

function App() {
  const { token, setToken } = useContext(AuthContext)



  return (
    <>
      <Router>
        <Routes>
          {/* Redirect to DashBoard if logged in, otherwise to login */}
          <Route
            path="/"
            element={token ? <DashBoard /> : <Navigate to="/login" />}
          />
          {/* Login route should only be accessible when not logged in */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/load/:canvasId" element={<CanvasPage />} />

        </Routes>
      </Router>

      {/* Optional: Protected components only accessible when logged in */}

    </>
  );
}

export default App;
