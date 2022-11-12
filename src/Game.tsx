import { useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Relationships, TileType } from "./types";
import { Grid } from "./components/Grid";
import { Tile } from "./components/Tile";
import { UI, Area } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { Header } from "./components/UI/UI";
import { PlayerMessage } from "./components/UI/PlayerMessage";
import { useStore } from "./StoreCreator";
import { Footer } from "./components/UI/Footer";

export function Game() {
  const init = useStore((state) => state.actions.init);
  const addToSelection = useStore((state) => state.actions.add_to_selection);

  const tiles = useStore((state) => state.tiles);
  const selection = useStore((state) => state.selection);
  const message = useStore((state) => state.message);
  const showPlayerMessage = !!message.current.heading;

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
    [addToSelection]
  );

  return (
    <UI>
      <Header />
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
      <Score />
      <Footer />
    </UI>
  );
}
