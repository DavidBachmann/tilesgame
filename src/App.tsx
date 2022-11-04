import { useMemo } from "react";
import { TileType } from "./types";
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
              onClick={() => {
                addToSelection(tile.idx);
              }}
            />
          </div>
        ))}
      </Grid>
      <p>{score}</p>
    </UI>
  );
}
