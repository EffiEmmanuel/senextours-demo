import { useCallback, useMemo, useState } from "react";

export const useToggle = (
  init = false
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [state, setState] = useState(init);
  const toggle = useCallback(() => setState((prev) => !prev), []);

  return useMemo(() => [state, toggle, setState], [state, toggle]);
};
