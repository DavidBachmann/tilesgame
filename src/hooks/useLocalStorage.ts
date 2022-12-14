// <3 <3 <3
// Based on https://usehooks-ts.com/react-hook/use-local-storage
// <3 <3 <3

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEventListener } from "./useEventListener";

function useStableCallback<Args extends any[], T>(
  callback: (...args: Args[]) => T
) {
  const callbackContainer = useRef(callback);
  callbackContainer.current = callback;
  return useCallback(
    (...args: Args) => callbackContainer.current(...args),
    [callbackContainer]
  );
}

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Get from local storage then

  // parse stored json or return initialValue

  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keeps working

    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? (parseJSON(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);

      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value

  // Pass initial state function to useState so logic is only executed once

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...

  // ... persists the new value to localStorage.

  const setValue: SetValue<T> = useStableCallback((value) => {
    // Prevent build error "window is undefined" but keeps working

    if (typeof window === "undefined") {
      return;
    }

    try {
      // Allow value to be a function so we have the same API as useState

      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to local storage

      window.localStorage.setItem(key, JSON.stringify(newValue));

      // Save state

      setStoredValue(newValue);

      // We dispatch a custom event so every useLocalStorage hook are notified

      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  });

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }

      setStoredValue(readValue());
    },

    [key, readValue]
  );

  // this only works for other documents, not the current one

  useEventListener("storage", handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage

  // See: useLocalStorage()

  useEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue];
}

// A wrapper for "JSON.parse()"" to support "undefined" value

function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch {
    console.log("parsing error on", { value });

    return undefined;
  }
}
