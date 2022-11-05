import { useMemo } from "react";
import { CONSTANTS } from "../../constants";
import { Tile } from "../../types";
import { typeToColor } from "../../utils";
import * as css from "./Backlight.css";

type BacklightProps = {
  tiles: Tile[];
};

function mode(arr: Array<any>) {
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
}

export function Backlight({ tiles }: BacklightProps) {
  if (!tiles) {
    return null;
  }

  const dominant = useMemo(() => {
    const quadrants = [
      [
        tiles[0],
        tiles[1],
        tiles[CONSTANTS.DIMENSIONS],
        tiles[CONSTANTS.DIMENSIONS + 1],
      ],
      [
        tiles[CONSTANTS.DIMENSIONS * 4],
        tiles[CONSTANTS.DIMENSIONS * 4 + 1],

        tiles[CONSTANTS.DIMENSIONS * 5],
        tiles[CONSTANTS.DIMENSIONS * 5 + 1],
      ],
      [
        tiles[CONSTANTS.DIMENSIONS - 2],
        tiles[CONSTANTS.DIMENSIONS - 1],
        tiles[CONSTANTS.DIMENSIONS * 2 - 2],
        tiles[CONSTANTS.DIMENSIONS * 2 - 1],
      ],
      [
        tiles[
          CONSTANTS.DIMENSIONS * CONSTANTS.DIMENSIONS - 2 - CONSTANTS.DIMENSIONS
        ],
        tiles[
          CONSTANTS.DIMENSIONS * CONSTANTS.DIMENSIONS - 1 - CONSTANTS.DIMENSIONS
        ],
        tiles[CONSTANTS.DIMENSIONS * CONSTANTS.DIMENSIONS - 2],
        tiles[CONSTANTS.DIMENSIONS * CONSTANTS.DIMENSIONS - 1],
      ],
    ];
    const quads = quadrants.map((q) => {
      return q.map((tile) => tile.type);
    });

    return quads.map((q) => mode(q));
  }, [tiles]);

  return (
    <css.root>
      <css.backlight
        style={
          {
            "--quadrant-1": typeToColor(dominant[0]),
            "--quadrant-2": typeToColor(dominant[1]),
            "--quadrant-3": typeToColor(dominant[2]),
            "--quadrant-4": typeToColor(dominant[3]),
          } as React.CSSProperties
        }
      />
    </css.root>
  );
}
