import { Row, Col, Button } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useEffect, useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import ResponseBox from "../components/ResponseBox";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext.js";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import { useGameState } from "../hooks/useGameState.jsx";

const LobbyView = ({
  feedbackQuestion,
  setFeedbackQuestion,
  setChatMessage,
}) => {
  const [disableButton, setDisableButton] = useState(true);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [hideResponseBox, setHideResponseBox] = useState(true);
  const { currentPlayer } = useUserContext();
  const { gameState } = useGameState();
  const { sendMessage } = useWebSocket();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  const nodeRef = useRef(null);

  useEffect(() => {
    if (feedbackQuestion.options?.length == 0) {
      setHideResponseBox(false);
    }
  }, []);

  useEffect(() => {
    if (currentPlayer.roomCreator) {
      setDisableButton(false);
    }
    setShowContent(true);
  }, [currentPlayer.roomCreator]);

  const handleLobbyFeedback = async (option) => {
    if (!option.trim()) {
      setError("Response cannot be empty.");
    } else {
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }
      sendMessage(
        JSON.stringify({
          action: "performerLobbyFeedbackResponse",
          roomName: gameState.roomName,
          feedbackQuestion: feedbackQuestion,
          currentPlayer: currentPlayer,
          response: option,
          token: token,
        })
      );
      setChatMessage(option);
      setHideResponseBox(true);
      setFeedbackQuestion({});
      setError("");
    }
  };

  const handleStartPerformance = async (e) => {
    e.preventDefault();
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "announceStartPerformance",
        roomName: gameState.roomName,
        currentPlayer: currentPlayer,
        token: token,
      })
    );
    sendMessage(
      JSON.stringify({
        action: "startPerformance",
        roomName: gameState.roomName,
        currentPlayer: currentPlayer,
        token: token,
      })
    );
    setDisableButton(true);
  };

  return (
    <>
      <CSSTransition
        in={showContent}
        timeout={700} // Timeout should match the transition duration in CSS
        classNames="fade"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <Row ref={nodeRef}>
          {feedbackQuestion &&
            (feedbackQuestion.options?.length > 0 ? (
              feedbackQuestion.options.map((option, index) => (
                <Col key={index}>
                  <OptionCard
                    key={index}
                    message={option}
                    onClick={handleLobbyFeedback}
                  />
                </Col>
              ))
            ) : (
              <>
                {setHideResponseBox(false)}
                <ResponseBox
                  hidden={hideResponseBox}
                  handleSubmit={handleLobbyFeedback}
                />
              </>
            ))}

          {currentPlayer?.roomCreator && (
            <Button
              variant="success"
              onClick={handleStartPerformance}
              disabled={disableButton}
            >
              Start Performance
            </Button>
          )}
        </Row>
      </CSSTransition>
    </>
  );
};

LobbyView.propTypes = {
  feedbackQuestion: PropTypes.object,
  setFeedbackQuestion: PropTypes.func,
  sendMessage: PropTypes.func,
  setChatMessage: PropTypes.func,
};

export default LobbyView;
