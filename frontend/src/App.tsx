import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import SubmitJob from "./pages/SubmitJob";
import ViewResult from "./pages/ViewResult";
import JobHistory from "./pages/JobHistory";
import NotFound from "./pages/NotFound";
import { useTheme } from "./context/ThemeContext";

function App() {
  const location = useLocation();
  const { theme } = useTheme();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className={`app min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="submit" element={<SubmitJob />} />
          <Route path="result/:jobId" element={<ViewResult />} />
          <Route path="history" element={<JobHistory />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
