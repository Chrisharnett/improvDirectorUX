import { Row, Col, Button } from "react-bootstrap";
import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { useGameState } from "../hooks/useGameState";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";

const GameView = ({ handlePlayAgain }) => {
  const [buttonText, setButtonText] = useState("Get Ending");
  const [disableButton, setDisableButton] = useState(false);
  const [currentGroupPrompt, setCurrentGroupPrompt] = useState("");
  const [currentPerformerPrompt, setCurrentPerformerPrompt] = useState("");
  const [hideButtons, setHideButtons] = useState(false);
  const { gameState } = useGameState();
  const { roomName, finalPrompt, gameStatus, centralTheme } = gameState;
  const { currentPlayer } = useUserContext();
  const { sendMessage } = useWebSocket();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  useEffect(() => {
    const currentPrompt = gameState.prompts[gameState.prompts.length - 1];
    const currentGroupPrompt = currentPrompt.groupPrompt;
    setCurrentGroupPrompt(currentGroupPrompt);
    for (let i = currentPrompt.performerPrompts.length - 1; i >= 0; i--) {
      if (currentPrompt.performerPrompts[i].userId === currentPlayer.userId) {
        setCurrentPerformerPrompt(currentPrompt.performerPrompts[i]);
        break;
      }
    }
  }, [gameState]);

  useEffect(() => {
    if (gameStatus === "endSong") {
      setDisableButton(false);
      setHideButtons(true);
    } else if (gameStatus === "improvise") {
      setHideButtons(false);
    } else if (gameStatus === "waiting") {
      setHideButtons(true);
    }
  }, [gameStatus, currentPlayer]);

  const handleEndSong = async () => {
    if (currentPlayer.finalPrompt) {
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }
      sendMessage(
        JSON.stringify({
          action: "performanceComplete",
          roomName: roomName,
          currentPlayer: currentPlayer,
          token: token,
        })
      );
      handlePlayAgain();
      setDisableButton(true);
    } else {
      setDisableButton(true);
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }
      sendMessage(
        JSON.stringify({
          action: "endSong",
          roomName: roomName,
          currentPlayer: currentPlayer,
          token: token,
        })
      );
    }
  };

  return (
    <>
      <Row className="fs-3 m-2" style={{ width: "80%" }}>
        {centralTheme}
      </Row>
      <Row className="d-flex flex-row flex-wrap justify-content-start">
        {!currentGroupPrompt ? (
          <Col sm={12} md={5}>
            <PromptCard
              cardKey={"Waiting"}
              promptTitle={"Waiting"}
              prompt={"Your prompt will be here soon!"}
              userId={currentPlayer.userId}
              sendMessage={sendMessage}
              roomName={roomName}
              currentPlayer={currentPlayer}
              setHideButtons={setHideButtons}
            />
          </Col>
        ) : (
          <>
            <Col sm={12} md={5} className="d-flex">
              <PromptCard
                cardKey={`${currentGroupPrompt.promptTitle}_${currentGroupPrompt.prompt}`}
                currentPrompt={currentGroupPrompt}
                sendMessage={sendMessage}
                hideButtons={hideButtons}
                setHideButtons={setHideButtons}
                animationDirection={"left"}
              />
            </Col>
          </>
        )}
        {currentPerformerPrompt && (
          <Col sm={12} md={5} className="d-flex">
            <PromptCard
              cardKey={`${currentPerformerPrompt.promptTitle}_${currentPerformerPrompt.prompt}`}
              currentPrompt={currentPerformerPrompt}
              sendMessage={sendMessage}
              hideButtons={hideButtons}
              setHideButtons={setHideButtons}
              animationDirection={"right"}
            />
          </Col>
        )}
        {!finalPrompt ? (
          <Button
            variant="warning"
            type="button"
            className="w-50 m-3"
            onClick={handleEndSong}
            disabled={disableButton}
          >
            {buttonText}
          </Button>
        ) : (
          finalPrompt &&
          currentPlayer.roomCreator && (
            <>
              <Row className="mt-3">
                <Button
                  variant="success"
                  type="button"
                  className="w-50 m-3"
                  onClick={handleEndSong}
                >
                  {"Play Again!"}
                </Button>
              </Row>
            </>
          )
        )}
      </Row>
    </>
  );
};

GameView.propTypes = {};

export default GameView;
