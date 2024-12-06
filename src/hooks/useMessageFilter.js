import PropTypes from "prop-types";
import { useUserContext } from "./useUserContext.js";
import { useGameState } from "./useGameState.jsx";

export const useMessageFilter = () => {
  const { updateCurrentPlayer, currentPlayer } = useUserContext();
  const { updateGameState } = useGameState();

  const filterMessage = ({
    message,
    setModalMessage,
    setDisableTimer,
    setShowMessageModal,
    setChatMessage,
    setFeedbackQuestion,
    setResponseRequired,
    setCurrentStep,
  }) => {
    const saveNewGameState = (message) => {
      updateGameState(message.gameState);
      for (let i in message.gameState?.performers) {
        if (message.gameState?.performers[i]?.userId === currentPlayer.userId) {
          updateCurrentPlayer(message.gameState?.performers[i]);
        }
      }
    };

    const defaultActions = () => {
      setChatMessage(message.message);
      if (message.responseRequired) {
        setResponseRequired(message.responseRequired);
      }
      saveNewGameState(message);
    };

    const { gameStatus } = message.gameState || "";

    if (message.errorMessage) {
      setModalMessage({ Error: message.errorMessage });
      setDisableTimer(false);
      setShowMessageModal(true);
      return;
    }
    setShowMessageModal(false);

    if (message.action !== "heartbeat") {
      switch (gameStatus) {
        case "registration":
          defaultActions();
          break;

        case "Waiting To Start": {
          if (message.action !== "heartbeat") {
            const userQuestion =
              message.feedbackQuestion?.questions[currentPlayer.userId];
            if (userQuestion) {
              setFeedbackQuestion(userQuestion);
              setChatMessage(userQuestion.question);
            }
            saveNewGameState(message);
            setCurrentStep(2);
          }
          break;
        }

        case "Theme Selection": {
          setCurrentStep(2);
          saveNewGameState(message);
          setChatMessage("Let's select a theme for the song.");
          break;
        }

        case "improvise":
          saveNewGameState(message);
          setChatMessage("");
          setFeedbackQuestion({});
          updateCurrentPlayer({ finalPrompt: false });
          setCurrentStep(3);
          break;

        case "endSong":
          if (message.action !== "heartbeat") {
            saveNewGameState(message);
            updateCurrentPlayer({ finalPrompt: true });
            setCurrentStep(3);
          }
          break;

        default:
          break;
      }
    }

    switch (message.action) {
      case "heartbeat":
        break;
      case "error":
        updateGameState(message.gameState);
        break;
      case "invalid room name":
        setModalMessage({ "Invalid Room Name": "I can't find that room" });
        updateGameState({ roomName: "" });
        defaultActions();
        break;
      case "welcome":
        setChatMessage(message.message);
        if (message.responseRequired) {
          setResponseRequired(message.responseRequired);
        }
        saveNewGameState(message);
        updateGameState({ gameStatus: "welcome" });
        break;
      case "announcement":
        setModalMessage(message.message);
        if (message.disableTimer) {
          setDisableTimer(true);
        }
        setShowMessageModal(true);
        break;
      case "registration":
        defaultActions();
        break;
      case "getNewPlayerData":
        setChatMessage("");
        setCurrentStep(2);
        updateCurrentPlayer(message.currentPlayer);
        break;
      case "newCentralTheme":
        setCurrentStep(2);
        break;
      case "newGameState":
        saveNewGameState(message.gameState);
        break;

      default:
        break;
    }
  };
  filterMessage.propTypes = {
    message: PropTypes.object,
    setModalMessage: PropTypes.func,
    setDisableTimer: PropTypes.func,
    setShowMessageModal: PropTypes.func,
    setChatMessage: PropTypes.func,
    setFeedbackQuestion: PropTypes.func,
    setResponseRequired: PropTypes.func,
    resetPlayer: PropTypes.func,
  };
  return { filterMessage };
};
