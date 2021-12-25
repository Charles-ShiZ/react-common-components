import React, { useState } from "react";
import { UploadProps, TCurrFiles, EWidth } from "./types";
import { resolvePsd } from "./utils";

export default function Upload({
  type,
  onChange,
  children,
  multiple = true,
  style = {},
  size = "medium",
  value = [],
}: UploadProps) {
  const valueFromProps: TCurrFiles[] = (() => {
    if (value instanceof FileList || Array.isArray(value)) {
      return Array.from(value).map((item) => {
        if (item instanceof File) {
          return { file: item };
        } else {
          return { image: { base64: item } };
        }
      });
    } else {
      if (value instanceof File) {
        return new Array({ file: value });
      } else {
        return new Array({ image: { base64: value } });
      }
    }
  })();
  const width = EWidth[size];
  const uploadId = +new Date();
  const [currFiles, setCurrFiles] = useState<Set<TCurrFiles>>(
    new Set(valueFromProps)
  );
  const accept = {
    image: "",
    // psd: 'application/vnd.adobe.photoshop',
    psd: ".psd",
  };
  return (
    <form style={{ display: "inline-block" }}>
      <label htmlFor={`fileUpload_${uploadId}`}>
        <input
          id={`fileUpload_${uploadId}`}
          type="file"
          multiple={multiple}
          accept={accept[type]}
          value="" // 必须设置为空值，保证 input 不会缓存数据，导致无法连续导入相同文件
          style={{
            display: "none",
          }}
          onChange={async (e) => {
            const { files } = e.target;
            const resolvedPsds = await Promise.all(
              Array.from(files).map(async (file) => await resolvePsd(file))
            );
            setCurrFiles(new Set([...currFiles, ...resolvedPsds]));
            onChange(resolvedPsds);
          }}
        />
        <div style={style}>
          {children || (
            <div
              style={{
                display: "flex",
              }}
            >
              {Array.from(currFiles).map((file, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  style={{
                    boxSizing: "border-box",
                    height: width + "px",
                    border: "1px solid #eeeeee",
                    padding: "5px",
                    borderRadius: "3px",
                    display: "flex",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      right: "0px",
                      width: "15px",
                      height: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      background: "rgb(1, 1, 1,0.4)",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const newFiles = new Set(currFiles);
                      newFiles.delete(file);
                      setCurrFiles(newFiles);
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 400 400">
                      <path
                        d="M 120 120 L 280 280 M 120 280 L 280 120"
                        stroke="white"
                        strokeWidth="20"
                      />
                    </svg>
                  </div>
                  <img src={file.image.base64} height="100%" alt="" />
                </div>
              ))}
              <div
                style={{
                  boxSizing: "border-box",
                  padding: "15px",
                  width: width + "px",
                  height: width + "px",
                  border: "1px solid #eeeeee",
                  borderRadius: "3px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg width="100%" height="100%" viewBox="0 0 400 400">
                  <path
                    d="M 50 200 L 350 200 M 200 50 L 200 350"
                    stroke="#ccc"
                    strokeWidth="6"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </label>
    </form>
  );
}
