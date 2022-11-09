import * as css from "./PlayerMessage.css";

export function PlayerMessage({
  heading,
  subtitle,
}: {
  heading: string;
  subtitle?: string;
}) {
  return (
    <css.root
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 0,
      }}
      transition={{
        opacity: {
          type: "tween",
          duration: 0.3,
        },
        default: {
          type: "spring",
          // Mass of the moving object. Higher values will result in more lethargic movement. Set to 1 by default.
          mass: 1,
          // Stiffness of the spring. Higher values will create more sudden movement. Set to 100 by default.
          stiffness: 200,
          // Strength of opposing force. If set to 0, spring will oscillate indefinitely. Set to 10 by default.
          damping: 25,
        },
      }}
    >
      <css.box>
        <css.message>{heading}</css.message>
        {subtitle && <css.small>{subtitle}</css.small>}
      </css.box>
    </css.root>
  );
}
