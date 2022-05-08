import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import stylisRTLPlugin from 'stylis-plugin-rtl';

// const cacheRtl = createCache({
//   key: 'bloom-ui',
// prepend: true,
//   // @ts-ignore
//   stylisPlugins: [stylisRTLPlugin]
// });

export const ThemeContext = React.createContext(
  (themeName: string, fontRate: number): void => {}
);

export const FontRateContext = React.createContext((): number => 1);

const ThemeProviderWrapper: React.FC = (props) => {
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const curFontRate = Number(localStorage.getItem('fontRate')) || 1.0;
  const [themeName, _setThemeName] = useState(curThemeName);
  const [fontRate, _setFontRate] = useState<number>(curFontRate);
  const theme = themeCreator(themeName, fontRate);
  const setThemeName = (themeName: string, fontRate: number): void => {
    localStorage.setItem('appTheme', themeName);
    localStorage.setItem('fontRate', String(fontRate));
    _setThemeName(themeName);
    _setFontRate(fontRate);
  };
  const getFontRate = () => {
    return fontRate;
  };

  return (
    <StylesProvider injectFirst>
      {/* <CacheProvider value={cacheRtl}> */}
      <FontRateContext.Provider value={getFontRate}>
        <ThemeContext.Provider value={setThemeName}>
          <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </ThemeContext.Provider>
      </FontRateContext.Provider>
      {/* </CacheProvider> */}
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
