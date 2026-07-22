import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HabitsProvider } from "./contexts/HabitsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";
import { AppBackground } from "./components/layout/AppBackground";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { Habits } from "./pages/Habits";
import { HabitDetails } from "./pages/HabitDetails";
import { Statistics } from "./pages/Statistics";
import { AIInsights } from "./pages/AIInsights";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitsProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppBackground />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/habits/:id" element={<HabitDetails />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HabitsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
