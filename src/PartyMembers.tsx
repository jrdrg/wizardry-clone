import React from 'react';
import styled from 'styled-components';

import { BREAK_M } from './constants';

const Container = styled.div`
  background-color: var(--background-color);

  display: flex;
  flex-direction: row;

  min-height: 10vh;

  @media only screen and (max-width: ${BREAK_M}) {
    & {
      flex-direction: column;
    }
  }
`;

const CharacterContainer = styled.div`
  color: white;
  flex: 1;
  border: 1px solid white;
  padding: var(--base-padding);
`;

const Name = styled.div`
  color: var(--text-color);
`;
const Class = styled.div`
  color: hsl(35, 30%, 40%);
`;
const Hp = styled.div`
  color: darkred;
`;
const Mp = styled.div`
  color: darkcyan;
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

type Character = {
  name: string;
  class: string;
  hp: number;
  mp: number;
};

type CharacterProps = {
  character: Character;
};

function Character({ character }: CharacterProps) {
  return (
    <CharacterContainer>
      <Name>{character.name}</Name>
      <Class>{character.class}</Class>
      <Hp>
        {character.hp}/{character.hp}
      </Hp>
      <Mp>
        {character.mp}/{character.mp}
      </Mp>
    </CharacterContainer>
  );
}

const characters = [
  {
    name: 'Aragorn',
    class: 'Fighter',
    hp: 10,
    mp: 0,
  },
  {
    name: 'Bilbo',
    class: 'Thief',
    hp: 6,
    mp: 0,
  },
  {
    name: 'Gimli',
    class: 'Fighter',
    hp: 10,
    mp: 0,
  },
  {
    name: 'Gandalf',
    class: 'Wizard',
    hp: 5,
    mp: 10,
  },
  {
    name: 'Legolas',
    class: 'Archer',
    hp: 8,
    mp: 0,
  },
  {
    name: 'Sam',
    class: 'Healer',
    hp: 8,
    mp: 8,
  },
];

export function PartyMembers() {
  const [c1, c2, c3, c4, c5, c6] = characters;
  return (
    <Container>
      <Row>
        <Character character={c1} />
        <Character character={c2} />
        <Character character={c3} />
      </Row>
      <Row>
        <Character character={c4} />
        <Character character={c5} />
        <Character character={c6} />
      </Row>
    </Container>
  );
}
