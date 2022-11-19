import { useMemo } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { format_ordinals } from "../../utils";
import { usePlayer } from "../../context/PlayerContext";
import * as css from "./LeaderboardTable.css";
import { useLeaderboard } from "../../context/LeaderboardContext";
import Button from "../Button";

const renderPlaceholders = Array.from({ length: 10 }, (_, i) => (
  <css.row key={i}>
    <td>{format_ordinals(i + 1)}</td>
    <td>-</td>
    <td>-</td>
    <css.timeCell>-</css.timeCell>
  </css.row>
));

export function LeaderboardTable() {
  const player = usePlayer();
  const { highscores, toggleLeaderboard } = useLeaderboard();

  const renderHighscores = useMemo(() => {
    if (!Array.isArray(highscores)) {
      return null;
    }

    return highscores.map((score, index) => (
      <css.row
        key={score.id}
        style={{
          fontWeight: player.alias === score.player_alias ? 500 : 400,
        }}
      >
        <td>{format_ordinals(index + 1)}</td>
        <td>{score.score}</td>
        <td>{score.player_alias}</td>
        <css.timeCell>
          {formatDistanceToNowStrict(new Date(score.created_at), {
            addSuffix: false,
          })}
        </css.timeCell>
      </css.row>
    ));
  }, [highscores, player]);

  return (
    <css.root
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <css.wrap>
        <css.table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Score</th>
              <th>Player</th>
              <css.timeHeader>Time</css.timeHeader>
            </tr>
          </thead>
          <tbody>
            {highscores?.length ? renderHighscores : renderPlaceholders}
          </tbody>
        </css.table>
        <Button onClick={toggleLeaderboard} type={4}>
          Close
        </Button>
      </css.wrap>
    </css.root>
  );
}
