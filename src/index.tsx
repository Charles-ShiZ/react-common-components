import React, { useState } from "react";
import ReactDom from "react-dom";
import Upload from "./Upload";

function App() {
  const [images, setImages] = useState<string[]>([
    "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d212b9c7e1da40b5be9e856abe80181c~tplv-k3u1fbpfcp-watermark.image?",
    "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d78230d03e104999895c374b3ea850ff~tplv-k3u1fbpfcp-watermark.image?",
  ]);
  console.log(setImages);
  return (
    <>
      <Upload
        value={images}
        type="psd"
        onChange={(data) => {
          console.log(data);
        }}
      ></Upload>
    </>
  );
}

ReactDom.render(<App />, document.querySelector("#root"));
