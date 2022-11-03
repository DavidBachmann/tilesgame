import { TileCell } from "../types";

export const Tile = ({ type, idx, relationships, onClick }: TileCell) => {
  const bg = {
    "-1": "black",
    "0": "purple",
    "1": "green",
    "2": "blue",
    "3": "red",
  };
  return (
    <div
      style={{
        fontSize: 18,
        padding: 10,
        background: bg[type],
      }}
      title={`idx ${idx}, type ${type}, (${Object.values(
        relationships
      ).toString()})`}
      onClick={onClick}
    >
      {String(idx).padStart(2, "0")}
    </div>
  );
};
