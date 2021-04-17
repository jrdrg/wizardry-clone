import React, { useCallback } from 'react';
import styled from 'styled-components';
import mapData from './map.json';

import { convertToMap } from './mapUtils';
import { useMapPosition } from './useMapPosition';

const map = convertToMap(mapData.map, mapData.start);

const Container = styled.div`
  border: 1px solid var(--border-color);
  flex: 1;

  &:focus {
    outline: none;
  }
`;

export function MapRenderer() {
  const { state, rotate } = useMapPosition(map);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      console.log('code', e.code);
      if (e.code === 'ArrowLeft') {
        rotate('L');
      } else if (e.code === 'ArrowRight') {
        rotate('R');
      }
    },
    [rotate]
  );

  console.log(map, state.direction);
  return (
    <Container tabIndex={-1} onKeyDown={handleKeyDown}>
      map
    </Container>
  );
}
