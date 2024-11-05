import { Container, Row, Col } from "react-bootstrap";
import { useGameState } from "../hooks/useGameState.jsx";
import { useEffect, useState } from "react";
import PromptCard from "../components/PromptCard";

const AudienceView = () => {
  const { gameState } = useGameState();
  const { roomName, performers } = gameState;
  const [sharedPrompt, setSharedPrompt] = useState("");
  const [playerPrompts, setPlayerPrompts] = useState([]);

  useEffect(() => {
    if (performers.length > 0) {
      let groupPrompt = "";
      if (!gameState.finalPrompt) {
        groupPrompt = {
          groupPrompt: performers[0]?.currentPrompts?.groupPrompt,
        };
      } else {
        groupPrompt = {
          finalPrompt: performers[0]?.currentPrompts.finalPrompt,
        };
      }

      setSharedPrompt(groupPrompt);

      const updatedPlayerPrompts = performers.map((player) => {
        return {
          screenName: player.screenName || `Player ${player.userId}`, // Assuming each player has a screenName
          prompt:
            player.currentPrompts?.performerPrompt ||
            "No individual prompt available",
        };
      });

      setPlayerPrompts(updatedPlayerPrompts);
    }
  }, [gameState, performers]);
  return (
    <Container className="midLayer glass">
      <h1>{roomName}</h1>
      {Object.entries(sharedPrompt).map(([key, value]) => (
        <PromptCard
          key={key}
          promptTitle={key}
          prompt={value.prompt}
          hideButtons={true}
        />
      ))}
      <Row>
        {playerPrompts.map((player, index) => (
          <Col key={index} sm={12} md={6}>
            <PromptCard
              key={player.screenName}
              promptTitle={player.screenName}
              prompt={player.prompt.prompt}
              hideButtons={true}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AudienceView;
