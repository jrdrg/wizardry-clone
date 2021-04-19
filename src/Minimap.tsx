import React from 'react';
import styled from 'styled-components';

import { MapData } from './mapUtils';
import { Position } from './types';

const MapContainer = styled.div`
  z-index: var(--minimap-z-index);

  display: flex;
  flex-direction: column;

  position: absolute;
  top: 5%;
  left: 5%;

  height: var(--minimap-height);
  width: var(--minimap-height);

  background: brown;
`;

const MapCells = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  margin: 5px;
`;

const MapRow = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

const Tile = styled.div<{
  x: number;
  y: number;
  tile: number;
  isCurrentPosition: boolean;
}>`
  --tile-current: orange;
  --tile-0: white;
  --tile-1: black;

  height: 100%;
  width: 100%;
  background-color: ${({ tile, isCurrentPosition }) =>
    `var(--tile-${isCurrentPosition ? 'current' : tile})`};
  display: inline-block;
`;

type MinimapProps = {
  map: MapData;
  position: Position;
};

export function Minimap(props: MinimapProps) {
  const { map, position } = props;
  const { data } = map;

  return (
    <MapContainer>
      <MapCells>
        {data.map((row, y) => {
          return (
            <MapRow key={y}>
              {row.map((tile, x) => {
                const isCurrentPosition = position.x === x && position.y === y;
                return (
                  <Tile
                    key={`${y}:${x}`}
                    tile={tile}
                    x={x}
                    y={y}
                    isCurrentPosition={isCurrentPosition}
                  />
                );
              })}
            </MapRow>
          );
        })}
      </MapCells>
    </MapContainer>
  );
}
