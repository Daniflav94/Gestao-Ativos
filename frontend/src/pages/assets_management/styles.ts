import styled from "styled-components";

export const Container = styled.nav`
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 7rem 0;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 700px){
    margin : 5rem 0;
  }
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 4rem;

  @media only screen and (max-width: 700px){
  padding : 0 1rem;
  }
`;

export const Title = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.orange};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: ${(props) => props.theme.colors.gray};
`;

export const Table = styled.div`
  margin: 2rem;
  padding: 0 4rem;
  width: 100%;

  @media only screen and (max-width: 700px){
  padding : 0 1rem;
  }
`;

export const IconClose = styled.img`
  width: 1rem;
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  z-index: 9999;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    cursor: pointer;
    transition: 0.1s ease-in;
  }
`;

export const IconCloseDate
= styled.img`
  width: 1rem;
  position: absolute;
  right: 3rem;
  bottom: 0.5rem;
  z-index: 9999;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    cursor: pointer;
    transition: 0.1s ease-in;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 90%;
  justify-content: center;
  align-items: center;
`;

export const InputFile = styled.div`
  font-size: 0.9rem;
  font-weight: 400;
  border: 2px solid #e4e4e7;
  border-radius: 12px;
  padding: 0.7rem;
  width: 100%;
  display: flex;
  justify-content: space-around;

  &:hover {
    border: 2px solid ${(props) => props.theme.colors.gray};
    transition: border 0.3s;
  }
`;

export const ContentInputFile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 0.4rem;
  color: ${(props) => props.theme.colors.gray};
`;

export const ButtonFile = styled.span`
  width: 40%;
  background-color: ${(props) => props.theme.colors.gray};
  padding: 0.4rem 1rem;
  border-radius: 8px;
  color: white;
  font-size: 0.7rem;
  cursor: pointer;
`;

export const DualInput = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 0.7rem;
`;

export const ContainerData = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const ContentData = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
`;

export const ItemTitle = styled.div`
  color: ${(props) => props.theme.colors.gray};
  font-weight: 600;
`;
