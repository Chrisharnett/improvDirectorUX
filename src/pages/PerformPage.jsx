import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import MessageCard from "../components/MessageCard.jsx";
import LobbyView from "../views/LobbyView.jsx";
import GameView from "../views/GameView.jsx";
import { MessageModal } from "../modals/MessageModal.jsx";
import { useUserContext } from "../hooks/useUserContext.js";
import { useGameState } from "../hooks/useGameState.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import { useMessageFilter } from "../hooks/useMessageFilter.js";
import { useResponseFilter } from "../hooks/useResponseFilter.js";
import WelcomeView from "../views/WelcomeView.jsx";
import { FadeInContainer } from "../animation/animations.jsx";

const PerformPage = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [responseRequired, setResponseRequired] = useState("");
  const [feedbackQuestion, setFeedbackQuestion] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [disableTimer, setDisableTimer] = useState(false);
  const [showContainer, setShowContainer] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const {
    currentPlayer,
    setCurrentPlayer,
    user,
    updateCurrentPlayer,
    resetPlayer,
    loading,
  } = useUserContext();
  const { sendMessage, ready, incomingMessage } = useWebSocket();
  const { gameState } = useGameState();
  const { screenName } = currentPlayer || "";
  const { accessToken, isTokenExpired, updateRefreshToken } = useTokenContext();
  const { filterMessage } = useMessageFilter();
  const { filterResponse } = useResponseFilter();

  useEffect(() => {
    if (user) {
      updateCurrentPlayer({
        registeredUser: true,
        userId: user.sub,
      });
    }
  }, [user]);

  useEffect(() => {
    if (gameState?.roomName || screenName || chatMessage) {
      setShowContainer(true);
    }
  }, [gameState?.roomName, screenName, chatMessage]);

  useEffect(() => {
    const sendMessageWhenReady = async () => {
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }

      if (token) {
        sendMessage(
          JSON.stringify({
            action: "getStarted",
            currentPlayer: currentPlayer,
            token: token,
          })
        );
        setInitialMessageSent(true);
        showMessageSent({ "Loading Page": "Please wait..." });
      }
    };

    // Execute sendMessageWhenReady only if accessToken is available
    if (ready && !initialMessageSent) {
      sendMessageWhenReady();
    }
  }, [currentPlayer, ready, initialMessageSent, accessToken, isTokenExpired]);

  useEffect(() => {
    if (modalMessage) {
      setShowMessageModal(true);
    }
  }, [modalMessage]);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      filterMessage({
        message,
        setModalMessage,
        setDisableTimer,
        setShowMessageModal,
        setChatMessage,
        setFeedbackQuestion,
        setResponseRequired,
        setCurrentStep,
      });
    }
  }, [incomingMessage]);

  const handleChatResponse = async (response) => {
    filterResponse({
      response,
      responseRequired,
      chatMessage,
      setChatMessage,
      setChatResponse,
      setResponseRequired,
      showMessageSent,
    });
  };

  const handlePlayAgain = async () => {
    setChatMessage("");
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "playAgain",
        currentPlayer: currentPlayer,
        roomName: gameState?.roomName,
        token: token,
      })
    );
    setFeedbackQuestion({});
    resetPlayer();
    showMessageSent();
  };

  const showMessageSent = (message) => {
    setModalMessage(message || { "Message Sent": "Waiting for response" });
    setDisableTimer(true);
    setShowMessageModal(true);
  };

  const { performers } = gameState;

  const renderStep = () => {
    switch (currentStep) {
      //welcome
      case 1:
        return (
          <WelcomeView
            showContainer={showContainer}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            showMessageSent={showMessageSent}
          />
        );

      //Waiting To Start
      case 2:
        return (
          <Row className="mt-3">
            <LobbyView
              feedbackQuestion={feedbackQuestion}
              setChatMessage={setChatMessage}
            />
          </Row>
        );

      //Improvise || Endsong
      case 3:
        return (
          <Row className="mt-3">
            <GameView />
          </Row>
        );

      //Debrief
      case 4:
        return <></>;

      //Final Summary
      case 5:
        return (
          <>
            {currentPlayer?.roomCreator && (
              <>
                <Row className="mt-3">
                  <Button
                    variant="success"
                    type="button"
                    className="w-100"
                    onClick={handlePlayAgain}
                  >
                    {"Play Again!"}
                  </Button>
                </Row>
              </>
            )}
          </>
        );

      default:
        break;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FadeInContainer startAnimation={true}>
        <>
          <Container className="midLayer glass">
            {gameState?.roomName && <h1>{gameState?.roomName}</h1>}
            {chatMessage && (
              <>
                <MessageCard
                  message={chatMessage}
                  response={chatResponse}
                  responseRequired={responseRequired}
                  responsePlaceholder="Enter the room name here."
                  setResponse={setChatResponse}
                  handleSubmit={handleChatResponse}
                />
              </>
            )}
            {renderStep()}
            {performers?.length > 0 && (
              <>
                <h2> Players </h2>
                {performers.map((performer, index) => (
                  <Col key={index} sm="auto">
                    <p>{performer?.screenName}</p>
                  </Col>
                ))}
              </>
            )}
          </Container>
        </>
      </FadeInContainer>
      <MessageModal
        show={showMessageModal}
        setShow={setShowMessageModal}
        message={modalMessage}
        setMessage={setModalMessage}
        disableTimer={disableTimer}
      />
    </>
  );
};

PerformPage.propTypes = {};

export default PerformPage;
