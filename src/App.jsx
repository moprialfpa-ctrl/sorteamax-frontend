import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminResultsPage from "./pages/AdminResultsPage";
import AdminDeunaPaymentsPage from "./pages/AdminDeunaPaymentsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminTicketsPage from "./pages/AdminTicketsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminWinnersPage from "./pages/AdminWinnersPage";
import AdminBankAccountsPage from "./pages/AdminBankAccountsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import DrawResultsPage from "./pages/DrawResultsPage";
import BankAccountPage from "./pages/BankAccountPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/draws/:drawId/results" element={<ProtectedRoute><AdminResultsPage /></ProtectedRoute>} />
        <Route path="/admin/deuna-payments" element={<ProtectedRoute><AdminDeunaPaymentsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/tickets" element={<ProtectedRoute><AdminTicketsPage /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><AdminPaymentsPage /></ProtectedRoute>} />
        <Route path="/admin/winners" element={<ProtectedRoute><AdminWinnersPage /></ProtectedRoute>} />
        <Route path="/admin/bank-accounts" element={<ProtectedRoute><AdminBankAccountsPage /></ProtectedRoute>} />

        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
        <Route path="/user/tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
        <Route path="/user/bank-account" element={<ProtectedRoute><BankAccountPage /></ProtectedRoute>} />
        <Route path="/draws/:drawId/results" element={<ProtectedRoute><DrawResultsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
