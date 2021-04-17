import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { MapRenderer } from './MapRenderer';

const GlobalStyles = createGlobalStyle`
:root {
    --border-color: rgba(100, 100, 100, 1);
}
body,html {
    margin: 0;
    padding: 0;
}
`;

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
`;

export function App() {
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        test
        <MapRenderer />
      </AppContainer>
    </>
  );
}
