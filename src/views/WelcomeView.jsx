import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { Row, Col, Form } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useGameState } from "../hooks/useGameState.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import { useUserContext } from "../hooks/useUserContext.js";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { FadeInContainer } from "../animation/animations.jsx";

const WelcomeView = ({
  showContainer,
  chatMessage,
  setChatMessage,
  showMessageSent,
}) => {
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const [decided, setDecided] = useState(false);
  const { gameState, updateGameState } = useGameState();
  const { sendMessage } = useWebSocket();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();
  const { user, currentPlayer, updateCurrentPlayer } = useUserContext();

  useEffect(() => {
    if (chatMessage && !decided) {
      setShowJoinOptions(true);
    }
  }, [chatMessage]);
  const handlePerformanceModeSwitch = (e) => {
    updateGameState({ performanceMode: e.target.checked });
  };

  const handleChooseCreatePerformance = async () => {
    // setChatMessage("");
    setDecided(true);
    updateGameState({ gameStatus: "registration" });
    const player = { ...currentPlayer, roomCreator: true };
    updateCurrentPlayer({ roomCreator: true });
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "registration",
        gameStatus: "registration",
        currentPlayer: player,
        loggedIn: user ? true : false,
        performanceMode: gameState.performanceMode,
        token: token,
      })
    );
    showMessageSent();
  };

  const handleChooseJoinPerformance = async () => {
    // setChatMessage("");
    setDecided(true);
    updateGameState({ gameStatus: "registration" });
    let id = currentPlayer.userId;
    if (!id) {
      id = uuidv4();
      updateCurrentPlayer({ userId: id });
    }
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "registration",
        gameStatus: "registration",
        currentPlayer: currentPlayer,
        token: token,
      })
    );
    showMessageSent();
    setShowJoinOptions(false);
  };

  return (
    <>
      {/* {showJoinOptions && ( */}

      <FadeInContainer startAnimation={showContainer}>
        <>
          {!decided && (
            <Row>
              <Col>
                <OptionCard
                  message={"Join Performance"}
                  onClick={handleChooseJoinPerformance}
                />
              </Col>
              <Col>
                <OptionCard
                  message={"Create Performance"}
                  onClick={handleChooseCreatePerformance}
                />
              </Col>
            </Row>
          )}

          <Form>
            <Form.Switch
              type="switch"
              id="performanceMode"
              label="Performance Mode"
              checked={gameState.performanceMode}
              onChange={handlePerformanceModeSwitch}
            />
          </Form>
        </>
      </FadeInContainer>
    </>
  );
};

WelcomeView.propTypes = {
  showContainer: PropTypes.bool,
  chatMessage: PropTypes.string,
  setChatMessage: PropTypes.func,
  showMessageSent: PropTypes.func,
};

export default WelcomeView;
