import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import { ConfigProvider } from "../src/context/ConfigContext";
import { StoreCreator } from "../src/StoreCreator";
import { PlayerProvider } from "../src/context/PlayerContext";
import "../styles/globals.css";

const UI = dynamic(() => import("../src/components/UI"), { ssr: false });

export default function App({ Component }: AppProps) {
  return (
    <ConfigProvider>
      <StoreCreator>
        <PlayerProvider>
          <UI>
            <Component />
          </UI>
        </PlayerProvider>
      </StoreCreator>
    </ConfigProvider>
  );
}
