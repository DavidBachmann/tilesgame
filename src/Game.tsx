import { Fragment, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { GameState, Relationships } from "./types";
import { Grid } from "./components/Grid";
import { GameArea } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { PlayerMessage } from "./components/UI/PlayerMessage";
import { Timer } from "./components/Timer/Timer";
import { useStore } from "./StoreCreator";
import { Board } from "./components/UI/Board";
import { MainMenu } from "./components/UI/MainMenu";

type GameProps = {
  gameMode: "casual" | "time-attack";
  onGameOver?: (game: GameState, metadata: { publish?: boolean }) => void;
};

export default function Game({ gameMode, onGameOver }: GameProps) {
  const init = useStore((state) => state.actions.init);
  const addToSelection = useStore((state) => state.actions.add_to_selection);
  const setGameStatus = useStore((state) => state.actions.set_game_status);

  const gameTiles = useStore((state) => state.tiles);
  const emptyTiles = useStore((state) => state.empties);
  const game = useStore((state) => state.game);
  const message = useStore((state) => state.message);
  const showPlayerMessage = !!message.current.heading;

  useEffect(() => {
    if (game.status === "game-over") {
      if (typeof onGameOver === "function") {
        onGameOver(game, {
          publish: true,
        });
      }
    }
  }, [game, onGameOver]);

  useMemo(() => {
    init(gameMode);
  }, [gameMode, init]);

  const handleSwipeSwap = useCallback(
    (
      [axis, dir]: [axis: "x" | "y", dir: number],
      idx: number,
      relationships: Relationships
    ) => {
      if (game.status === "game-over") {
        return;
      }
      addToSelection(idx);

      if (axis === "x") {
        if (dir === -1) {
          return addToSelection(relationships.left);
        }
        if (dir === 1) {
          return addToSelection(relationships.right);
        }
      }
      if (axis === "y") {
        if (dir === -1) {
          return addToSelection(relationships.top);
        }
        if (dir === 1) {
          return addToSelection(relationships.bottom);
        }
      }
    },
    [addToSelection, game]
  );

  useEffect(() => {
    // Auto start the game in casual mode
    if (gameMode === "casual" && game.status === "pregame") {
      setGameStatus("in-progress");
    }
  }, [gameMode, game.status, setGameStatus]);

  if (!gameTiles) {
    return <p>404 tiles not found</p>;
  }

  const tiles = game.status === "game-over" ? emptyTiles : gameTiles;

  return (
    <Fragment>
      <Score />
      {gameMode === "time-attack" && game.status === "in-progress" && <Timer />}
      <GameArea>
        <Board scroll={game.status !== "in-progress"}>
          {gameMode === "time-attack" && game.status === "pregame" && (
            <MainMenu type="pregame" />
          )}
          {game.status === "in-progress" && (
            <Grid tiles={tiles} onSwipe={handleSwipeSwap} />
          )}
          {game.status === "game-over" && <MainMenu type="postgame" />}
        </Board>
        <Backlight
          tiles={tiles}
          party={tiles.some((tile) => tile.type === -1)}
        />
        <AnimatePresence mode="wait">
          {showPlayerMessage && (
            <PlayerMessage
              key={message.uuid}
              heading={message.current.heading}
              subtitle={message.current.subtitle}
            />
          )}
        </AnimatePresence>
      </GameArea>
    </Fragment>
  );
}
