import styled from 'styled-components';
import { Header } from '/components/global';
import { Hero, Cards } from '/components/landing';

const Home = () => {
  return (
    <>
      <Header />
      <Main>
        <Hero />
        <Cards />
      </Main>
    </>
  );
};

export default Home;

const Main = styled.main`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
