import { Routes, Route, BrowserRouter } from "react-router-dom";
import { UI } from "./components/UI";
import supabase from "./supabase";
import { ConfigProvider } from "./context/ConfigContext";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import { Game } from "./Game";
import { StoreCreator } from "./StoreCreator";
import { v4 } from "uuid";

function TimeAttack() {
  const player = usePlayer();

  async function submitScore({
    playerAlias,
    score,
  }: {
    playerAlias: string;
    score: number;
  }) {
    if (!playerAlias || !score) {
      return;
    }

    const { data, error } = await supabase
      .from("highscore")
      .insert([{ player_alias: playerAlias, score }]);

    if (error) {
      console.error(error);
    }

    console.log(data);
  }

  return (
    <Game
      key={v4()}
      gameMode="time-attack"
      onGameOver={(score, metadata) => {
        if (metadata.publish) {
          submitScore({ playerAlias: player.alias, score });
        }
      }}
    />
  );
}

export default function App() {
  return (
    <StoreCreator>
      <PlayerProvider>
        <ConfigProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UI />}>
                <Route index element={<Game gameMode="casual" key={v4()} />} />
                <Route path="/time" element={<TimeAttack />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </PlayerProvider>
    </StoreCreator>
  );
}
