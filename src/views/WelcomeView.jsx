import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { Row, Col, Form } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useGameState } from "../hooks/useGameState.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import { useUserContext } from "../hooks/useUserContext.js";
import { v4 as uuidv4 } from "uuid";

const WelcomeView = ({ showContainer, setChatMessage, showMessageSent }) => {
  const { gameState, updateGameState } = useGameState();
  const { sendMessage } = useWebSocket();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();
  const { user, currentPlayer, updateCurrentPlayer } = useUserContext();

  const handlePerformanceModeSwitch = (e) => {
    updateGameState({ performanceMode: e.target.checked });
  };

  const handleChooseCreatePerformance = async () => {
    setChatMessage("");
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
    setChatMessage("");
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
  };

  return (
    <>
      <CSSTransition
        in={showContainer}
        timeout={700}
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
                message={"Create Performance"}
                onClick={handleChooseCreatePerformance}
              />
            </Col>
          </Row>
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
      </CSSTransition>
    </>
  );
};

WelcomeView.propTypes = {
  showContainer: PropTypes.bool,
  setChatMessage: PropTypes.func,
  showMessageSent: PropTypes.func,
};

export default WelcomeView;
