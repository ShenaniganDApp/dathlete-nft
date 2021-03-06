import constants from '../../contracts/diamondABI/localAddresses.json';
import Image from 'next/image';
import usePoller from '/hooks/usePoller';
import styled from 'styled-components';
import { useState } from 'react';
import { ethers } from 'ethers';
import { breakpoints } from '../styles';
import ERC20 from '../../contracts/artifacts/contracts/interfaces/IERC20.sol/IERC20.json';

import { Button } from '../components/UI';

// import Counter from '/components/UI/Counter';

import SHE from '/assets/SHE.png';

const cardData = [
  {
    image: SHE,
    title: 'title',
    description: 'description',
  },
];

const Purchase = (props) => {
  const { web3Provider, address } = props;
  const { diamondAddress, prtcleAddress } = constants;
  const [prtcleBalance, setPrtcleBalance] = useState('0');

  const getPrtcleBalance = async () => {
    if (!address || !web3Provider) return;
    try {
      const contract = new ethers.Contract(
        prtcleAddress,
        ERC20.abi,
        web3Provider
      );
      const balance = await contract.balanceOf(address);
      setPrtcleBalance(balance.toString());
    } catch (e) {
      console.log(e);
    }
  };

  usePoller(
    () => {
      getPrtcleBalance();
    },
    props.pollTime ? props.pollTime : 1999
  );

  return (
    <div>
      <PurchaseStats>
        <NFTStats>
          <StatsTextFrame>
            <StatsSubText>NFTs in Auction</StatsSubText>
            {/* <Counter number={10} /> */}
          </StatsTextFrame>
        </NFTStats>
        <Spacer />
        <AuctionStats>
          <StatsTextFrame>
            <StatsSubText>Lowest Bid</StatsSubText>
            {/* <Counter number={10} /> */}
            <StatsText>DAI</StatsText>
          </StatsTextFrame>
        </AuctionStats>
      </PurchaseStats>

      <Auction>
        <AuctionHeader>
          <Image src={SHE} height={70} width={70} />
          <NFTTitle>Title of NFT</NFTTitle>
          <Text>
            Description of NFT that will probably need to be smaller and will
            have more words
          </Text>
        </AuctionHeader>
        <NFTCards>
          {[...Array(15).keys()].map(() => (
            <Card>
              <CardContent>
                <input placeholder={'Enter bid amount'} />

                <Text>Receive</Text>

                <Button>Bid</Button>
              </CardContent>
              <Title>Minimum Bid: 10 DAI</Title>
            </Card>
          ))}
        </NFTCards>
      </Auction>

      <p>{prtcleBalance}</p>
    </div>
  );
};

export default Purchase;

const Text = styled.p`
  color: whitesmoke;
`;

const Row = styled.div`
  display: flex;
  @media ${breakpoints.md} {
    width: 100%;
    max-width: 56rem;
    flex-direction: column;
  }
`;

const PurchaseStats = styled(Row)`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 300px;
  padding: 10px;
`;

const AuctionStats = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const NFTStats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 50%;
`;

const StatsTextFrame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
`;

const StatsSubText = styled.div`
  color: rgba(245, 245, 245, 0.8);
  align-self: flex-end;
  font-size: 25px;
  margin: 0;
  padding: 0;
  vertical-align: bottom;
  line-height: 1em;
`;

const NFTTitle = styled.h1`
  margin: 0;
  color: whitesmoke;
`;

const StatsText = styled.div`
  padding: 0;
  margin: 0;
  color: whitesmoke;
  font-size: 80px;
  vertical-align: bottom;
  line-height: 1em;
`;

const AuctionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Auction = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spacer = styled.div`
  height: 100%;
  width: 2rem;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
  border-radius: 10px;
  position: relative;
  z-index: 3;
  /* background-color: #1a181a; */
  backdrop-filter: blur(3px);
  background-color: rgba(245, 245, 245, 0.1);
  border: 1px solid whitesmoke;
  width: 100%;
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

const Title = styled.h3`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const NFTCards = styled.ul`
  display: flex;
  width: 80%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  & > div {
    flex-basis: calc(100%);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
`;
