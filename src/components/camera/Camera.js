import { useState, useRef } from "react";
import preprocessImage from "./preprocess";
import Tesseract from "tesseract.js";

import Cam from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

function Camera() {
  const [src, setSrc] = useState("");

  const setImage = useState("")[1];
  const [text, setText] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
    // setImage(`${window.location.origin}/${event.target.files[0].name}`);
    // const image = preprocessImage(canvasObj, event.target.files[0]);
  };

  const handleClick = () => {
    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas), 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    console.log({ dataUrl, text, imageRef });

    Tesseract.recognize(dataUrl, "eng", {
      logger: (m) => {
        setProgress(m.progress);
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        // Get full output
        let text = result.data.text;

        console.log(result);

        setText(text);
        // setPin(patterns);
      });
  };

  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");

    setSrc(dataUri);

    console.log(dataUri);
  }

  return (
    <div className="App">
      <main className="App-main">
        <input
          type="file"
          onChange={handleChange}
          onInput={(e) =>
            (imageRef.current.src = window.URL.createObjectURL(
              e.target.files[0]
            ))
          }
        />
        <button onClick={handleClick}>Convert to text</button>
        <div className="pin-box">{text}</div>

        <div style={{ overflow: "hidden" }}>
          <div style={{ overflowY: "scroll" }}>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            <img id="pic" ref={imageRef} src={src} />
          </div>
        </div>
      </main>
      <Cam
        onTakePhoto={(dataUri) => {
          handleTakePhoto(dataUri);
        }}
      />
    </div>
  );
}

export default Camera;
