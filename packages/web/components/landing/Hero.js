import styled, { keyframes } from 'styled-components';
import { Button, Wrapper } from '../UI';
import { breakpoints } from '../../styles';
import Player from 'react-player';

const Hero = () => {
  return (
    <StyledHero>
      <Wrapper>
        <Row>
          <TextContainer>
            <Heading>The Dathlete Experiment</Heading>
            <Button
              href="https://medium.com/@SHEDapp/dathletes-action-packed-nfts-e09d796ee5fd"
              target="_blank"
            >
              Read the Medium Article
            </Button>
          </TextContainer>
          <VideoContainer>
            <VideoAspect>
              <Black>
                <Heading>Video Coming Soon</Heading>
              </Black>
              {/* <PlayerFrame
                url={'https://www.youtube.com/watch?v=I6J40XRlhmk'}
                width={'100%'}
                height={'100%'}
                controls={true}
              /> */}
            </VideoAspect>
          </VideoContainer>
        </Row>
      </Wrapper>
    </StyledHero>
  );
};

export default Hero;

const StyledHero = styled.section`
  min-height: 100vh;
  padding-top: 12rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${breakpoints.md} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  max-width: 66rem;
  padding-right: 1.8rem;

  @media ${breakpoints.md} {
    margin-bottom: 4rem;
  }
`;

const gradientAnimation = keyframes`
	0% {
		background-position: 50% 50%;
	}
	33% {
		background-position: 100% 200%;
	}
	100% {
		background-position: 0% 0%;
	}
`;

const Heading = styled.h1`
  font-size: clamp(3.6rem, 4.5vw, 5.6rem);
  margin-bottom: 3rem;

  background: linear-gradient(
    135deg,
    #127eb7,
    #88e1f3,
    #127eb7,
    #88e1f3,
    #d8f9ff,
    #d8f9ff
  );
  background-size: 200%;
  animation: ${gradientAnimation} 15s infinite alternate;

  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const VideoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  @media ${breakpoints.md} {
    width: 100%;
  }
`;

const VideoAspect = styled.div`
  aspect-ratio: 9/16;
  max-height: 60rem;
`;

const PlayerFrame = styled(Player)``;

const Black = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  width: 100%;
  height: 100%;
  text-align: center;
`;
