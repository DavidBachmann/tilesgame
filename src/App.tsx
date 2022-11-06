import { useCallback, useMemo } from "react";
import { Relationships, TileType } from "./types";
import { useTileStore } from "./state";
import isMobile from "is-mobile";
import { Grid } from "./components/Grid";
import { Tile } from "./components/Tile";
import { UI, Area } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { Header } from "./components/UI/UI";

export default function App() {
  const init = useTileStore((state) => state.actions.init);
  const addToSelection = useTileStore((state) => state.actions.addToSelection);

  const tiles = useTileStore((state) => state.tiles);
  const selection = useTileStore((state) => state.selection);
  const score = useTileStore((state) => state.score);

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

  console.log(selection);

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
      </Area>
      <Score score={score} />
    </UI>
  );
}
