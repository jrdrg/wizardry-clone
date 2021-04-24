import React, { CSSProperties, useCallback, useRef } from 'react';
import styled from 'styled-components';
import mapData from './map.json';

import {
  convertToMap,
  directionToDegrees,
  getNeighboringDirections,
} from './mapUtils';
import { useMapPosition } from './useMapPosition';

import { Cube } from './Cube';
import { Minimap } from './Minimap';

const map = convertToMap(mapData.map, mapData.start);

const between = (min: number, max: number, value: number) =>
  value >= min && value <= max;

const VIEW_RADIUS = 3;

const Container = styled.div`
  &:focus {
    outline: none;
  }

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

const CameraOffset = styled.div`
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
  const viewportRef = useRef<HTMLDivElement>(null);

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      const offsetLeft = rect?.left ?? 0;
      const offsetTop = rect?.top ?? 0;

      const clickX = e.clientX - offsetLeft;
      const clickY = e.clientY - offsetTop;

      if (rect) {
        const leftPoint = rect.width / 4;
        const rightPoint = (rect.width / 4) * 3;
        const forwardPoint = rect.height / 4;
        const backPoint = (rect.height / 4) * 3;

        if (clickX <= leftPoint) {
          rotate('L');
        } else if (clickX >= rightPoint) {
          rotate('R');
        } else if (clickY <= forwardPoint) {
          move('F');
        } else if (clickY >= backPoint) {
          move('B');
        }
      }

      return null;
    },
    [move, rotate]
  );

  const animation = state.animation
    ? `rotate-${state.animation.toLowerCase()}`
    : null;

  return (
    <>
      <Minimap map={map} position={state.position} />
      <Container
        tabIndex={-1}
        ref={viewportRef}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        <MapGeometry>
          <CameraRotation
            animation={animation}
            degrees={directionToDegrees(state.direction)}
          >
            <CameraOffset
              style={
                {
                  ['--x-pos']: -1 * state.position.x,
                  ['--y-pos']: -1 * state.position.y,
                } as CSSProperties
              }
            >
              <CameraPosition>
                {map.data.map((row, y) => {
                  return row.map((tile, x) => {
                    const neighbors = getNeighboringDirections(map, x, y);
                    // don't need to render the entire map, just what we can see
                    const isVisible =
                      between(
                        state.position.x - VIEW_RADIUS,
                        state.position.x + VIEW_RADIUS,
                        x
                      ) &&
                      between(
                        state.position.y - VIEW_RADIUS,
                        state.position.y + VIEW_RADIUS,
                        y
                      );

                    if (tile === 1) {
                      return (
                        <Cube
                          key={`${x}:${y}`}
                          x={x}
                          y={y}
                          neighbors={neighbors}
                          isVisible={isVisible}
                        />
                      );
                    }
                    return null;
                  });
                })}
              </CameraPosition>
            </CameraOffset>
          </CameraRotation>
        </MapGeometry>
      </Container>
    </>
  );
}
