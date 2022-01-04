import React, { useState } from "react";
import ReactDom from "react-dom";
import Upload, { UploadFile } from "./Upload";

function App() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([
    {
      uid: "1",
      name: "image1",
      type: "png",
      image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d212b9c7e1da40b5be9e856abe80181c~tplv-k3u1fbpfcp-watermark.image?",
    },
    {
      uid: "2",
      name: "image2",
      type: "png",
      image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d78230d03e104999895c374b3ea850ff~tplv-k3u1fbpfcp-watermark.image?",
    }
  ]);
  console.log(uploadFiles);
  return (
    <>
      <Upload
        value={uploadFiles}
        type="psd"
        onChange={(data) => {
          setUploadFiles(data);
        }}
      ></Upload>
    </>
  );
}

ReactDom.render(<App />, document.querySelector("#root"));
