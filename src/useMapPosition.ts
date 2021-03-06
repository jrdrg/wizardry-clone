import { useCallback, useReducer } from 'react';

import { isWalkable, MapData } from './mapUtils';
import type { Direction, Rotation } from './types';
import { assertNever } from './utils';

// type Animation = 'N-E' | 'N-W' | 'E-N' | 'E-S' | 'S-E' | 'S-W' | 'W-N' | 'W-S';
type DirectionAnimation = `${Direction}-${Direction}`;

type State = {
  map: MapData;
  animation: DirectionAnimation | null;
  direction: Direction;
  position: {
    x: number;
    y: number;
  };
};

type Action =
  | {
      type: 'rotateLeft';
    }
  | { type: 'rotateRight' }
  | { type: 'move'; moveDirection: 'F' | 'B' };

const movement = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'rotateLeft': {
      const prevDir = state.direction;
      const newDir = rotate90(state.direction, 'L');
      const animation = `${prevDir}-${newDir}` as DirectionAnimation;
      return {
        ...state,
        animation,
        direction: newDir,
      };
    }
    case 'rotateRight': {
      const prevDir = state.direction;
      const newDir = rotate90(state.direction, 'R');
      const animation = `${prevDir}-${newDir}` as DirectionAnimation;
      return {
        ...state,
        animation,
        direction: newDir,
      };
    }
    case 'move': {
      const { moveDirection } = action;
      const { direction } = state;
      const sign = moveDirection === 'F' ? 1 : -1;
      const [dx, dy] = movement[direction];
      const [nx, ny] = [
        state.position.x + dx * sign,
        state.position.y + dy * sign,
      ];
      if (isWalkable(state.map, nx, ny)) {
        return {
          ...state,
          position: {
            x: nx,
            y: ny,
          },
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

function rotate90(currentDirection: Direction, rotation: Rotation): Direction {
  switch (currentDirection) {
    case 'N': {
      return rotation === 'L' ? 'W' : 'E';
    }
    case 'S': {
      return rotation === 'L' ? 'E' : 'W';
    }
    case 'E': {
      return rotation === 'L' ? 'N' : 'S';
    }
    case 'W': {
      return rotation === 'L' ? 'S' : 'N';
    }
    default: {
      return assertNever(currentDirection);
    }
  }
}

export function useMapPosition(mapData: MapData) {
  const [state, dispatch] = useReducer(reducer, {
    animation: null,
    map: mapData,
    direction: 'N',
    position: mapData.start,
  });

  const rotate = useCallback(
    (rotation: Rotation): void => {
      switch (rotation) {
        case 'L': {
          return dispatch({ type: 'rotateLeft' });
        }
        case 'R': {
          return dispatch({ type: 'rotateRight' });
        }
        default: {
          return assertNever(rotation);
        }
      }
    },
    [dispatch]
  );

  const move = useCallback(
    (direction: 'F' | 'B') => {
      return dispatch({ type: 'move', moveDirection: direction });
    },
    [dispatch]
  );

  return { state, rotate, move };
}
