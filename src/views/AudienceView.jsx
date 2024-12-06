import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import MessageCard from "../components/MessageCard.jsx";
import AudienceGameView from "../components/AudienceGameView.jsx";

const AudienceView = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { incomingMessage } = useWebSocket();

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      switch (message.gameState?.gameStatus) {
        case "registration":
          setCurrentStep(1);
          break;
        case "Waiting To Start":
          setCurrentStep(1);
          break;
        case "Theme Selection":
          setCurrentStep(1);
          break;
        case "improvise":
          setCurrentStep(2);
          break;
        case "endSong":
          setCurrentStep(2);
          break;
        case "debrief":
          setCurrentStep(3);
          break;
        default:
          break;
      }
    }
  }, [incomingMessage]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <MessageCard message="The musicians are getting things ready." />
          </>
        );
      case 2:
        return <AudienceGameView />;
      case 3:
        return (
          <>
            <MessageCard message="The musicians are finishing the performance and getting the next one ready." />
          </>
        );
      default:
        return null;
    }
  };
  return <>{renderStep()}</>;
};

export default AudienceView;
