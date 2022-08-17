import { useTransition, animated } from "@react-spring/web";

export default function AnimatedList({
  children,
  list,
  getKey = (item) => item.name,
}) {
  let height = 0;
  const transitions = useTransition(
    list.map((li) => ({ ...li, y: (height += li.height) - li.height })),
    {
      key: getKey,
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      update: ({ y, height }) => ({ y, height }),
    }
  );

  return (
    <div style={{ height }}>
      {transitions((style, item, t, index) => (
        <animated.div
          style={{
            position: "absolute",
            width: "100%",
            zIndex: index,
            ...style,
          }}
        >
          {children[index]}
        </animated.div>
      ))}
    </div>
  );
}
