import { countHours } from "../src/utils/hooks/utils";

const useStreetHistory = () => {
  const [history, setHistory] = useLocalStorage("all-history", {});

  const { selected, set } = useStreetContext();

  const data = Object.keys(history).flatMap((e) => {
    return [...history[e]];
  });

  const removeDelivered = () => {
    set((selected) => selected.filter((e) => !e?.delivered));
  };

  const addCompleteToHistory = () => {
    const now = new Date().toISOString().split("T")[0];

    const delivered = selected.filter((e) => e.delivered);

    setHistory((history) => {
      const newHistory = { ...history };
      newHistory[now] = [...newHistory[now], ...delivered];
      removeDelivered();
      return newHistory;
    });
  };

  const stats = {
    hoursTotal: countHours(data),
    hoursHistory: Object.keys(history).reduce((acc, e) => {
      acc[e] = countHours(history[e]);
      return acc;
    }, {}),
  };

  return { removeDelivered, addCompleteToHistory, history, data, stats };
};
