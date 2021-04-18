import React, { useCallback } from 'react';
import styled from 'styled-components';
import mapData from './map.json';

import { convertToMap, directionToDegrees } from './mapUtils';
import type { Position } from './types';
import { useMapPosition } from './useMapPosition';

import { Cube } from './Cube';

const map = convertToMap(mapData.map, mapData.start);

const Container = styled.div`
  &:focus {
    outline: none;
  }

  border: 1px solid var(--border-color);
  flex: 1;
  overflow: hidden;
  perspective: 300px;
  transform-style: preserve-3d;
  height: 100%;

  background: lightblue;
`;

const MapGeometry = styled.div<{ position: Position; degrees: number }>`
  height: 100%;
  //   transition: 1s all;
  transform-origin: center;
  transform-style: preserve-3d;

  --x-pos: ${({ position }) => -1 * position.x};
  --y-pos: ${({ position }) => -1 * position.y};
  --deg: ${({ degrees }) => `${degrees}deg`};

  --midpoint: calc(50% - calc(var(--cube-size) / 2));

  transform: rotateX(90deg) translateY(var(--cube-size)) rotateZ(var(--deg))
    translateX(var(--midpoint)) translateY(var(--midpoint))
    translateX(calc(var(--cube-size) * var(--x-pos)))
    translateY(calc(var(--cube-size) * var(--y-pos)));
`;

export function MapRenderer() {
  const { state, rotate, move } = useMapPosition(map);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      console.log('code', e.code);
      if (e.code === 'ArrowLeft') {
        rotate('L');
      } else if (e.code === 'ArrowRight') {
        rotate('R');
      } else if (e.code === 'ArrowUp') {
        move('F');
      } else if (e.code === 'ArrowDown') {
        move('B');
      }
    },
    [rotate]
  );

  console.log(state.direction, state.position);
  return (
    <Container tabIndex={-1} onKeyDown={handleKeyDown}>
      <MapGeometry
        position={state.position}
        degrees={directionToDegrees(state.direction)}
      >
        {map.data.map((row, y) => {
          return row.map((tile, x) => {
            // if (state.position.x === x && state.position.y === y) {
            //   return <div key={'X'}>XXXXXX</div>;
            // }
            if (tile === 1) {
              return <Cube key={`${x}:${y}`} x={x} y={y} />;
            }
            return null;
          });
        })}
      </MapGeometry>
    </Container>
  );
}
