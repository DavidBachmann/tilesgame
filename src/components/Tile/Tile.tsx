import { useState } from "react";
import { AnimatePresence, Variants } from "framer-motion";
import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { CONSTANTS } from "../../constants";
import { TileElement } from "../../types";
import { throttle } from "../../utils";
import * as css from "./Tile.css";
import { useConfig } from "../../context/ConfigContext";

const explosion: Variants = {
  animate: {
    opacity: [0, 1, 0],
    transition: {
      duration: CONSTANTS.TILE_ANIMATION.s,
    },
  },
  initial: {
    opacity: 1,
  },
};

export const Tile = ({
  id,
  type,
  selected,
  onDrag,
  idx,
  destroyed,
}: TileElement) => {
  const { gridSize } = useConfig();
  const [down, set] = useState(false);

  const row = Math.floor(idx / gridSize) + 1;
  const yOffset = (gridSize - (row - gridSize)) * CONSTANTS.TILE_SIZE * -1;

  const cb = throttle((dir) => {
    onDrag(dir);
  }, 100);

  const [style, api] = useSpring(() => ({
    y: 0,
    x: 0,
  }));

  const bind = useDrag(
    ({ offset, down }) => {
      const [x, y] = offset;
      const absolute = offset.map((m) => Math.abs(m));
      const larger = absolute.indexOf(Math.max(...absolute));

      const _x = down && larger === 0 ? x : 0;
      const _y = down && larger === 1 ? y : 0;

      api.start(() => {
        return {
          x: _x,
          y: _y,
          onChange: () => {
            if (_x !== 0 && Math.abs(_x) >= 2) {
              cb(["x", Math.sign(_x)]);
            } else if (_y !== 0 && Math.abs(_y) >= 2) {
              cb(["y", Math.sign(_y)]);
            }

            if (down) {
              set(true);
            } else {
              set(false);
            }
          },
        };
      });
    },
    {
      bounds: {
        top: -1,
        left: -1,
        bottom: 1,
        right: 1,
      },
      rubberband: true,
      filterTaps: true,
    }
  );

  return (
    <css.draggable {...bind()} style={style}>
      <css.root layoutId={String(id)} layout="position">
        {destroyed && (
          <css.explosion
            variants={explosion}
            animate="animate"
            initial="initial"
          />
        )}
        <AnimatePresence>
          {!destroyed && (
            <css.tile
              initial={{ y: yOffset }}
              exit={{ y: 0 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                // Mass of the moving object.
                // Higher values will result in more lethargic movement.
                // Set to 1 by default.
                mass: 1,
                // Stiffness of the spring.
                // Higher values will create more sudden movement.
                // Set to 100 by default.
                stiffness: 220,
                // Strength of opposing force.
                // If set to 0, spring will oscillate indefinitely.
                // Set to 10 by default.
                damping: 25,
              }}
              key={id}
              data-selected={selected}
              data-type={type}
              data-focus={down}
            />
          )}
        </AnimatePresence>
      </css.root>
    </css.draggable>
  );
};
