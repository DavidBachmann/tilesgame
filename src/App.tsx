import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import { v4 } from "uuid";
import { AnimatePresence } from "framer-motion";
import { SwrSupabaseContext } from "supabase-swr";
import supabase from "./supabase";
import { UI } from "./components/UI";
import { ConfigProvider } from "./context/ConfigContext";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import { Game } from "./Game";
import { StoreCreator } from "./StoreCreator";
import { GameState } from "./types";
import { debug_message } from "./utils";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { LeaderboardProvider } from "./context/LeaderboardContext";

function TimeAttack() {
  const player = usePlayer();

  async function submitScore({
    playerAlias,
    game,
  }: {
    playerAlias: string;
    game: GameState;
  }) {
    const { data: record } = await supabase
      .from("highscore")
      .select("*")
      .eq("game_id", game.id);

    if (record?.length) {
      debug_message("GAME_ID ALREADY EXISTS", "red");
      return;
    }

    const { error: submissionError } = await supabase
      .from("highscore")
      .insert([
        { player_alias: playerAlias, score: game.score, game_id: game.id },
      ]);

    if (submissionError) {
      console.error(submissionError);
      return;
    }
  }

  return (
    <LeaderboardProvider>
      <AnimatePresence>
        <Outlet key="highscore-outlet" />
        <Game
          key={v4()}
          gameMode="time-attack"
          onGameOver={(game: GameState, metadata) => {
            if (metadata.publish && player.alias && game.score) {
              submitScore({ playerAlias: player.alias, game });
            }
          }}
        />
      </AnimatePresence>
    </LeaderboardProvider>
  );
}

export default function App() {
  return (
    <SwrSupabaseContext.Provider value={supabase}>
      <ConfigProvider>
        <StoreCreator>
          <PlayerProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<UI />}>
                  <Route
                    index
                    element={<Game gameMode="casual" key={v4()} />}
                  />
                  <Route path="/time" element={<TimeAttack />}>
                    <Route
                      path="/time/leaderboard"
                      element={<LeaderboardTable />}
                    />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </PlayerProvider>
        </StoreCreator>
      </ConfigProvider>
    </SwrSupabaseContext.Provider>
  );
}
