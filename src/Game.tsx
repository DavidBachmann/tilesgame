import { useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import isMobile from "is-mobile";
import { Relationships, TileType } from "./types";
import { Grid } from "./components/Grid";
import { Tile } from "./components/Tile";
import { UI, Area } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { Header } from "./components/UI/UI";
import { Wow } from "./components/UI/Wow";

import { useStore } from "./StoreCreator";

export function Game() {
  const init = useStore((state) => state.actions.init);
  const addToSelection = useStore((state) => state.actions.addToSelection);

  const tiles = useStore((state) => state.tiles);
  const selection = useStore((state) => state.selection);
  const comboMessage = useStore((state) => state.comboMessage);
  const comboScore = useStore((state) => state.comboScore);

  useMemo(() => {
    window.DEBUG_MESSAGES = true;
    init();
  }, []);

  if (!tiles) {
    return <p>404 tiles not found</p>;
  }

  const handleSwipeSwap = useCallback(
    (
      direction: [x: number, y: number],
      idx: number,
      relationships: Relationships
    ) => {
      const [x, y] = direction;

      if (x === 0 && y === 0) {
        return;
      }

      addToSelection(idx);

      if (x === -1) {
        return addToSelection(relationships.left);
      }
      if (x === 1) {
        return addToSelection(relationships.right);
      }
      if (y === -1) {
        return addToSelection(relationships.top);
      }
      if (y === 1) {
        return addToSelection(relationships.bottom);
      }
    },
    [addToSelection]
  );

  const handleClick = useCallback(
    (idx: number) => {
      addToSelection(idx);
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
                idx={tile.idx}
                type={tile.type as TileType}
                selected={selection.includes(tile.idx)}
                relationships={tile.relationships}
                onClick={() => handleClick(tile.idx)}
                onDrag={(direction) => {
                  handleSwipeSwap(direction, tile.idx, tile.relationships);
                }}
              />
            );
          })}
        </Grid>
        {!isMobile() && <Backlight tiles={tiles} />}

        <AnimatePresence mode="wait">
          {comboMessage && <Wow message={comboMessage} score={comboScore} />}
        </AnimatePresence>
      </Area>
      <Score />
    </UI>
  );
}
