import { createContext, ReactNode, useContext, useMemo, useState } from "react";
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
  fetchLeaderboard: () => void;
};

const defaultValue = {
  highscores: [],
  lowestScore: Infinity,
  isVisible: false,
  fetchLeaderboard: () => {},
  toggleLeaderboard: () => {},
};

const LeaderboardContext = createContext<LeaderboardContextProps>({
  ...defaultValue,
});

export const useLeaderboard = () => useContext(LeaderboardContext);

async function fetcher(url: string) {
  return await fetch(url).then((res) => res.json());
}

export function LeaderboardProvider({
  children,
}: {
  children: ReactNode;
  value?: LeaderboardContextProps;
}) {
  const [isVisible, setVisible] = useState(false);

  const toggleLeaderboard = () => setVisible((prev) => !prev);

  const { data, mutate } = useSWR("/api/leaderboard", fetcher);

  const lowestScore = useMemo(() => {
    if (!data?.highscore || !data?.highscore?.length) {
      return defaultValue.lowestScore;
    }

    return data.highscore[data.highscore.length - 1].score;
  }, [data]);

  return (
    <LeaderboardContext.Provider
      value={{
        highscores: data?.highscore,
        fetchLeaderboard: async () => await mutate(),
        lowestScore,
        isVisible,
        toggleLeaderboard,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}
