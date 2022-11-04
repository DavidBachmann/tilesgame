import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { Tile } from "./types";
import { useTileStore } from "./state";
import { CONSTANTS } from "./constants";

const expand = (xs: any[], n: number): any[] =>
  xs.length <= n ? [xs] : [xs.slice(0, n), ...expand(xs.slice(n), n)];

export default function App() {
  const init = useTileStore((state) => state.actions.init);
  const tiles = useTileStore((state) => state.tiles);
  const selection = useTileStore((state) => state.selection);
  const addToSelection = useTileStore((state) => state.actions.addToSelection);

  useMemo(() => {
    init();
  }, []);

  if (!tiles) {
    return <p>404 tiles not found</p>;
  }

  type BoxProps = JSX.IntrinsicElements["mesh"] & {
    idx: number;
    tileType: number;
    selected: boolean;
  };

  function Box({ idx, tileType, selected, ...rest }: BoxProps) {
    const ref = useRef<THREE.Mesh>(null!);

    const getColorByType = (tileType: BoxProps["tileType"]) => {
      switch (tileType) {
        case 0:
          return "red";
        case 1:
          return "green";
        case 2:
          return "blue";
        case 3:
          return "orange";
        default:
          return "black";
      }
    };

    return (
      <mesh {...rest} ref={ref}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={getColorByType(tileType)}
          transparent
          opacity={selected ? 0.5 : 1}
        />
      </mesh>
    );
  }

  const two_d = expand(tiles, CONSTANTS.DIMENSIONS).reverse();

  return (
    <div style={{ width: 800, height: 600 }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Center>
          {two_d.map((grid, col: number) => {
            return grid.map((tile: Tile, row: number) => {
              return (
                <Box
                  idx={tile.idx}
                  tileType={tile.type}
                  position={[row * 0.5, col * 0.5, 0]}
                  selected={selection.includes(tile.idx)}
                  visible={tile.type > -1}
                  onClick={() => {
                    addToSelection(tile.idx);
                  }}
                />
              );
            });
          })}
        </Center>
      </Canvas>
    </div>
  );
}
