import Image from 'next/image';
import styled from 'styled-components';
import { breakpoints } from '../../styles';
import { Wrapper } from '../UI';
import tgLogo from '/assets/Telegram_logo.png';
import twitter from '/assets/twitter.png';
import SHE from '/assets/SHE.png';

const Cards = () => {
  const data = [
    {
      title: 'Follow SHE on Twitter',
      image: twitter,
      description:
        'Watch the Dathlete livestream every Friday @ 6PST on SHE Twitter. See for yourself the amazing power of Dathletes',
      url: 'https://twitter.com/She_Dapp',
    },
    {
      title: 'Get 1000 $PRTCLE',
      image: SHE,
      description:
        'Get a stake in the Shenanigan Dathluete Ecosystem and gain access to special content and gated communities',
      url: 'http://she.energy/swap',
    },
    {
      title: 'Join the Telegram',
      image: tgLogo,
      description: `Hold 1000 $PRTCLE and access a token gated community with inside information about the Dathlete`,
      url: 'https://telegram.me/collablandbot?start=VFBDI1RFTCNDT01NIy0xMDAxNTYzNjc5NzAz',
    },
  ];
  return (
    <Section>
      <Wrapper>
        <Row>
          {data.map(({ image, title, description, url }) => (
            <CardBg key={title}>
              <a href={url} target="_blank">
                <Card>
                  <Image src={image} height={70} width={70} />
                  <Title>{title}</Title>
                  <Text>{description}</Text>
                </Card>
              </a>
            </CardBg>
          ))}
        </Row>
      </Wrapper>
    </Section>
  );
};

export default Cards;

const Section = styled.section`
  margin-bottom: 6rem;
  @media ${breakpoints.md} {
    margin-top: 4rem;
  }
`;
const Row = styled.div`
  display: flex;
  @media ${breakpoints.md} {
    width: 100%;
    max-width: 56rem;
    flex-direction: column;
  }
`;

const CardBg = styled.div`
  flex: 1;
  margin-right: 2rem;
  border-radius: 10px;
  padding: 0.2rem;

  background-image: linear-gradient(
    to right,
    #3a343a 50%,
    #f15025 50%,
    #ffc115
  );
  background-size: 200%;
  background-position: 0% 50%;
  transition: all 0.3s;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-position: 100% 50%;
    transform: scale(1.02);
  }

  @media ${breakpoints.md} {
    margin-right: 0;
    margin-bottom: 2rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Card = styled.div`
  text-align: center;
  padding: 4.6rem 1rem;
  border-radius: 10px;
  position: relative;
  z-index: 3;
  background-color: #1a181a;
`;

const Title = styled.h3`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
const Text = styled.p``;
