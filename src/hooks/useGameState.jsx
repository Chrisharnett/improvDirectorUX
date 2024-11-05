import { useContext } from "react";
import { GameStateContext } from "../context/GameStateContext.jsx";

export const useGameState = () => {
  return useContext(GameStateContext);
};
