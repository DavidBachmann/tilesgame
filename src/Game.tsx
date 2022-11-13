import { useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Relationships, TileType } from "./types";
import { Grid } from "./components/Grid";
import { Tile } from "./components/Tile";
import { UI, Area } from "./components/UI";
import { Backlight } from "./components/Backlight";
import { Score } from "./components/UI/Score";
import { Header } from "./components/UI/UI";
import { PlayerMessage } from "./components/UI/PlayerMessage";
import { useStore } from "./StoreCreator";
import { Footer } from "./components/UI";
import { Timer } from "./components/Timer/Timer";
import { useConfig } from "./context/ConfigContext";
import supabase from "./supabase";
import { usePlayer } from "./context/PlayerContext";

export function Game() {
  const init = useStore((state) => state.actions.init);
  const addToSelection = useStore((state) => state.actions.add_to_selection);

  const tiles = useStore((state) => state.tiles);
  const selection = useStore((state) => state.selection);
  const gameOver = useStore((state) => state.gameOver);
  const message = useStore((state) => state.message);
  const score = useStore((state) => state.score);
  const showPlayerMessage = !!message.current.heading;
  const player = usePlayer();

  useEffect(() => {
    async function submitScore() {
      const { data, error } = await supabase
        .from("highscore")
        .insert([{ player_alias: player.alias, score }]);

      console.log(data);
      console.log(error);
    }
    if (gameOver) {
      submitScore();
    }
  }, [gameOver, score, player]);

  useEffect(() => {
    async function foo() {
      const { data, error } = await supabase
        .from("highscore")
        .select("id, player_alias, score")
        .order("score", { ascending: false })
        .limit(10);
      console.log(data);
    }
    foo();
  }, []);

  const config = useConfig();

  useMemo(() => {
    if (!import.meta.env.PROD) {
      window.DEBUG_MESSAGES = true;
    }
    init();
  }, []);

  if (!tiles) {
    return <p>404 tiles not found</p>;
  }

  const handleSwipeSwap = useCallback(
    (
      [axis, dir]: [axis: "x" | "y", dir: number],
      idx: number,
      relationships: Relationships
    ) => {
      if (gameOver) {
        return;
      }
      addToSelection(idx);

      if (axis === "x") {
        if (dir === -1) {
          return addToSelection(relationships.left);
        }
        if (dir === 1) {
          return addToSelection(relationships.right);
        }
      }
      if (axis === "y") {
        if (dir === -1) {
          return addToSelection(relationships.top);
        }
        if (dir === 1) {
          return addToSelection(relationships.bottom);
        }
      }
    },
    [addToSelection, gameOver]
  );

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
                relationships={tile.relationships}
                idx={tile.idx}
                type={tile.type as TileType}
                destroyed={tile.type === -1}
                selected={selection.includes(tile.idx)}
                onDrag={(direction) => {
                  handleSwipeSwap(direction, tile.idx, tile.relationships);
                }}
              />
            );
          })}
        </Grid>
        <Backlight
          tiles={tiles}
          party={tiles.some((tile) => tile.type === -1)}
        />
        <AnimatePresence mode="wait">
          {showPlayerMessage && (
            <PlayerMessage
              key={message.uuid}
              heading={message.current.heading}
              subtitle={message.current.subtitle}
            />
          )}
        </AnimatePresence>
      </Area>
      {config.gameMode === "time-attack" && <Timer />}
      <Score />
      <Footer />
    </UI>
  );
}
