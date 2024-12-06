import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext.js";
import { useGameState } from "../hooks/useGameState.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";

export const useResponseFilter = () => {
  const { currentPlayer, setCurrentPlayer } = useUserContext();
  const { gameState, updateGameState } = useGameState();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();
  const { sendMessage } = useWebSocket();

  const filterResponse = async ({
    response,
    responseRequired,
    chatMessage,
    setChatMessage,
    setChatResponse,
    setResponseRequired,
    showMessageSent,
  }) => {
    if (responseRequired === "joinRoom") {
      const roomName = response.toLowerCase().trim();
      updateGameState({ roomName: roomName });
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }
      sendMessage(
        JSON.stringify({
          action: "registration",
          gameStatus: "registration",
          roomName: roomName,
          currentPlayer: currentPlayer,
          token: token,
        })
      );
      showMessageSent();
    } else if (
      responseRequired === "postPerformancePerformerFeedbackResponse"
    ) {
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }
      sendMessage(
        JSON.stringify({
          action: responseRequired,
          gameStatus: "debrief",
          roomName: gameState?.roomName,
          currentPlayer: currentPlayer,
          question: chatMessage,
          response: response,
          token: token,
        })
      );
    }
    showMessageSent();
    setChatMessage("");
    setChatResponse("");
    setResponseRequired("");
  };
  filterResponse.propTypes = {
    response: PropTypes.object,
    responseRequired: PropTypes.object,
    chatMessage: PropTypes.string,
    setChatMessage: PropTypes.func,
    setChatResponse: PropTypes.func,
    setResponseRequired: PropTypes.func,
  };

  return { filterResponse };
};
