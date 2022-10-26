import { ResizableBox as ReactResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";

export default function ResizableBox({
  children,
  width = 600,
  height = 300,
  resizable = true,
  style = {},
  className = "",
}) {
  return resizable ? (
    <ReactResizableBox width={width} height={height}>
      {children}
    </ReactResizableBox>
  ) : (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
