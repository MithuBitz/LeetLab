import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <div className="text-3xl font-bold text-indigo-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
