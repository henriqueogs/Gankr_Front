import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { GroupPage } from "./pages/GroupPage";
import { GamePage } from "./pages/GamePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CreateChampionshipPage } from "./pages/CreateChampionshipPage";
import { ChampionshipPage } from "./pages/ChampionshipPage";
import { MyGamesPage } from "./pages/MyGamesPage";
import { MyGroupsPage } from "./pages/MyGroupsPage";
import { MyFriendsPage } from "./pages/MyFriendsPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-games" element={<MyGamesPage />} />
        <Route path="/social/groups" element={<MyGroupsPage />} />
        <Route path="/social/groups/:id" element={<GroupPage />} />
        <Route
          path="/social/groups/:id/championships/new"
          element={<CreateChampionshipPage />}
        />
        <Route path="/social/friends" element={<MyFriendsPage />} />
        <Route path="/users/:id" element={<PublicProfilePage />} />
        <Route path="/games/:id" element={<GamePage />} />
        <Route path="/championships/:id" element={<ChampionshipPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
