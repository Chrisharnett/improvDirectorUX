import { Card, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactionButtons from "./ReactionButtons";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext";
import { useGameState } from "../hooks/useGameState.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  enterExitLeftVariants,
  enterExitRightVariants,
} from "../config/animationConfig.js";

const PromptCard = ({
  currentPrompt,
  hideButtons,
  setHideButtons,
  cardKey,
  animationDirection,
}) => {
  const [title, setTitle] = useState("");
  const [disableButtons, setDisableButtons] = useState(false);
  const [disableLikeButton, setDisableLikeButton] = useState(false);
  const [animationVariant, setAnimationVariant] = useState(
    enterExitLeftVariants
  );
  const [loaded, setLoaded] = useState(false);
  const { currentPlayer } = useUserContext();
  const { sendMessage } = useWebSocket();
  const { gameState } = useGameState();
  const { roomName } = gameState;
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  const getRandomAnimationDirection = () => {
    const options = ["left", "right"];
    return options[Math.floor(Math.random() * options.length)];
  };

  const { promptTitle, prompt } = currentPrompt || {};

  useEffect(() => {
    switch (animationDirection) {
      case "left":
        setAnimationVariant(enterExitLeftVariants);
        break;
      case "right":
        setAnimationVariant(enterExitRightVariants);
        break;
      case "random":
        setAnimationVariant(
          getRandomAnimationDirection() === "left"
            ? enterExitLeftVariants
            : enterExitRightVariants
        );
        break;
      default:
        break;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (promptTitle === "groupPrompt") {
      setTitle("Group");
    } else {
      setTitle(currentPlayer.screenName || promptTitle);
    }

    if (gameState?.finalPrompt) {
      setHideButtons(true);
      setTitle("Final Prompt");
    }

    setDisableButtons(false);
    setDisableLikeButton(false);
  }, [promptTitle, gameState, currentPlayer]);

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

  if (loaded) {
    return (
      <>
        <AnimatePresence mode="wait">
          <motion.span
            key={cardKey}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariant}
            transition={{ duration: 0.7 }}
            style={{ display: "inline-block" }}
          >
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
          </motion.span>
        </AnimatePresence>
      </>
    );
  }
};

PromptCard.propTypes = {
  currentPrompt: PropTypes.object,
  hideButtons: PropTypes.bool,
  setHideButtons: PropTypes.func,
  cardKey: PropTypes.string,
  animationDirection: PropTypes.string,
};

export default PromptCard;
