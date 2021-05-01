import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Direction } from './types';

type Visibility = 'visible' | 'fade-in' | 'fade-out' | 'hidden';

const CubeShape = styled.div<Pick<CubeProps, 'x' | 'y'>>`
  position: absolute;
  top: ${(props) => `calc(${props.y} * var(--cube-size))`};
  left: ${(props) => `calc(${props.x} * var(--cube-size))`};
`;

const Animation = styled.div<{ fade: Visibility }>`
  & > * {
    opacity: ${({ fade }) => {
      switch (fade) {
        case 'visible':
          return 1;
        case 'fade-out':
          return 0;
        case 'fade-in':
          return 0.25;
        default:
          return 0;
      }
    }};
    transition: 0.6s opacity, background-color;
  }
`;

const Face = styled.div`
  --color-base: 40, 10%;
  --color-l: 50%;

  --color-top: hsl(var(--color-base), calc(var(--color-l) - 30%));
  --color-bottom: hsl(var(--color-base), calc(var(--color-l) - 20%));
  --color-left: hsl(var(--color-base), calc(var(--color-l) - 10%));
  --color-right: hsl(var(--color-base), calc(var(--color-l) + 0%));
  --color-front: hsl(var(--color-base), calc(var(--color-l) + 10%));
  --color-back: hsl(var(--color-base), calc(var(--color-l) + 20%));

  --cube-translate: calc(var(--cube-size) / 2);

  position: absolute;
  box-sizing: border-box;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  height: var(--cube-size);
  width: var(--cube-size);
  background: var(--color-top);
`;

const Left = styled(Face)`
  background-color: var(--color-left);
  transform: rotateY(-90deg) translateZ(var(--cube-translate));
`;

const Right = styled(Face)`
  background-color: var(--color-right);
  transform: rotateY(90deg) translateZ(var(--cube-translate));
`;

const Front = styled(Face)`
  background-color: var(--color-front);
  transform: rotateX(-90deg) translateZ(var(--cube-translate));
`;

const Back = styled(Face)`
  background-color: var(--color-back);
  transform: rotateX(90deg) translateZ(var(--cube-translate));
`;

type CubeProps = {
  isVisible: boolean;
  neighbors: Set<Direction>;
  x: number;
  y: number;
};

function useFadeIn(isVisible: boolean) {
  const isChanged = useRef(false);
  const [fade, setFade] = useState<Visibility>(
    isVisible ? 'visible' : 'hidden'
  );

  useEffect(() => {
    if (isChanged.current) {
      setFade(isVisible ? 'fade-in' : 'fade-out');
    }
    isChanged.current = true;
  }, [isVisible]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (fade === 'fade-in') {
        setFade('visible');
      }
    }, 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [fade]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      // when the transition animation is done, don't render anymore
      if (fade === 'fade-out' && e.propertyName === 'opacity') {
        setFade('hidden');
      }
    },
    [fade]
  );

  return { fade, handleTransitionEnd };
}

// Don't bother rendering top and bottom, because we'll never see them anyway
export function Cube(props: CubeProps) {
  const { x, y, neighbors, isVisible } = props;
  const { fade, handleTransitionEnd } = useFadeIn(isVisible);

  if (fade === 'hidden') {
    return null;
  }

  // if 2 cubes are next to each other, we can avoid rendering the connecting sides
  return (
    <CubeShape x={x} y={y}>
      <Animation
        fade={fade}
        data-fade={fade}
        onTransitionEnd={handleTransitionEnd}
      >
        {!neighbors.has('W') && <Left />}
        {!neighbors.has('E') && <Right />}
        {!neighbors.has('N') && <Back />}
        {!neighbors.has('S') && <Front />}
      </Animation>
    </CubeShape>
  );
}
