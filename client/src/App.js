import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Signup from "./Signup";
import Login from "./Login";
import LostItems from "./LostItems";
import FoundItems from "./FoundItems";
import Home from "./Home";
import ItemPage from "./ItemPage";
import LostItem from "./Lost_item";
import MyListings from "./MyListings";
window.OneSignal = window.OneSignal || [];

// Auth guard: redirects to /log-in if no token
function ProtectedRoute({ children }) {
  const token = window.localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/log-in" replace />;
  }
  return children;
}

// Root redirect: if logged in -> Home, else -> Login
function RootRedirect() {
  const token = window.localStorage.getItem("token");
  return <Navigate to={token ? "/home" : "/log-in"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/lostitems" element={<ProtectedRoute><LostItems /></ProtectedRoute>} />
          <Route path="/founditems" element={<ProtectedRoute><FoundItems /></ProtectedRoute>} />
          <Route path="/postitem" element={<ProtectedRoute><LostItem /></ProtectedRoute>} />
          <Route path="/mylistings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
          <Route path="/:item" element={<ItemPage />} />
          <Route path="/*" element={<RootRedirect />} />
        </Routes>
        <ToastContainer />
      </>
    </BrowserRouter>
  );
}

export default App;
