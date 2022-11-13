import { createContext, ReactNode, useContext } from "react";

type Player = {
  alias: string;
};

const firstNames = [
  "Astute",
  "Azure",
  "Brilliant",
  "Canny",
  "Clever",
  "Keen",
  "Mighty",
  "Playful",
  "Quick",
  "Sharp",
  "Wise",
];

const lastNames = [
  "Artist",
  "Hawk",
  "Player",
  "Snow",
  "Traveler",
  "Whisperer",
  "Eagle",
  "Raven",
  "Lion",
  "Canine",
  "Wolf",
  "Driver",
  "Gamer",
  "Wizard",
];

function generate_alias() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${first} ${last}`;
}

const defaultValue = {
  alias: generate_alias(),
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
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
