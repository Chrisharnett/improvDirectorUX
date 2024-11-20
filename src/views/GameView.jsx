import { Row, Col, Button } from "react-bootstrap";
import PromptCard from "../components/PromptCard";
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { useGameState } from "../hooks/useGameState";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";

const GameView = () => {
  const [buttonText, setButtonText] = useState("Get Ending");
  const [disableButton, setDisableButton] = useState(false);
  const [promptKeys, setPromptKeys] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);
  const { gameState } = useGameState();
  const { roomName, finalPrompt, gameStatus, centralTheme } = gameState;
  const { currentPlayer } = useUserContext();
  const { sendMessage } = useWebSocket();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  const refs = useRef({});

  useEffect(() => {
    setPromptKeys(Object.keys(currentPlayer.currentPrompts));
  }, [currentPlayer.currentPrompts]);

  useEffect(() => {
    if (gameStatus === "endSong") {
      setDisableButton(false);
      setButtonText("End and Log Performance");
      setHideButtons(true);
    } else if (gameStatus === "improvise") {
      setHideButtons(false);
    } else if (gameStatus === "waiting") {
      setHideButtons(true);
    }
  }, [gameStatus, currentPlayer]);

  useEffect(() => {
    const newPromptKeys = Object.keys(currentPlayer.currentPrompts);
    setPromptKeys((prevKeys) => {
      if (newPromptKeys.length !== prevKeys.length) {
        return newPromptKeys;
      }
      return prevKeys;
    });
  }, [currentPlayer]);

  promptKeys.forEach((key) => {
    if (!refs.current[key]) {
      refs.current[key] = React.createRef();
    }
  });

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

  // Separate prompts into two groups: all except performerPrompt, and performerPrompt itself
  const nonPerformerPrompts = promptKeys.filter(
    (key) => key !== "performerPrompt"
  );
  const performerPrompt = promptKeys.find((key) => key === "performerPrompt");

  const generateUniqueKey = (key) =>
    `${key}-${currentPlayer.currentPrompts[key]?.prompt}`;

  return (
    <>
      <Row className="fs-3 m-2" style={{ width: "80%" }}>
        {centralTheme}
      </Row>
      <Row className="d-flex flex-row flex-wrap justify-content-start">
        {nonPerformerPrompts.length < 1 && !performerPrompt ? (
          <Col sm={12} md={5}>
            <PromptCard
              cardKey={"Waiting"}
              promptTitle={"Waiting"}
              prompt={"Your prompt will be here soon!"}
              userId={currentPlayer.userId}
              sendMessage={sendMessage}
              roomName={roomName}
              currentPlayer={currentPlayer}
            />
          </Col>
        ) : (
          <>
            {nonPerformerPrompts.map((nonPerformerPrompt) => {
              const uniqueKey = generateUniqueKey(nonPerformerPrompt);
              return (
                <Col key={uniqueKey} sm={12} md={5} className="d-flex">
                  <PromptCard
                    cardKey={uniqueKey}
                    promptTitle={nonPerformerPrompt}
                    prompt={
                      currentPlayer.currentPrompts[nonPerformerPrompt]?.prompt
                    }
                    sendMessage={sendMessage}
                    hideButtons={hideButtons}
                    setHideButtons={setHideButtons}
                    animationDirection={"left"}
                  />
                </Col>
              );
            })}

            {performerPrompt && (
              <Col
                key={generateUniqueKey(performerPrompt)}
                sm={12}
                md={5}
                className="d-flex"
              >
                <PromptCard
                  cardKey={generateUniqueKey(performerPrompt)}
                  promptTitle={performerPrompt}
                  prompt={currentPlayer.currentPrompts[performerPrompt]?.prompt}
                  sendMessage={sendMessage}
                  hideButtons={hideButtons}
                  animationDirection={"right"}
                />
              </Col>
            )}
          </>
        )}
        {(!finalPrompt || (finalPrompt && currentPlayer.roomCreator)) && (
          <Button
            variant="warning"
            type="button"
            className="w-50 m-3"
            onClick={handleEndSong}
            disabled={disableButton}
          >
            {buttonText}
          </Button>
        )}
      </Row>
    </>
  );
};

GameView.propTypes = {};

export default GameView;
