type Position = { x: number; y: number };

export type MapData = {
  data: number[][];
  start: Position;
};

export function isWithinBounds(map: MapData, x: number, y: number) {
  return y >= 0 && y < map.data.length && x >= 0 && x < map.data[0]?.length;
}

export function convertToMap(data: number[][], start: Position): MapData {
  return { data, start };
}
