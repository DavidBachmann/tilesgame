import { useMemo } from "react";
import { TileType } from "./types";
import { useTileStore } from "./state";
import { Grid } from "./components/Grid";
import { Tile as TileCell } from "./components/Tile";

export default function App() {
  const init = useTileStore((state) => state.actions.init);
  const tiles = useTileStore((state) => state.tiles);
  const selection = useTileStore((state) => state.selection);
  const addToSelection = useTileStore((state) => state.actions.addToSelection);

  useMemo(() => {
    init();
  }, []);

  return (
    <Grid>
      {tiles.map((tile) => (
        <div key={tile.id}>
          <TileCell
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
  );
}
