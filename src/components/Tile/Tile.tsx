import { Variants } from "framer-motion";
import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import isMobile from "is-mobile";
import { CONSTANTS } from "../../constants";
import { TileCell } from "../../types";
import { throttle } from "../../utils";
import * as css from "./Tile.css";
import { ReactNode, useMemo } from "react";

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
  idx,
  relationships,
  selected,
  onClick,
  onDrag,
}: TileCell) => {
  const y = type == -1 ? [1, 0] : [CONSTANTS.TILE_SIZE * -1, 0];
  const opacity = [0, 1];

  const cb = throttle((dir) => {
    onDrag(dir);
  }, 100);

  const [style, api] = useSpring(() => ({
    y: 0,
    x: 0,
  }));

  const bind = useDrag(
    ({ offset: [x, y], axis }) => {
      api.start(() => {
        return {
          x: axis === "x" ? x : 0,
          y: axis === "y" ? y : 0,
          config: {
            mass: 0.3,
            friction: 20,
            tension: 100,
          },
          onChange: ({ value: { x = 0, y = 0 } }) => {
            const _x =
              axis === "x" && Math.abs(x) >= CONSTANTS.DRAG_THRESHOLD
                ? Math.sign(x) * 1
                : 0;
            const _y =
              axis === "y" && Math.abs(y) >= CONSTANTS.DRAG_THRESHOLD
                ? Math.sign(y) * 1
                : 0;

            const directions = [_x, _y];

            return cb(directions);
          },
        };
      });
    },
    {
      bounds: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      rubberband: true,
      filterTaps: true,
    }
  );

  return (
    <css.draggable {...bind()} style={style}>
      <css.root
        onClick={onClick}
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
          ></css.explosion>
        )}
        <css.tile
          data-selected={selected}
          data-type={type}
          title={`idx ${idx}, type ${type}, (${Object.values(
            relationships
          ).toString()})`}
        ></css.tile>
      </css.root>
    </css.draggable>
  );
};
