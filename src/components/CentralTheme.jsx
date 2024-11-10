import PropTypes from "prop-types";
import { useGameState } from "../hooks/useGameState.jsx";
import { useUserContext } from "../hooks/useUserContext.js";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import ReactionButtons from "./ReactionButtons.jsx";
import MessageCard from "./MessageCard.jsx";
import ResponseBox from "./ResponseBox.jsx";

const CentralTheme = () => {
  const [reaction, setReaction] = useState("");
  const [idea, setIdea] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const { gameState } = useGameState();
  const { sendMessage, incomingMessage } = useWebSocket();
  const { accessToken, isTokenExpired, updateRefreshToken } = useTokenContext();
  const { currentPlayer } = useUserContext();

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      switch (message.action) {
        case "Waiting for theme response.":
          setCurrentStep(3);
          setProgress(message.progress);
          break;
        default:
          break;
      }
    }
  }, [incomingMessage]);
  const handleReaction = (reaction) => {
    setReaction(reaction);
    setCurrentStep(2);
  };

  const handleResponseSubmit = async (response) => {
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "centralThemeResponse",
        roomName: gameState?.roomName,
        currentPlayer: currentPlayer,
        playerReaction: { reaction: reaction, suggestion: response },
        token: token,
      })
    );
    setCurrentStep(3);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ReactionButtons
            onThumbsUpClick={handleReaction("like")}
            onThumbsDownClick={handleReaction("dislike")}
          />
        );
      case 2:
        return (
          <ResponseBox
            headerMessage={
              "How could we refine this theme to better suit your vision?"
            }
            hidden={false}
            handleSubmit={handleResponseSubmit}
          />
        );
      case 3:
        return (
          <Container className="fs-4">
            {progress} of {gameState.performers.length} performers have
            responded.
          </Container>
        );
      default:
        break;
    }
  };
  return (
    <>
      <MessageCard message={gameState?.centralTheme} />
      {renderStep()}
    </>
  );
};

export default CentralTheme;
