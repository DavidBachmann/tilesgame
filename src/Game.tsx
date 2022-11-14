import { Fragment, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { GameState, Relationships, TileType } from "./types";
import { Grid } from "./components/Grid";
import { Tile } from "./components/Tile";
import { Area } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { PlayerMessage } from "./components/UI/PlayerMessage";
import { Timer } from "./components/Timer/Timer";
import { useStore } from "./StoreCreator";

type GameProps = {
  gameMode: "casual" | "time-attack";
  onGameOver?: (game: GameState, metadata: { publish?: boolean }) => void;
};

export function Game({ gameMode, onGameOver }: GameProps) {
  const init = useStore((state) => state.actions.init);
  const addToSelection = useStore((state) => state.actions.add_to_selection);

  const tiles = useStore((state) => state.tiles);
  const selection = useStore((state) => state.selection);
  const game = useStore((state) => state.game);
  const message = useStore((state) => state.message);
  const showPlayerMessage = !!message.current.heading;

  useEffect(() => {
    if (game.gameOver) {
      if (typeof onGameOver === "function") {
        onGameOver(game, {
          publish: true,
        });
      }
    }
  }, [game]);

  useMemo(() => {
    if (!import.meta.env.PROD) {
      window.DEBUG_MESSAGES = true;
    }
    init();
  }, []);

  if (!tiles) {
    return <p>404 tiles not found</p>;
  }

  const handleSwipeSwap = useCallback(
    (
      [axis, dir]: [axis: "x" | "y", dir: number],
      idx: number,
      relationships: Relationships
    ) => {
      if (game.gameOver) {
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

  return (
    <Fragment>
      <Score />
      {gameMode === "time-attack" && <Timer />}
      <Area>
        <Grid>
          {tiles.map((tile) => {
            return (
              <Tile
                key={tile.id}
                id={tile.id}
                relationships={tile.relationships}
                idx={tile.idx}
                type={tile.type as TileType}
                destroyed={tile.type === -1}
                selected={selection.includes(tile.idx)}
                onDrag={(direction) => {
                  handleSwipeSwap(direction, tile.idx, tile.relationships);
                }}
              />
            );
          })}
        </Grid>
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
      </Area>
    </Fragment>
  );
}
