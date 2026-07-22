import { useState } from "react";
import { readKey, writeKey } from "../lib/storage";

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readKey(key, initial));
  const update = (next) => {
    setValue(next);
    writeKey(key, next);
  };
  return [value, update];
}
