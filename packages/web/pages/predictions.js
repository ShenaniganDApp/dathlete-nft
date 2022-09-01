import { useEffect, useRef } from 'react';
import Button from '/components/UI/Button';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  liveui: true,
  muted: true,
};

const Predictions = () => {
  const playbackRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = playbackRef.current;

      if (!videoElement) return;
      console.log('videoElement: ', videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        videoJsOptions,
        () => {
          videojs.log('player is ready');
          onReady && onReady(player);
        }
      ));
      // videoElement.addEventListener('error', (event) => {
      //   setTimeout(() => {
      //     console.log('error');
      //     player.play();
      //   }, 1000);
      // });
      // return () => {
      //   videoElement.removeEventListener('error', handleClick);
      // };
    }
  }, [playbackRef]);

  // dispose fucks with hot reload
  // useEffect(() => {
  //   const player = playerRef.current;

  //   return () => {
  //     if (player) {
  //       player.dispose();
  //       playerRef.current = null;
  //     }
  //   };
  // }, [playbackRef]);

  const onReady = (player) => {
    playbackRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div className="h-screen flex flex-col justify-around items-center overflow-hidden gap-10">
      <div className="h-[90vh] flex flex-col justify-around rounded-3xl border-2 border-white:55% p-4 backdrop-blur-sm">
        <div className="w-full flex justify-center items-center text-5xl overflow-x-auto">
          <h1>Titleyaksuuskuksykaruskra tqsarekaeskea</h1>
        </div>
        <div className="flex justify-center items-center max-w-6xl flex-2 bg-black aspect-video">
          <video
            ref={playbackRef}
            className="video-js"
            controls={true}
            autoPlay={false}
          >
            <source
              src="https://livepeercdn.com/hls/8197mqr3gsrpeq37/index.m3u8"
              type="application/x-mpegURL"
            />
          </video>
        </div>
        <div className="flex justify-around items-center">
          <Button>Believe</Button>
          <Button>Doubt</Button>
        </div>
      </div>
      <div className="rounded-3xl border-2 border-white:55% p-4 backdrop-blur-sm opacity-25 ">
        <div className="w-full flex justify-center items-center text-5xl overflow-x-auto">
          <h1>No Content Available</h1>
        </div>
        <div className="flex justify-center items-center max-w-6xl flex-2 bg-black aspect-video">
          <img src="https://static.wikia.nocookie.net/supermarioglitchy4/images/f/f3/Big_chungus.png/revision/latest/scale-to-width-down/700?cb=20200511041102" />
        </div>
      </div>
    </div>
  );
};

export default Predictions;
