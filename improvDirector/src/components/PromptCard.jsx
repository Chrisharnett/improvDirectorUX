import { Card, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactionButtons from "./ReactionButtons";

const PromptCard = ({
  promptTitle,
  sendMessage,
  prompt,
  currentPlayer,
  roomName,
  hideButtons,
  setHideButtons,
}) => {
  const [title, setTitle] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);
  const [disableLikeButton, setDisableLikeButton] = useState(false);

  useEffect(() => {
    if (promptTitle === "groupPrompt") {
      setTitle("Group");
    } else if (promptTitle === "endPrompt") {
      setTitle("Final Prompt");
      setHideButtons(true);
    } else if (promptTitle !== "Final Prompt") {
      setTitle(currentPlayer.screenName);
    }
    if (prompt) {
      setShowContent(true);
    }
    setDisableButtons(false);
    setDisableLikeButton(false);
  }, [prompt, promptTitle]);

  const handleThumbsUp = () => {
    setDisableLikeButton(true);
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        reaction: "like",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
        currentPlayer: currentPlayer,
      })
    );
  };

  const handleThumbsDown = () => {
    setDisableButtons(true);
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        currentPlayer: currentPlayer,
        reaction: "reject",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
      })
    );
  };

  const handleMoveOn = () => {
    setDisableButtons(true);
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        currentPlayer: currentPlayer,
        reaction: "moveOn",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
      })
    );
  };

  useEffect(() => {
    console.log(promptTitle, ": ", prompt);
  }, [prompt, promptTitle]);

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
            <Card.Title className="p-2 fs-4">{title}</Card.Title>
            <Card.Body className="fs-4">{prompt}</Card.Body>
            <Card.Footer>
              {!hideButtons && (
                <Row>
                  <ReactionButtons
                    onThumbsUpClick={handleThumbsUp}
                    onThumbsDownClick={handleThumbsDown}
                    onMoveOnClick={handleMoveOn}
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

export default PromptCard;
