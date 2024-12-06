import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import ResponseBox from "../components/ResponseBox";
import { Row, Col, Button } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useRef, useState, useEffect } from "react";
import { useUserContext } from "../hooks/useUserContext.js";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import { useGameState } from "../hooks/useGameState.jsx";

const LobbyFeedback = ({ feedbackQuestion, setError, setChatMessage }) => {
  const [hideResponseBox, setHideResponseBox] = useState(true);
  const [hideOptions, setHideOptions] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { currentPlayer } = useUserContext();
  const { gameState } = useGameState();
  const { sendMessage } = useWebSocket();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!feedbackQuestion?.options) {
      setHideResponseBox(false);
    } else {
      setHideResponseBox(true);
      setHideOptions(false);
    }
  }, [feedbackQuestion]);

  useEffect(() => {
    if (currentPlayer.roomCreator) {
      setDisableButton(false);
    }
    setShowContent(true);
  }, [currentPlayer?.roomCreator]);

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
      setHideOptions(true);
      // setFeedbackQuestion({});
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
    <CSSTransition
      in={showContent}
      timeout={700} // Timeout should match the transition duration in CSS
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <Row ref={nodeRef}>
        {feedbackQuestion &&
          feedbackQuestion.options?.length > 0 &&
          !hideOptions &&
          feedbackQuestion.options.map((option, index) => (
            <Col key={index}>
              <OptionCard
                key={index}
                message={option}
                onClick={handleLobbyFeedback}
              />
            </Col>
          ))}
        <>
          <ResponseBox
            hidden={hideResponseBox}
            handleSubmit={handleLobbyFeedback}
          />
        </>

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
  );
};

LobbyFeedback.propTypes = {
  feedbackQuestion: PropTypes.object,
  setError: PropTypes.func,
  setChatMessage: PropTypes.func,
};

export default LobbyFeedback;
