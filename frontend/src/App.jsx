import { Navigate, Route, Routes } from "react-router-dom";

import BaseLayout from "./components/layout/BaseLayout";
import ActiveElectionPage from "./pages/ActiveElectionPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import VoteSuccessPage from "./pages/VoteSuccessPage";
import VotingPage from "./pages/VotingPage";

function App() {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/vote" element={<VotingPage />} />
        <Route path="/student/vote/success" element={<VoteSuccessPage />} />
        <Route path="/election/active" element={<ActiveElectionPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BaseLayout>
  );
}

export default App;
