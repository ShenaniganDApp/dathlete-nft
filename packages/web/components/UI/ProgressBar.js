import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../UI';
import Icon from '@mdi/react';
import { mdiCheckBold } from '@mdi/js';

export const ProgressBar = ({ progressLabels, index }) => {
  return (
    <Container>
      <Row>
        {progressLabels.map((item, itemIndex) => (
          <ItemContainer key={item}>
            <DotContainer>
              <Dot />
              {index === itemIndex && <DotFill />}
              {index > itemIndex && (
                <IconFrame path={mdiCheckBold} size={5} color={'cyan'} />
              )}
            </DotContainer>

            <Label>{item}</Label>
          </ItemContainer>
        ))}
      </Row>
      <Divider />
    </Container>
  );
};

const Container = styled.div`
  /* display: flex; */
  margin-bottom: 6%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const DotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 20px;
  background-color: white;
`;

const DotFill = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 20px;
  background-color: cyan;
  position: absolute;
`;

const Label = styled.p`
  color: white;
  font-size: 16px;
`;

const IconFrame = styled(Icon)`
  position: absolute;
  top: -8px;
  left: 0px;
`;

const Divider = styled.div`
  display: flex;
  height: 2px;
  width: 66.666%;
  background-color: whitesmoke;
  position: absolute;
  top: 11px;
  align-self: center;
  z-index: -1;
`;
