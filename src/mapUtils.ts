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

export function isWall(map: MapData, x: number, y: number) {
  return isWithinBounds(map, x, y) && map.data[y]?.[x] === 1;
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

export function getNeighboringDirections(
  map: MapData,
  x: number,
  y: number
): Set<Direction> {
  const neighbors = new Set<Direction>();
  const neighborCoords = {
    N: [0, -1],
    S: [0, 1],
    E: [1, 0],
    W: [-1, 0],
  };
  Object.entries(neighborCoords).forEach(([dir, [dx, dy]]) => {
    if (isWall(map, x + dx, y + dy)) {
      neighbors.add(dir as Direction);
    }
  });

  return neighbors;
}
