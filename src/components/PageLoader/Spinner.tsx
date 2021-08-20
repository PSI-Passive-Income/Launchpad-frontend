import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
`;

export interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 128 }) => {
  return (
    <Container>
      <img src="https://psi.blob.core.windows.net/images/Spinner.gif" alt="psi-loader" style={{maxWidth: `${size}px`, maxHeight: `${size}px`}} />
    </Container>
  );
};

export default Spinner;
