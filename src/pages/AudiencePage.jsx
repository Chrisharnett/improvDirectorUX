import { CSSTransition } from "react-transition-group";
import { Container } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { useGameState } from "../hooks/useGameState.jsx";
import AudienceView from "../views/AudienceView.jsx";
import MessageCard from "../components/MessageCard.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";

export const AudiencePage = () => {
  const [showContainer, setShowContainer] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [roomToJoin, setRoomToJoin] = useState("");
  const { updateGameState } = useGameState();
  const { sendMessage, incomingMessage } = useWebSocket();

  const nodeRef = useRef(null);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.gameState && message.action !== "heartbeat") {
        setCurrentStep(2);
        updateGameState(message.gameState);
      }
    }
  }, [incomingMessage]);

  useEffect(() => {
    setShowContainer(true);
    return () => {
      setShowContainer(false);
    };
  });

  const handleJoinRoom = (response) => {
    sendMessage(
      JSON.stringify({
        action: "observeRoom",
        roomName: response,
        currentPlayer: "audience",
      })
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Container className="fullVHeight d-flex justify-content-center align-items-center">
            <MessageCard
              message="Enter the room name you'd like to observe"
              setResponse={setRoomToJoin}
              responseRequired="Observe Room"
              handleSubmit={handleJoinRoom}
            />
          </Container>
        );
      case 2:
        return <AudienceView />;

      default:
        return null;
    }
  };

  return (
    <>
      <CSSTransition
        in={showContainer}
        timeout={700}
        classNames="fade"
        nodeRef={nodeRef}
        unmountOnExit
      >
        {renderStep}
      </CSSTransition>
    </>
  );
};
