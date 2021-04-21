import React from 'react';
import styled from 'styled-components';
import { getNeighboringDirections } from './mapUtils';

import { Direction } from './types';

const CubeShape = styled.div<
  Pick<CubeProps, 'x' | 'y'> & { shouldFade: boolean }
>`
  position: absolute;
  top: ${(props) => `calc(${props.y} * var(--cube-size))`};
  left: ${(props) => `calc(${props.x} * var(--cube-size))`};

  & > * {
    opacity: ${({ shouldFade }) => (shouldFade ? 1 : 0)};
    transition: 0.2s all;
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
  neighbors: Set<Direction>;
  x: number;
  y: number;
};

function useFadeIn() {
  const [fade, setFade] = React.useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setFade(true);
    }, 1);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return fade;
}

// Don't bother rendering top and bottom, because we'll never see them anyway
export function Cube(props: CubeProps) {
  const { x, y, neighbors } = props;
  const fade = useFadeIn();
  // if 2 cubes are next to each other, we can avoid rendering the connecting sides
  return (
    <CubeShape x={x} y={y} shouldFade={fade}>
      {!neighbors.has('W') && <Left />}
      {!neighbors.has('E') && <Right />}
      {!neighbors.has('N') && <Back />}
      {!neighbors.has('S') && <Front />}
    </CubeShape>
  );
}
