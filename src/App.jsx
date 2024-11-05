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
  // const [token, saveToken, ] = useToken();
  // const [error, setError] = useState(null);
  // const [currentPlayer, setCurrentPlayer] = useState({});
  // const loggedIn = useMemo(() => !!token, [token]);
  // const [codeProcessed, setCodeProcessed] = useState(false);
  // const { sendMessage, incomingMessage } = useWebSocket();

  // Handle token exchange from URL parameter
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("code");

  //   if (code && !codeProcessed) {
  //     codeForToken(code);
  //     setCodeProcessed(true);
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, []);

  // const codeForToken = async (code) => {
  //   try {
  //     const callback =
  //       import.meta.env.VITE_ENV === "prod"
  //         ? import.meta.env.VITE_COGNITO_CALLBACK_PROD
  //         : import.meta.env.VITE_COGNITO_CALLBACK_LOCAL;
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_AUTH_API}`,
  //       JSON.stringify({
  //         code: code,
  //         redirect_uri: callback,
  //       })
  //     );
  //     const newToken = response.data;

  //     saveToken(newToken);
  //   } catch (error) {
  //     console.error("Error fetching token:", error);
  //     setError(error);
  //   }
  // };

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
          element={
            user ? (
              <Navigate to="/performPage" replace />
            ) : (
              <HomePage
              // loggedIn={loggedIn}
              />
            )
          }
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
              <PlayerProfile
              // currentPlayer={currentPlayer}
              // setCurrentPlayer={setCurrentPlayer}
              />
            </PrivateRoute>
          }
        />
      </Routes>
      <Spacer />
    </BrowserRouter>
  );
}

export default App;
