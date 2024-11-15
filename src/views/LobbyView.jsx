import { useState } from "react";
import PropTypes from "prop-types";
import LobbyFeedback from "../components/LobbyFeedback.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useEffect } from "react";
import CentralTheme from "../components/CentralTheme.jsx";
import Registration from "../components/Registration.jsx";
import { useUserContext } from "../hooks/useUserContext";

const LobbyView = ({ feedbackQuestion, setChatMessage }) => {
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { incomingMessage } = useWebSocket();
  const { updateCurrentPlayer } = useUserContext();

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      switch (message.action) {
        case "getNewPlayerData":
          setChatMessage("");
          setCurrentStep(0);
          break;
        case "newCentralTheme":
          setCurrentStep(2);
          break;
        default:
          break;
      }
    }
  }, [incomingMessage]);

  const renderStep = () => {
    switch (currentStep) {
      // Registration
      case 0:
        return <Registration setChatMessage={setChatMessage} />;
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
