import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../UI';
import Icon from '@mdi/react';
import { mdiCheckBold } from '@mdi/js';

export const ProgressBar = ({ progressLabels, index }) => {
  return (
    <div className="w-full max-w-3xl bg-slate-500/50 rounded-full overflow-hidden">
      <div className="flex row justify-around ">
        {progressLabels.map((item, itemIndex) => (
          <div
            className={`flex items-center justify-center flex-1 py-4 pointer-events-none ${
              index === itemIndex && 'bg-sky-500 rounded-full shadow-xl'
            } 
            `}
            key={item}
          >
            <div className="">
              {index > itemIndex ? (
                <Icon
                  className="m-auto"
                  path={mdiCheckBold}
                  size={3}
                  color={'cyan'}
                />
              ) : (
                <p className="text-3xl font-bold">{item}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div />
    </div>
  );
};