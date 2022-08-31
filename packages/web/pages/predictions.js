import Button from '/components/UI/Button';
import { Client } from '@livepeer/webrtmp-sdk';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';

const streamKey = process.env.NEXT_PUBLIC_LIVEPEER_STREAM_KEY;

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  liveui: true,
  muted: true,
};

const Predictions = () => {
  const [stream, setStream] = useState();
  const streamRef = useRef();
  const playbackRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    const setupStream = async () => {
      if (!streamRef.current) {
        const videoElement = streamRef.current;
        if (!videoElement) return;

        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current.srcObject = s;
        streamRef.current.volume = 0;
        setStream(s);
      } else {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current.srcObject = s;
        streamRef.current.volume = 0;
        setStream(s);
      }
    };
    setupStream();
  }, [streamRef]);

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

  const onStart = () => {
    if (!stream) {
      alert('Video stream not initialized yet.');
    }
    if (!streamKey) {
      alert('Invalid streamKey.');
      return;
    }
    const client = new Client();
    const session = client.cast(stream, streamKey);
    session.on('close', () => {
      console.log('Stream stopped.');
    });

    session.on('error', (err) => {
      console.log('Stream error.', err.message);
    });

    session.on('open', () => {
      console.log('Stream started.');
    });
  };

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
    <div className="w-full">
      <div className="w-full flex flex-col justify-center items-center">
        <div>Title</div>
        <div className=" flex flex-col">
          <video
            ref={streamRef}
            autoPlay={true}
            controls={true}
            width="100%"
            height="auto"
          />
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
        </div>
        <button onClick={() => onStart()}>Start</button>
        <div className="flex">
          <Button>Yes</Button>
          <Button>No</Button>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
