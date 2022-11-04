import { useCallback, useMemo } from "react";
import { PanInfo } from "framer-motion";
import { Relationships, TileType } from "./types";
import { useTileStore } from "./state";
import { delay } from "./utils";
import { Grid } from "./components/Grid";
import { Tile } from "./components/Tile";
import { UI } from "./components/UI";

export default function App() {
  const init = useTileStore((state) => state.actions.init);
  const tiles = useTileStore((state) => state.tiles);
  const selection = useTileStore((state) => state.selection);
  const addToSelection = useTileStore((state) => state.actions.addToSelection);
  const spawnTiles = useTileStore((state) => state.actions.spawnTiles);
  const score = useTileStore((state) => state.score);

  useMemo(() => {
    init();
  }, []);

  if (!tiles) {
    return <p>404 tiles not found</p>;
  }

  if (tiles.some((tile) => tile.type === -1)) {
    delay(500).then(spawnTiles);
  }

  const onDrag = useCallback(
    (info: PanInfo, idx: number, relationships: Relationships) => {
      const xOrY = info.offset.x === 0 && info.offset.y !== 0 ? "y" : "x";
      const direction = Math.sign(info.offset[xOrY]);

      addToSelection(idx);

      if (xOrY === "x") {
        if (direction === -1) {
          addToSelection(relationships.left);
        }
        if (direction === 1) {
          addToSelection(relationships.right);
        }
      }
      if (xOrY === "y") {
        if (direction === -1) {
          addToSelection(relationships.top);
        }
        if (direction === 1) {
          addToSelection(relationships.bottom);
        }
      }
    },
    [addToSelection]
  );

  return (
    <UI>
      <Grid>
        {tiles.map((tile) => (
          <div key={tile.id}>
            <Tile
              id={tile.id}
              idx={tile.idx}
              type={tile.type as TileType}
              selected={selection.includes(tile.idx)}
              relationships={tile.relationships}
              onDrag={(info) => onDrag(info, tile.idx, tile.relationships)}
            />
          </div>
        ))}
      </Grid>
      <p>{score}</p>
    </UI>
  );
}
