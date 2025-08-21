import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/Landing";
import Layout from "../layouts/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../components/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />

      <Route path="/dashboard" element={<DashboardLayout><div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis sequi provident iure aspernatur sed, autem optio illo maxime officiis animi reiciendis cumque eos, ex perferendis praesentium quam similique, architecto voluptatum!</div></DashboardLayout>} />

      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}
