import { Variants } from "framer-motion";
import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { CONSTANTS } from "../../constants";
import { TileCell } from "../../types";
import { throttle } from "../../utils";
import * as css from "./Tile.css";

const explosion: Variants = {
  animate: {
    opacity: 0,
    transition: {
      duration: CONSTANTS.TILE_ANIMATION_MS / 1000,
    },
  },
  initial: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const Tile = ({
  id,
  type,
  selected,
  onDrag,
  visuallyDisabled,
}: TileCell) => {
  const y = type == -1 ? [1, 0] : [CONSTANTS.TILE_SIZE * -2, 0];
  const opacity = [0, 1];

  const cb = throttle((dir) => {
    onDrag(dir);
  }, 100);

  const [style, api] = useSpring(() => ({
    y: 0,
    x: 0,
    config: {
      duration: 150,
      bounce: 1,
    },
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
            if (_x !== 0) {
              cb(["x", Math.sign(_x)]);
            } else if (_y !== 0) {
              cb(["y", Math.sign(_y)]);
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
      <css.root
        layoutId={String(id)}
        layout="position"
        animate={{ y, opacity }}
        transition={{
          opacity: { duration: CONSTANTS.TILE_ANIMATION_MS / 1000 / 5 },
          default: { duration: CONSTANTS.TILE_ANIMATION_MS / 1000 },
        }}
      >
        {type === -1 && (
          <css.explosion
            variants={explosion}
            animate="animate"
            initial="initial"
            exit="exit"
          />
        )}
        <css.tile
          data-selected={selected}
          data-type={type}
          style={{ opacity: visuallyDisabled ? 0.8 : 1 }}
        />
      </css.root>
    </css.draggable>
  );
};
