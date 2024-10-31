import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import useWebSocket from "../util/useWebSocket.jsx";
import MessageCard from "../components/MessageCard.jsx";
import OptionCard from "../components/OptionCard.jsx";
import { v4 as uuidv4 } from "uuid";
import LobbyView from "../views/LobbyView.jsx";
import GameView from "../views/GameView.jsx";
import { MessageModal } from "../modals/MessageModal.jsx";
import { CSSTransition } from "react-transition-group";
import useUser from "../auth/useUserOLD.jsx";
import PropTypes from "prop-types";

const PerformPage = ({
  loggedIn,
  LogInUrl,
  currentPlayer,
  setCurrentPlayer,
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [responseRequired, setResponseRequired] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [feedbackQuestion, setFeedbackQuestion] = useState(null);
  const [finalPrompt, setFinalPrompt] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [disableTimer, setDisableTimer] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [performerList, setPerformerList] = useState([]);
  const [showContainer, setShowContainer] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isUserReady, setIsUserReady] = useState(false);
  const { sendMessage, incomingMessage, ready } = useWebSocket();
  const { screenName } = currentPlayer || "";
  const user = useUser();
  const nodeRef = useRef(null);

  useEffect(() => {
    if (loggedIn && user) {
      if (user) {
        setCurrentPlayer((prevPlayer) => ({
          ...prevPlayer,
          registeredUser: true,
          userId: user.sub,
        }));
      }
    }
  }, [user, loggedIn, setCurrentPlayer]);

  useEffect(() => {
    if (roomName || screenName || chatMessage) {
      setShowContainer(true);
    }
  }, [roomName, screenName, chatMessage]);

  const messageActions = ["welcome", "registration", "debrief"];

  useEffect(() => {
    const sendMessageWhenReady = async () => {
      if (ready) {
        sendMessage(
          JSON.stringify({
            action: "getStarted",
            currentPlayer: currentPlayer,
          })
        );
      }
    };
    sendMessageWhenReady();
    showMessageSent({ "Loading Page": "Please wait..." });
  }, [ready]);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.errorMessage) {
        setModalMessage(message.errorMessage);
        setShowMessageModal(true);
      }
      if (message.gameState) {
        setShowMessageModal(false);
        setShowMessageModal(false);
        setDisableTimer(false);
        setGameStatus(message.gameStatus);
        setRoomName(message.roomName);
        for (let i in message.gameState.performers) {
          const screenName = message.gameState.performers[i].screenName;
          if (!performerList.includes(screenName)) {
            setPerformerList((prevList) => [...prevList, screenName]);
          }
          if (message.gameState.performers[i].userId === currentPlayer.userId) {
            setShowPrompt(false);
            if (!currentPlayer.currentPrompts) {
              setCurrentPlayer(message.gameState.performers[i]);
              setShowPrompt(true);
            } else {
              setTimeout(() => {
                setCurrentPlayer(message.gameState.performers[i]);
                setShowPrompt(true);
              }, 700);
            }
          }
        }
      }
      if (message.gameStatus === "improvise") {
        setShowMessageModal(false);
        setChatMessage("");
        setFeedbackQuestion("");
        setFinalPrompt(null);
      }

      if (message.action === "announcement") {
        setModalMessage(message.message);
        if (message.disableTimer) {
          setDisableTimer(true);
        }
        setShowMessageModal(true);
      } else if (messageActions.includes(message.action)) {
        setShowMessageModal(false);
        setChatMessage(message.message);
        if (message.responseRequired) {
          setResponseRequired(message);
        }
        setGameStatus(message.action);
      } else if (message.action === "resetPlayer") {
        resetPlayer();
      } else if (message.action === "finalSummary") {
        setShowMessageModal(false);
        setGameStatus(message.gameStatus);
        setChatMessage(message.summary);
        resetPlayer();
      }

      if (message.gameStatus === "endSong") {
        setShowMessageModal(false);
        setGameStatus(message.action);
        setFinalPrompt(true);
      }

      if (message.feedbackQuestion) {
        setShowMessageModal(false);
        const type = message.feedbackQuestion.feedbackType;
        if (type === "performerLobby") {
          for (let i in message.feedbackQuestion.questions) {
            if (
              message.feedbackQuestion.questions[i].userId ===
              currentPlayer.userId
            ) {
              setResponseRequired(message.responseRequired);
              setChatMessage(
                message.feedbackQuestion.questions[i].question.question
              );
              setFeedbackQuestion(message.feedbackQuestion.questions[i]);
              setGameStatus(message.gameStatus);
            }
          }

          setRoomName(message.roomName);
        }
        if (type === "postPerformancePerformerFeedback") {
          setShowMessageModal(false);
          for (let i in message.feedbackQuestion.questions) {
            if (
              message.feedbackQuestion.questions[i].userId ===
              currentPlayer.userId
            ) {
              setResponseRequired(message.responseRequired);
              setChatMessage(message.feedbackQuestion.questions[i].question);
              setFeedbackQuestion(message.feedbackQuestion.questions[i]);
              setGameStatus("debrief");
            }
          }
        }
      }
    }
  }, [incomingMessage]);

  const handlePerformanceModeSwitch = (e) => {
    setPerformanceMode(e.target.checked);
  };

  const handleChatResponse = (response) => {
    if (responseRequired.responseAction === "newScreenName") {
      const updatedUser = { ...currentPlayer, screenName: response };
      setCurrentPlayer(updatedUser);
      sendMessage(
        JSON.stringify({
          action: "registration",
          currentPlayer: updatedUser,
        })
      );
      showMessageSent();
    } else if (responseRequired.responseAction === "newInstrument") {
      const updatedUser = { ...currentPlayer, instrument: response };
      setCurrentPlayer(updatedUser);
      sendMessage(
        JSON.stringify({
          action: "registration",
          currentPlayer: updatedUser,
        })
      );
    } else if (responseRequired.responseAction === "joinRoom") {
      const roomName = response.toLowerCase().trim();
      setRoomName(roomName);
      sendMessage(
        JSON.stringify({
          action: "registration",
          roomName: roomName,
          currentPlayer: currentPlayer,
        })
      );
      showMessageSent();
    } else if (
      responseRequired === "postPerformancePerformerFeedbackResponse"
    ) {
      sendMessage(
        JSON.stringify({
          action: responseRequired,
          roomName: roomName,
          currentPlayer: currentPlayer,
          question: chatMessage,
          response: response,
        })
      );
    }
    showMessageSent();
    setChatMessage("");
    setChatResponse("");
    setResponseRequired(false);
  };

  const resetPlayer = () => {
    setFeedbackQuestion(null);
    setFinalPrompt(false);
    currentPlayer.currentPrompts = [];
  };

  const handleChooseCreatePerformance = () => {
    if (!loggedIn) {
      window.location.href = LogInUrl;
    } else {
      setChatMessage("");
      setGameStatus("registration");
      currentPlayer.roomCreator = true;
      sendMessage(
        JSON.stringify({
          action: "registration",
          currentPlayer: currentPlayer,
          loggedIn: loggedIn,
          performanceMode: performanceMode,
        })
      );
    }
    showMessageSent();
  };

  const handleChooseJoinPerformance = () => {
    setChatMessage("");
    setGameStatus("registration");
    let id = currentPlayer.userId;
    if (!id) {
      id = uuidv4();
      currentPlayer.userId = id;
    }
    sendMessage(
      JSON.stringify({
        action: "registration",
        currentPlayer: currentPlayer,
      })
    );
    showMessageSent();
  };

  const handlePlayAgain = () => {
    sendMessage(
      JSON.stringify({
        action: "playAgain",
        currentPlayer: currentPlayer,
        roomName: roomName,
      })
    );
    showMessageSent();
  };

  const showMessageSent = (message) => {
    setModalMessage(message || { "Message Sent": "Waiting for response" });
    setDisableTimer(true);
    setShowMessageModal(true);
  };

  return (
    <>
      <CSSTransition
        in={showContainer}
        timeout={700} // Timeout should match the transition duration in CSS
        classNames="fade"
        nodeRef={nodeRef}
        unmountOnExit
      >
        <>
          <Container className="fullVHeight d-flex justify-content-center align-items-center">
            <Container className="midLayer glass" ref={nodeRef}>
              {roomName && <h1>{roomName}</h1>}
              {screenName && <h2>{screenName}</h2>}
              {chatMessage && (
                <>
                  <MessageCard
                    message={chatMessage}
                    response={chatResponse}
                    responseRequired={responseRequired}
                    setResponse={setChatResponse}
                    handleSubmit={handleChatResponse}
                  />
                </>
              )}
              {gameStatus === "welcome" && (
                <>
                  <CSSTransition
                    in={showContainer}
                    timeout={700} // Timeout should match the transition duration in CSS
                    classNames="fade"
                    unmountOnExit
                  >
                    <>
                      <Row>
                        <Col>
                          <OptionCard
                            message={"Join Performance"}
                            onClick={handleChooseJoinPerformance}
                          />
                        </Col>
                        <Col>
                          <OptionCard
                            message={
                              loggedIn
                                ? "Create Performance"
                                : "Log in to create a performance"
                            }
                            onClick={handleChooseCreatePerformance}
                          />
                        </Col>
                      </Row>
                      <Form>
                        <Form.Switch
                          type="switch"
                          id="performanceMode"
                          label="Performance Mode"
                          checked={performanceMode}
                          onChange={handlePerformanceModeSwitch}
                        />
                      </Form>
                    </>
                  </CSSTransition>
                </>
              )}
              <Row className="mt-3">
                {gameStatus === "finalSummary" &&
                  currentPlayer?.roomCreator && (
                    <>
                      <>
                        <Button
                          variant="success"
                          type="button"
                          className="w-100"
                          onClick={handlePlayAgain}
                        >
                          {"Play Again!"}
                        </Button>
                      </>
                    </>
                  )}
                {gameStatus === "Waiting To Start" && (
                  <LobbyView
                    feedbackQuestion={feedbackQuestion}
                    setFeedbackQuestion={setFeedbackQuestion}
                    sendMessage={sendMessage}
                    roomName={roomName}
                    currentPlayer={currentPlayer}
                    setChatMessage={setChatMessage}
                  />
                )}
                {(gameStatus === "improvise" || gameStatus === "endSong") && (
                  <>
                    <GameView
                      showPrompt={showPrompt}
                      currentPlayer={currentPlayer}
                      roomName={roomName}
                      sendMessage={sendMessage}
                      finalPrompt={finalPrompt}
                      gameStatus={gameStatus}
                    />
                  </>
                )}
              </Row>
              {performerList.length > 0 && (
                <>
                  <h2> Players </h2>
                  {performerList.map((performer, index) => (
                    <Col key={index} sm="auto">
                      <p>{performer}</p>
                    </Col>
                  ))}
                </>
              )}
            </Container>
          </Container>
        </>
      </CSSTransition>
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

PerformPage.propTypes = {
  loggedIn: PropTypes.bool,
  LogInUrl: PropTypes.string,
  currentPlayer: PropTypes.object,
  setCurrentPlayer: PropTypes.func,
};

export default PerformPage;
