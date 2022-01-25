import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiCheckBold } from '@mdi/js';

export const ProgressBar = ({ progressLabels, index }) => {
  return (
    <div className="w-full max-w-3xl bg-slate-500/50 rounded-full overflow-hidden">
      <div className="flex row justify-around ">
        {progressLabels.map((item, itemIndex) => (
          <div
            className={`relative flex items-center justify-center flex-1 py-4 pointer-events-none`}
            key={item}
          >
            {index === itemIndex && (
              <motion.div
                className="absolute bg-red-500 h-full w-full rounded-full bg-sky-500"
                layoutId="progress-pill"
              ></motion.div>
            )}
            <div className="relative z-1">
              {index > itemIndex ? (
                <Icon
                  className="m-auto"
                  path={mdiCheckBold}
                  size={3}
                  color={'cyan'}
                />
              ) : (
                <p className="text-3xl font-bold ">{item}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div />
    </div>
  );
};
