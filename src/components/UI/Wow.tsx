import * as css from "./Wow.css";

export function Wow({ message, score }: { message: string; score: number }) {
  return (
    <css.root
      animate={{
        opacity: 1,
        y: 0,
        scale: 1.05,
      }}
      initial={{ opacity: 0, y: 20, scale: 1 }}
      exit={{ opacity: 0, y: 0, scale: 0.95 }}
      transition={{
        opacity: {
          duration: 0.3,
        },
        default: {
          type: "spring",
          stiffness: 80,
        },
      }}
    >
      <css.box>
        <css.message>{message}</css.message>
        <css.small>{score} points</css.small>
      </css.box>
    </css.root>
  );
}
