// <3 <3 <3
// Based on https://usehooks-ts.com/react-hook/use-countdown
// <3 <3 <3

import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";

interface UseBooleanOutput {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

function useBoolean(defaultValue?: boolean): UseBooleanOutput {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = useCallback(() => setValue(true), []);

  const setFalse = useCallback(() => setValue(false), []);

  const toggle = useCallback(() => setValue((x) => !x), []);

  return { value, setValue, setTrue, setFalse, toggle };
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

interface UseCounterOutput {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

function useCounter(initialValue?: number): UseCounterOutput {
  const [count, setCount] = useState(initialValue ?? 0);

  const increment = () => setCount((x) => x + 1);
  const decrement = () => setCount((x) => x - 1);
  const reset = () => setCount(initialValue ?? 0);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}

interface CountdownOption {
  countStart: number;
  intervalMs?: number;
  countStop?: number;
  onComplete?: () => void;
}

interface CountdownControllers {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  resetCountdownAtValue: (val: number) => void;
}

export function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers] {
  const {
    countStart,
    intervalMs = 1000,
    countStop = 0,
    onComplete,
  } = countdownOption;

  const {
    count,
    decrement,
    reset: resetCounter,
    setCount,
  } = useCounter(countStart);

  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false);

  /**
   * Will set running false and reset the seconds to initial value
   */

  const resetCountdown = (newCount?: number) => {
    stopCountdown();
    resetCounter();
    if (newCount) {
      setCount(newCount);
    }
  };

  const resetCountdownAtValue = (value: number) => {
    stopCountdown();
    setCount(value);
    startCountdown();
  };

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown();
      if (typeof onComplete === "function") {
        onComplete();
      }
      return;
    }

    decrement();
  }, [count, countStop, decrement, stopCountdown, onComplete]);

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null);

  return [
    count,
    {
      startCountdown,
      stopCountdown,
      resetCountdown,
      resetCountdownAtValue,
      onComplete,
    } as CountdownControllers,
  ];
}
