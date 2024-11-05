import PropTypes from "prop-types";
import { useUserContext } from "./useUserContext.js";
import { useGameState } from "./useGameState.jsx";

export const useMessageFilter = () => {
  const { updateCurrentPlayer, currentPlayer, resetPlayer } = useUserContext();
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

    switch (gameStatus) {
      case "registration":
        defaultActions();
        break;

      case "Waiting To Start": {
        const userQuestion =
          message.feedbackQuestion.questions[currentPlayer.userId];
        if (userQuestion) {
          setFeedbackQuestion(userQuestion);
          setChatMessage(userQuestion.question);
        }
        saveNewGameState(message);
        setCurrentStep(2);
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
        saveNewGameState(message);
        updateCurrentPlayer({ finalPrompt: true });
        setCurrentStep(3);
        break;

      default:
        break;
    }

    switch (message.action) {
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
      case "newGameState":
        saveNewGameState(message.gameState);
        break;
      case "debrief": {
        const userQuestion =
          message.feedbackQuestion.questions[currentPlayer.userId];
        setResponseRequired(message.responseRequired);
        setChatMessage(userQuestion);
        setFeedbackQuestion(userQuestion);
        updateGameState({ gameStatus: "debrief" });
        setCurrentStep(4);
        break;
      }
      case "finalSummary":
        updateGameState({ gameStatus: message.gameStatus });
        setChatMessage(message.summary);
        resetPlayer();
        setCurrentStep(5);
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