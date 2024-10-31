import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navigation from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PerformPage from "./pages/PerformPage.jsx";
import { PrivateRoute } from "./auth/privateRouteOLD.jsx";
import { Backgrounds } from "./util/Backgrounds.js";
// import { useToken } from "./auth/useTokenOLD.jsx";
import About from "./pages/About.jsx";
import PlayerProfile from "./pages/PlayerProfile.jsx";
import { Spacer } from "./util/Spacer.jsx";
import { useUserContext } from "./auth/useUserContext.js";
// import useWebSocket from "./util/useWebSocket.jsx";
// import axios from "axios";

function App() {
  // const [token, saveToken, ] = useToken();
  // const [error, setError] = useState(null);
  const { user } = useUserContext();
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
        <Route path="/about" element={<About />} />
        <Route
          path="/performPage"
          element={
            <PrivateRoute
              redirectPath="/"
              element={
                <PerformPage
                // loggedIn={loggedIn}
                // LogInUrl={LogInUrl}
                // currentPlayer={currentPlayer}
                // setCurrentPlayer={setCurrentPlayer}
                />
              }
            />
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
