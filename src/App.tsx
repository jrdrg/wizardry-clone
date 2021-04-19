import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { MapRenderer } from './MapRenderer';
import { PartyMembers } from './PartyMembers';

const GlobalStyles = createGlobalStyle`
:root {
  --border-color: rgba(100, 100, 99, 1);
  --background-color: hsl(50, 40%, 5%);
  --text-color: rgba(200, 200, 200, 1);

  --base-padding: 8px;
  --cube-size: 300px;

  --minimap-z-index: 1;
  --minimap-height: 15vh;

  --break-m: 900px;
}

body,html {
  margin: 0;
  padding: 0;
  
  font-family: 'EB Garamond', serif;
  min-height: -webkit-fill-available;
}
`;

const AppContainer = styled.div`
  height: 100%;
  width: 100vw;

  display: flex;
  flex-direction: column;
`;

const Navbar = styled.div`
  background-color: var(--background-color);
  padding: var(--base-padding);
  color: var(--text-color);
`;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export function App() {
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Navbar>Wizardry clone</Navbar>
        <MainLayout>
          <MapRenderer />
          <PartyMembers />
        </MainLayout>
      </AppContainer>
    </>
  );
}
