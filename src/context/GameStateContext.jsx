import { createContext, useState } from "react";
import PropTypes from "prop-types";

// Create GameStateContext
export const GameStateContext = createContext();

// Create the GameStateProvider component
export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    roomName: "",
    gameStatus: "",
    currentTheme: "",

    performers: [],
    performanceMode: true,
  });

  const updateGameState = (updates) => {
    setGameState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

GameStateProvider.propTypes = {
  children: PropTypes.node,
};
