import { Client } from '@livepeer/webrtmp-sdk';
import { useEffect, useRef, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { Button } from '/components/UI';

const streamKey = process.env.NEXT_PUBLIC_LIVEPEER_STREAM_KEY;

const Streamer = () => {
  const [stream, setStream] = useState();
  const [isStreamManager, setIsStreamManager] = useState(false);
  const streamRef = useRef();
  const { data, isSuccess, isError, isLoading, signMessage } = useSignMessage({
    message: 'I am the stream owner',
  });

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
  }, [streamRef, data]);

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

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {isSuccess ? (
        <div className="w-full h-full flex flex-col justify-around items-center">
          <div>Title</div>
          <div className=" flex flex-col">
            <video ref={streamRef} autoPlay={true} width="100%" height="auto" />
          </div>
          <Button onClick={() => onStart()}>Start Stream</Button>
        </div>
      ) : (
        <>
          <Button disabled={isLoading} onClick={() => signMessage()}>
            Sign
          </Button>
          <>{!isLoading && isError && alert('Error signing message')}</>
        </>
      )}
    </div>
  );
};

export default Streamer;
