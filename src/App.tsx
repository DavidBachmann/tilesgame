import { ConfigProvider } from "./context/ConfigContext";
import { PlayerProvider } from "./context/PlayerContext";
import { StoreCreator } from "./StoreCreator";

export default function App() {
  return (
    <PlayerProvider>
      <ConfigProvider>
        <StoreCreator />
      </ConfigProvider>
    </PlayerProvider>
  );
}
