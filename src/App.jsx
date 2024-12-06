import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navigation from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PerformPage from "./pages/PerformPage.jsx";
import { PrivateRoute } from "./auth/privateRoute.jsx";
import { Backgrounds } from "./util/Backgrounds.js";
// import { useToken } from "./auth/useTokenOLD.jsx";
import About from "./pages/About.jsx";
import PlayerProfile from "./pages/PlayerProfile.jsx";
import { Spacer } from "./util/Spacer.jsx";
import { useUserContext } from "./hooks/useUserContext.js";
import { GameStateProvider } from "./context/GameStateContext.jsx";
import { AudiencePage } from "./pages/AudiencePage.jsx";
import Callback from "./auth/Callback.jsx";

function App() {
  const { user } = useUserContext();

  useEffect(() => {
    const randomBackground =
      Backgrounds[Math.floor(Math.random() * Backgrounds.length)];

    document.body.style.backgroundImage = `url(${randomBackground})`;
    document.body.style.backgroundSize = "cover";

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <Spacer />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/performPage" replace /> : <HomePage />}
        />
        <Route path="/callback" element={<Callback />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/performPage"
          element={
            <GameStateProvider>
              <PrivateRoute redirectPath="/">
                <PerformPage />
              </PrivateRoute>
            </GameStateProvider>
          }
        />
        <Route
          path="/audience"
          element={
            <GameStateProvider>
              <AudiencePage />
            </GameStateProvider>
          }
        />
        <Route
          path="/playerProfile"
          element={
            <PrivateRoute redirectPath="/">
              <PlayerProfile />
            </PrivateRoute>
          }
        />
      </Routes>
      <Spacer />
    </BrowserRouter>
  );
}

export default App;
