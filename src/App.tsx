import React, { useState } from "react";
import Theme from "./Theme";

import Chart from "./components/Chart/Chart.view";
import { Header } from "./components/Header/Header.view";
import {
  HeaderContainer,
  Toggle,
  ToggleContainer,
  ToggleText,
  Wrapper,
} from "./App.styles";

const App: React.FC = () => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const toggleText =
    theme === "dark" ? "Turn on the light" : "Turn off the light";

  return (
    <Theme theme={theme}>
      <Wrapper>
        <HeaderContainer>
          <Header />
          <ToggleContainer>
            <ToggleText>{toggleText}</ToggleText>
            <Toggle
              on="dark"
              off="light"
              value={theme}
              onChange={toggleTheme}
            />
          </ToggleContainer>
        </HeaderContainer>
        <Chart currentTheme={theme} />
      </Wrapper>
    </Theme>
  );
};

export default App;
