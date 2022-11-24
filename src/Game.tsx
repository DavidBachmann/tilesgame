import { Fragment, useCallback, useEffect, useMemo } from "react";
import { Config, GameState, Relationships } from "./types";
import { Grid } from "./components/Grid";
import { GameArea } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { Timer } from "./components/Timer/Timer";
import { useStore } from "./StoreCreator";
import { Board } from "./components/UI/Board";
import { MainMenu } from "./components/UI/MainMenu";
import { useConfig } from "./context/ConfigContext";

type GameProps = {
  gameMode: "casual" | "time-attack";
  onGameOver?: (game: GameState, config: Config) => void;
};

export default function Game({ gameMode, onGameOver }: GameProps) {
  const init = useStore((state) => state.actions.init);
  const addToSelection = useStore((state) => state.actions.add_to_selection);

  const gameTiles = useStore((state) => state.tiles);
  const emptyTiles = useStore((state) => state.empties);
  const game = useStore((state) => state.game);
  const config = useConfig();

  useEffect(() => {
    if (game.status === "game-over") {
      if (typeof onGameOver === "function") {
        onGameOver(game, config);
      }
    }
  }, [game, config, onGameOver]);

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
          {game.status === "pregame" && <MainMenu type="pregame" />}
          {game.status === "in-progress" && (
            <Grid tiles={tiles} onSwipe={handleSwipeSwap} />
          )}
          {game.status === "game-over" && <MainMenu type="postgame" />}
        </Board>
        <Backlight
          tiles={tiles}
          party={tiles.some((tile) => tile.type === -1)}
        />
      </GameArea>
    </Fragment>
  );
}
