import { useCallback, useReducer } from 'react';
import { MapData } from './mapUtils';
import { assertNever } from './utils';

type Direction = 'N' | 'S' | 'E' | 'W';
type Rotation = 'L' | 'R';

type State = {
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
  | { type: 'rotateRight' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'rotateLeft': {
      return {
        ...state,
        direction: rotate90(state.direction, 'L'),
      };
    }
    case 'rotateRight': {
      return {
        ...state,
        direction: rotate90(state.direction, 'R'),
      };
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

  return { state, rotate };
}
