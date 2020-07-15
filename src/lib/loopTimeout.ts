type TCallback = () => boolean;
type TLoopTimeout = (callback: TCallback, timer?: number) => number;

const loopTimeout: TLoopTimeout = (callback, timer = 300) => {
  const timerId = setTimeout(() => {
    if(callback) {
      const isStop = callback();
      if(!isStop) {
        loopTimeout(callback, timer);
      }
    }
  }, timer);

  return timerId;
};

export default loopTimeout;