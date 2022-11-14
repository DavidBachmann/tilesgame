import { useMemo } from "react";
import { useStore } from "../../StoreCreator";
import { useConfig } from "../../context/ConfigContext";
import { Tile } from "../../types";
import { typeToColor } from "../../utils";
import * as css from "./Backlight.css";

type BacklightProps = {
  tiles: Tile[];
  party?: boolean;
};

function mode(arr: Array<any>) {
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
}

export function Backlight({ tiles, party }: BacklightProps) {
  if (!tiles) {
    return null;
  }

  const config = useConfig();

  const dominant = useMemo(() => {
    const quadrants = [
      [tiles[0], tiles[1], tiles[config.gridSize], tiles[config.gridSize + 1]],
      [
        tiles[config.gridSize * 4],
        tiles[config.gridSize * 4 + 1],

        tiles[config.gridSize * 5],
        tiles[config.gridSize * 5 + 1],
      ],
      [
        tiles[config.gridSize - 2],
        tiles[config.gridSize - 1],
        tiles[config.gridSize * 2 - 2],
        tiles[config.gridSize * 2 - 1],
      ],
      [
        tiles[config.gridSize * config.gridSize - 2 - config.gridSize],
        tiles[config.gridSize * config.gridSize - 1 - config.gridSize],
        tiles[config.gridSize * config.gridSize - 2],
        tiles[config.gridSize * config.gridSize - 1],
      ],
    ];
    const quads = quadrants.map((q) => {
      return q.map((tile) => tile?.type ?? -1);
    });

    return quads.map((q) => mode(q));
  }, [tiles]);

  const gameOver = useStore((state) => state.game.gameOver);

  return (
    <css.root style={{ opacity: gameOver || party ? 0.8 : 0.65 }}>
      <css.backlight
        style={
          {
            "--quadrant-1": typeToColor(gameOver ? 0 : dominant[0]),
            "--quadrant-2": typeToColor(gameOver ? 0 : dominant[1]),
            "--quadrant-3": typeToColor(gameOver ? 0 : dominant[2]),
            "--quadrant-4": typeToColor(gameOver ? 0 : dominant[3]),
          } as React.CSSProperties
        }
      />
    </css.root>
  );
}
