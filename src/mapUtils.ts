import type { Direction, Position } from './types';

export type MapData = {
  data: number[][];
  start: Position;
};

export function convertToMap(data: number[][], start: Position): MapData {
  return { data, start };
}

export function isWithinBounds(map: MapData, x: number, y: number) {
  return y >= 0 && y < map.data.length && x >= 0 && x < map.data[0]?.length;
}

export function isWalkable(map: MapData, x: number, y: number) {
  return isWithinBounds(map, x, y) && map.data[y]?.[x] === 0;
}

export function directionToDegrees(direction: Direction) {
  const degrees = {
    N: 0,
    W: 90,
    S: 180,
    E: -90, //270,
  };
  return degrees[direction];
}
