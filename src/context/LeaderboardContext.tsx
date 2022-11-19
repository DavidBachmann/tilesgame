import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useStore } from "../StoreCreator";
import useSWR from "swr";

export type LeaderboardResponse = {
  id: number;
  score: number;
  player_alias: string;
  created_at: string;
};

type LeaderboardContextProps = {
  // Top 10 list
  highscores?: LeaderboardResponse[];
  // Lowest score on top 10 list
  lowestScore: number;
  isVisible: boolean;
  toggleLeaderboard: () => void;
};

const defaultValue = {
  highscores: [],
  lowestScore: Infinity,
  isVisible: false,
  toggleLeaderboard: () => {},
};

const LeaderboardContext = createContext<LeaderboardContextProps>({
  ...defaultValue,
});

export const useLeaderboard = () => useContext(LeaderboardContext);

function fetcher(url: string) {
  const foo = fetch(url).then((res) => res.json());
  return foo;
}

export function LeaderboardProvider({
  children,
}: {
  children: ReactNode;
  value?: LeaderboardContextProps;
}) {
  const [isVisible, setVisible] = useState(false);

  const toggleLeaderboard = () => setVisible((prev) => !prev);

  const { data } = useSWR("/api/leaderboard", fetcher);

  const lowestScore = useMemo(() => {
    return (
      data?.highscore[data?.highscore.length - 1].score ||
      defaultValue.lowestScore
    );
  }, [data]);

  return (
    <LeaderboardContext.Provider
      value={{
        highscores: data,
        lowestScore,
        isVisible,
        toggleLeaderboard,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}
