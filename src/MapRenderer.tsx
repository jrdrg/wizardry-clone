import React, { useCallback } from 'react';
import styled from 'styled-components';
import mapData from './map.json';

import { convertToMap, directionToDegrees } from './mapUtils';
import type { Position } from './types';
import { useMapPosition } from './useMapPosition';

import { Cube } from './Cube';
import { Minimap } from './Minimap';

const map = convertToMap(mapData.map, mapData.start);

const Container = styled.div`
  &:focus {
    outline: none;
  }

  --background-color: hsl(50, 40%, 5%);
  background: var(--background-color);

  border: 1px solid var(--border-color);
  flex: 1;
  overflow: hidden;
  perspective: calc(var(--cube-size) * 1);
  transform-style: preserve-3d;
  height: 100%;
`;

const MapGeometry = styled.div`
  --midpoint: calc(50% - calc(var(--cube-size) / 2));

  height: 100%;
  transform-origin: center;
  transform-style: preserve-3d;
  transform: rotateX(90deg) translateY(calc(2 * var(--cube-size)));

  @keyframes rotate-n-w {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(90deg);
    }
  }
  @keyframes rotate-w-n {
    0% {
      transform: rotateZ(90deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }

  @keyframes rotate-n-e {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(-90deg);
    }
  }
  @keyframes rotate-e-n {
    0% {
      transform: rotateZ(-90deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }

  @keyframes rotate-s-w {
    0% {
      transform: rotateZ(180deg);
    }
    100% {
      transform: rotateZ(90deg);
    }
  }
  @keyframes rotate-w-s {
    0% {
      transform: rotateZ(90deg);
    }
    100% {
      transform: rotateZ(180deg);
    }
  }

  @keyframes rotate-s-e {
    0% {
      transform: rotateZ(180deg);
    }
    100% {
      transform: rotateZ(270deg);
    }
  }
  @keyframes rotate-e-s {
    0% {
      transform: rotateZ(270deg);
    }
    100% {
      transform: rotateZ(180deg);
    }
  }
`;

const CameraOffset = styled.div<{ position: Position }>`
  --x-pos: ${({ position }) => -1 * position.x};
  --y-pos: ${({ position }) => -1 * position.y};

  transition: 0.7s all;
  transform-style: preserve-3d;
  transform: translateX(calc(var(--cube-size) * var(--x-pos)))
    translateY(calc(var(--cube-size) * var(--y-pos)));
`;

const CameraRotation = styled.div<{
  animation: string | null;
  degrees: number;
}>`
  --deg: ${({ degrees }) => `${degrees}deg`};

  transform-style: preserve-3d;
  transform: rotateZ(var(--deg));

  animation: ${({ animation }) => `${animation} 0.3s linear`};
`;

const CameraPosition = styled.div`
  transform-style: preserve-3d;
  transform: translateX(var(--midpoint)) translateY(var(--midpoint));
`;

export function MapRenderer() {
  const { state, rotate, move } = useMapPosition(map);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        rotate('L');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        rotate('R');
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        move('F');
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        move('B');
      }
    },
    [move, rotate]
  );

  const animation = state.animation
    ? `rotate-${state.animation.toLowerCase()}`
    : null;

  return (
    <Container tabIndex={-1} onKeyDown={handleKeyDown}>
      <Minimap map={map} position={state.position} />
      <MapGeometry>
        <CameraRotation
          animation={animation}
          degrees={directionToDegrees(state.direction)}
        >
          <CameraOffset position={state.position}>
            <CameraPosition>
              {map.data.map((row, y) => {
                return row.map((tile, x) => {
                  if (tile === 1) {
                    return <Cube key={`${x}:${y}`} x={x} y={y} />;
                  }
                  return null;
                });
              })}
            </CameraPosition>
          </CameraOffset>
        </CameraRotation>
      </MapGeometry>
    </Container>
  );
}
