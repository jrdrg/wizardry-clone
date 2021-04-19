import React from 'react';
import styled from 'styled-components';

const CubeShape = styled.div<CubeProps>`
  position: absolute;
  top: ${(props) => `calc(${props.y} * var(--cube-size))`};
  left: ${(props) => `calc(${props.x} * var(--cube-size))`};
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
  x: number;
  y: number;
};

// Don't bother rendering top and bottom, because we'll never see them anyway
export function Cube(props: CubeProps) {
  const { x, y } = props;
  return (
    <CubeShape x={x} y={y}>
      <Left />
      <Right />
      <Back />
      <Front />
    </CubeShape>
  );
}
