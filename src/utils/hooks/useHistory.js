import useLocalStorage from "./useLocalStorage";

/**
 *
 * @param {string} set - The function write the previous historic value to
 * @param {array} initial - The initial value of the historic array
 * @param {number} limit - The limit of the historic array
 *
 * @returns {object} - The historic array and the undo function
 *
 * @example
 * const { state, set } = useState(0);
 * const { addHistory, undo } = useHistory(set, 10);
 */

export default function useHistory(set, limit = 10) {
  // Local Storage State to store an array of previous values
  const [history, setH] = useLocalStorage("history", []);
  return {
    addHistory: (s) => {
      console.log(s);
      setH((h) => [s, ...h.slice(0, limit + 1)]);
      return s;
    },
    undo: () => {
      if (history.length > 1 && history[1] !== {}) {
        //0 is current, 1 is previous
        set(history[1]);
        setH((h) => h.slice(1, limit + 1)); //set previous (1) to current (0)
      }
    },
  };
}
