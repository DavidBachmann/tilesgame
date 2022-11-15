import { createContext, ReactNode, useContext, useMemo } from "react";
import { useQuery, useSelect } from "supabase-swr";
import { debug_message } from "../utils";
import { useStore } from "../StoreCreator";

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
};

const defaultValue = {
  highscores: [],
  lowestScore: Infinity,
};

const LeaderboardContext = createContext<LeaderboardContextProps>({
  ...defaultValue,
});

export const useLeaderboard = () => useContext(LeaderboardContext);

export function LeaderboardProvider({
  children,
}: {
  children: ReactNode;
  value?: LeaderboardContextProps;
}) {
  const gameId = useStore((store) => store.game.id);
  const gameStatus = useStore((store) => store.game.status);
  const leaderboardQuery = useQuery<LeaderboardResponse>(
    "highscore",
    {
      columns: "id, player_alias, score, created_at",
      filter: (query) => query.order("score", { ascending: false }).limit(10),
    },
    [gameId, gameStatus]
  );

  const { data: highscores } = useSelect(leaderboardQuery, {
    onSuccess: () => {
      debug_message("Fetched highscores", "green");
    },
  });

  const lowestScore = useMemo(() => {
    return (
      highscores?.data[highscores.data.length - 1].score ||
      defaultValue.lowestScore
    );
  }, [highscores]);

  return (
    <LeaderboardContext.Provider
      value={{
        highscores: highscores?.data,
        lowestScore,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}
