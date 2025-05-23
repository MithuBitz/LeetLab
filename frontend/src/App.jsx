import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import HomePage from "./page/HomePage.jsx";
import LoginPage from "./page/LoginPage.jsx";
import SignupPage from "./page/SignupPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import Layout from "./Layout/Layout.jsx";
import AddProblem from "./page/AddProblem.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />
        <Route element={<AdminRoute />}>
          <Route path="/add-problem" element={
            authUser ? <AddProblem /> : <Navigate to="/" />
          } />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
