import styled from "styled-components";

import { media } from "../styles/styles";

const Container = styled.div`
  width: 90px;
  height: 2.4em;
  border: 1px solid ${(props) => props.theme.primary.text};
  background-color: ${(props) => props.theme.primary.background};
  padding: 0.5em;
  margin: 0.5em 0.5em 0.5em 0;

  @media ${media.md} {
    width: 100px;
    height: 2.8em;
    padding: 0.8em;
  }
`;

const Price = styled.div`
  color: ${(props) => props.theme.primary.text};
  font-size: 1em;
  width: inherit;

  @media ${media.md} {
    font-size: 1.1em;
  }
`;

const Label = styled.div`
  color: ${(props) => props.theme.secondary.buttons};
  font-size: 1em;
  font-weight: bold;
  padding: 0 0 0.3em 0;

  @media ${media.md} {
    font-size: 1.1em;
    padding: 0 0 0.1em 0;
  }
`;

export { Container, Price, Label };
