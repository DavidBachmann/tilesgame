import * as css from "./Score.css";

type ScoreProps = {
  score: number;
};

export function Score({ score }: ScoreProps) {
  return <css.text>{score}</css.text>;
}
