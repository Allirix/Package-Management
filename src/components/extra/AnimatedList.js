import { useState } from "react";
import { useTransition, animated } from "react-spring";
import shuffle from "lodash/shuffle";

let data = [
  {
    name: "Rare Wind",
  },
  {
    name: "Saint Petersburg",
  },
  {
    name: "Deep Blue",
  },
  {
    name: "Ripe Malinka",
  },
  {
    name: "Near Moon",
  },
  {
    name: "Wild Apple",
  },
];

function App() {
  const [rows, set] = useState(data);
  const height = 20;
  const transitions = useTransition(
    rows.map((data, i) => ({ ...data, name: data.name, y: i * height })),
    {
      from: { position: "absolute", opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y }) => ({ y, opacity: 1 }),
      update: ({ y }) => ({ y }),
    }
  );

  return (
    <div className="list">
      <button onClick={() => set(shuffle(rows))}>shuffle</button>
      <button onClick={() => set(rows.slice(1))}>remove first</button>
      <button
        onClick={() =>
          set([
            { name: `list item ${Math.floor(Math.random() * 1000)}` },
            ...rows,
          ])
        }
      >
        add first
      </button>
      {transitions((e, item) => {
        const { y, ...rest } = e;

        return (
          <animated.div
            key={item.name}
            className="card"
            style={{
              transform: y.interpolate((y) => `translate3d(0,${y}px,0)`),
              ...rest,
            }}
          >
            <div className="cell">
              <div className="details">{item.name}</div>
            </div>
          </animated.div>
        );
      })}
    </div>
  );
}

export default App;
