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
      return () => {
        if (player) {
          console.log('dispose');
          player.dispose();
        }
      };
    }
  }, [playbackRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playbackRef]);

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
    <div>
      <div>Title</div>
      <video
        ref={playbackRef}
        className="video-js vjs-big-play-centered"
        width="100%"
        height="auto"
        controls={true}
        autoPlay={true}
      >
        <source
          src="https://livepeercdn.com/hls/8197mqr3gsrpeq37/index.m3u8"
          type="application/x-mpegURL"
        />
      </video>
      <div className="flex">
        <Button>Yes</Button>
        <Button>No</Button>
      </div>
    </div>
  );
};

export default Predictions;
