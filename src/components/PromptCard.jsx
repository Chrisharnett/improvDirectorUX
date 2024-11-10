import { Card, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactionButtons from "./ReactionButtons";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext";
import { useGameState } from "../hooks/useGameState.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";

const PromptCard = ({ promptTitle, prompt, hideButtons, setHideButtons }) => {
  const [title, setTitle] = useState("");
  const [disableButtons, setDisableButtons] = useState(false);
  const [disableLikeButton, setDisableLikeButton] = useState(false);
  const { currentPlayer } = useUserContext();
  const { sendMessage } = useWebSocket();
  const { gameState } = useGameState();
  const { roomName } = gameState;
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  useEffect(() => {
    if (promptTitle === "groupPrompt") {
      setTitle("Group");
    } else if (promptTitle === "endPrompt") {
      setTitle("Final Prompt");
      setHideButtons(true);
    } else if (promptTitle !== "Final Prompt") {
      setTitle(currentPlayer.screenName || promptTitle);
    }
    setDisableButtons(false);
    setDisableLikeButton(false);
  }, [prompt, promptTitle]);

  const handleThumbsUp = async () => {
    setDisableLikeButton(true);
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        reaction: "like",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
        currentPlayer: currentPlayer,
        token: token,
      })
    );
  };

  const handleThumbsDown = async () => {
    setDisableButtons(true);
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        currentPlayer: currentPlayer,
        reaction: "reject",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
        token: token,
      })
    );
  };

  const handleMoveOn = async () => {
    setDisableButtons(true);
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        currentPlayer: currentPlayer,
        reaction: "moveOn",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
        token: token,
      })
    );
  };

  return (
    <>
      <Card
        className="m-2 p-2"
        style={{
          backdropFilter: "blur(10px) saturate(50%)",
          WebkitBackdropFilter: "blur(21px) saturate(50%)",
          backgroundColor: "rgba(1, 1, 1, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.01)",
          borderRadius: "15px",
          color: "rgb(255, 255, 255, 1)",
        }}
      >
        {prompt && (
          <>
            <Card.Title className="fs-4">{title}</Card.Title>
            <Card.Body className="fs-5">{prompt}</Card.Body>
            <Card.Footer>
              {!hideButtons && (
                <Row>
                  <ReactionButtons
                    onThumbsUpClick={handleThumbsUp}
                    onThumbsDownClick={handleThumbsDown}
                    middleButtonClick={handleMoveOn}
                    middleButtonLabel={"Move On"}
                    middleButtonHide={false}
                    disableButtons={disableButtons}
                    disableLikeButton={disableLikeButton}
                  />
                </Row>
              )}
            </Card.Footer>
          </>
        )}
      </Card>
    </>
  );
};

PromptCard.propTypes = {
  promptTitle: PropTypes.string,
  prompt: PropTypes.string,
  hideButtons: PropTypes.bool,
  setHideButtons: PropTypes.func,
};

export default PromptCard;
