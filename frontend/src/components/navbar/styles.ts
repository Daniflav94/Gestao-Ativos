import styled from "styled-components";

export const Nav = styled.nav`
  position: fixed;
  z-index: 9999;
  height: auto;
  width: 100%;
  top: 0;
  background-color: ${(props) => props.theme.colors.blue};
  box-shadow: 0.3px 0.6px 0.6px hsl(0deg 0% 0% / 0.49);
`;

export const Ul = styled.ul`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5rem;
  margin: 0;
`;

export const Logo = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Img = styled.img`
  width: 8rem;
`;

export const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
`;

export const Span = styled.span`
  font-weight: 400;
  font-size: 0.9rem;
  color: aliceblue;
  z-index: 99999;
  padding-bottom: 0.5rem;
  letter-spacing: 0.1rem;
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom: 2px solid ${(props) => props.theme.colors.orange};
    transition:  0.2s ease;
  }
`;

export const ButtonDropdown = styled(Span)`
  
`;
