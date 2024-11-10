import { useState } from "react";
import PropTypes from "prop-types";
import LobbyFeedback from "../components/LobbyFeedback.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useEffect } from "react";
import CentralTheme from "../components/CentralTheme.jsx";
import { useGameState } from "../hooks/useGameState.jsx";

const LobbyView = ({ feedbackQuestion, setChatMessage }) => {
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { incomingMessage } = useWebSocket();
  const { updateGameState } = useGameState;

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.action === "newCentralTheme") {
        setCurrentStep(2);
      }
    }
  }, [incomingMessage]);

  const renderStep = () => {
    switch (currentStep) {
      // Feedback
      case 1:
        return (
          <LobbyFeedback
            feedbackQuestion={feedbackQuestion}
            setError={setError}
            setChatMessage={setChatMessage}
          />
        );
      // Theme selection
      case 2:
        return <CentralTheme />;
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

LobbyView.propTypes = {
  feedbackQuestion: PropTypes.object,
  setFeedbackQuestion: PropTypes.func,
  sendMessage: PropTypes.func,
  setChatMessage: PropTypes.func,
};

export default LobbyView;
