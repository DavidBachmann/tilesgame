import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import { SwrSupabaseContext } from "supabase-swr";
import { ConfigProvider } from "../src/context/ConfigContext";
import { StoreCreator } from "../src/StoreCreator";
import { PlayerProvider } from "../src/context/PlayerContext";
import supabase from "../src/supabase";
import "../styles/globals.css";

const UI = dynamic(() => import("../src/components/UI"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SwrSupabaseContext.Provider value={supabase}>
      <ConfigProvider>
        <StoreCreator>
          <PlayerProvider>
            <UI>
              <Component />
            </UI>
          </PlayerProvider>
        </StoreCreator>
      </ConfigProvider>
    </SwrSupabaseContext.Provider>
  );
}
