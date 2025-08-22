import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/Landing";
import Layout from "../layouts/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../components/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import Analytics from "../pages/Analytics";
import MyWalletPage from "../pages/MyWalletPage";
import GoalsPage from "../pages/GoalsPage";
import AIAssistantPage from "../pages/AiAssistantPage";
import BudgetPage from "../pages/BudgetPage";
import TransactionsPage from "../pages/TransactionsPage";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />

      <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
      <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
      <Route path="/wallet" element={<DashboardLayout><MyWalletPage /></DashboardLayout>} />
      <Route path="/goals" element={<DashboardLayout><GoalsPage /></DashboardLayout>} />
      <Route path="/assistant" element={<DashboardLayout><AIAssistantPage /></DashboardLayout>} />
      <Route path="/budget" element={<DashboardLayout><BudgetPage /></DashboardLayout>} />
      <Route path="/transactions" element={<DashboardLayout><TransactionsPage /></DashboardLayout>} />

      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}
