import { createContext, ReactNode, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Player } from "../types";

const firstNames = [
  "Active",
  "Adept",
  "Agile",
  "Articulate",
  "Astute",
  "Blue",
  "Bold",
  "Brainy",
  "Brave",
  "Bright",
  "Brilliant",
  "Canny",
  "Capable",
  "Clever",
  "Confident",
  "Crafty",
  "Creative",
  "Cyan",
  "Deft",
  "Determined",
  "Eloquent",
  "Energetic",
  "Fluent",
  "Flying",
  "Gentle",
  "Green",
  "Happy",
  "Hasty",
  "Helpful",
  "Hopeful",
  "Intelligent",
  "Intuitive",
  "Invincible",
  "Invisible",
  "Joyful",
  "Keen",
  "Lively",
  "Logical",
  "Loyal",
  "Maroon",
  "Modest",
  "Moving",
  "Nimble",
  "Pink",
  "Purple",
  "Quick",
  "Red",
  "Relaxed",
  "Sassy",
  "Savvy",
  "Sharp",
  "Shrewd",
  "Sincere",
  "Slick",
  "Smart",
  "Snappy",
  "Spirited",
  "Transparent",
  "Violet",
  "Wise",
  "Witty",
  "Yellow",
];

const lastNames = [
  "Bear",
  "Bison",
  "Canine",
  "Crow",
  "Deer",
  "Dolphin",
  "Duck",
  "Eagle",
  "Fox",
  "Hare",
  "Hawk",
  "Koala",
  "Lion",
  "Lobster",
  "Octopus",
  "Panda",
  "Parrot",
  "Penguin",
  "Rabbit",
  "Raven",
  "Seal",
  "Shark",
  "Snow",
  "Spider",
  "Tiger",
  "Turkey",
  "Walrus",
  "Wolf",
];

function generate_alias() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const numbers = Math.floor(Math.random() * (9999 - 1) + 1);

  return `${first.toLowerCase()}_${last.toLowerCase()}_${String(
    numbers
  ).padStart(3, "0")}`;
}

const defaultValue = {
  alias: null,
};

const PlayerContext = createContext<Player>({
  ...defaultValue,
});

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({
  children,
  value = defaultValue,
}: {
  children: ReactNode;
  value?: Player;
}) {
  const [alias, setAlias] = useLocalStorage("TG_ALIAS", value.alias);

  if (!alias) {
    setAlias(generate_alias());
  }

  return (
    <PlayerContext.Provider
      value={{
        alias,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
