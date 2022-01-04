import React, { useEffect, useState } from "react";
import { UploadProps, UploadFile, EWidth } from "./types";
import { psdResolve, fileToBase64, base64ToMd5 } from "./utils";

export default function Upload({
  type,
  onChange,
  children,
  multiple = true,
  style = {},
  size = "small",
  value = []
}: UploadProps) {
  const width = EWidth[size];
  const uploadCompId = +new Date();
  const [images, setImages] = useState<{ src: string; loaded: boolean }[]>([]);

  useEffect(() => {
    if (value.length > images.length) {
      const newImages = value.slice(images.length).map((uploadFile) => ({
        src: uploadFile.image,
        loaded: false
      }));
      newImages.forEach(({ src }, index) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
          newImages[index].loaded = true;
          setImages([...images, ...newImages]);
        };
      });
    }
  }, [value]);

  const getUploadFileList = async (files: FileList) => {
    const uploadFileList = await Promise.all(
      (() => {
        const cacheUids = [];
        const uploadFileList = Array.from(files).map(async (file) => {
          const fileBase64 = await fileToBase64(file);
          const uploadFile: UploadFile = {
            uid: "",
            type,
            file,
            fileBase64,
            image: fileBase64,
            name: file.name,
            size: file.size
          };
          if (type === "psd") {
            const {
              uid,
              layers,
              layerNameList,
              colorMode,
              width,
              height,
              treeExport,
              image
            } = await psdResolve(file);
            uploadFile.uid = uid;
            uploadFile.image = image.base64;
            uploadFile.psd = {
              layers,
              layerNameList,
              colorMode,
              width,
              height,
              treeExport
            };
          } else {
            uploadFile.uid = base64ToMd5(fileBase64);
          }
          if (
            [...value.map((v) => v.uid), ...cacheUids].find(
              (uid) => uid === uploadFile.uid
            )
          ) {
            alert("重复了");
            return null;
          }
          cacheUids.push(uploadFile.uid);
          return uploadFile;
        });
        return uploadFileList;
      })()
    );
    return uploadFileList.filter((i) => i);
  };
  return (
    <form style={{ display: "inline-block" }}>
      <label htmlFor={`fileUpload_${uploadCompId}`}>
        <input
          id={`fileUpload_${uploadCompId}`}
          type="file"
          multiple={multiple}
          accept={`.${type}`}
          value="" // 必须设置为空值，保证 input 不会缓存数据，导致无法连续导入相同文件
          style={{
            display: "none"
          }}
          onChange={async (e) => {
            const { files } = e.target;
            onChange([...value, ...(await getUploadFileList(files))]);
          }}
        />
        <div style={style}>
          {children || (
            <div
              style={{
                display: "flex"
              }}
            >
              {value
                .filter((_, i) => images[i]?.loaded)
                .map((uploadFile, i) => (
                  <div
                    key={uploadFile.uid}
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
                      marginRight: "10px"
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
                        background: "rgb(1, 1, 1,0.4)"
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        const newUploadFileList = value.filter(
                          (item, j) => i !== j
                        );
                        console.log(newUploadFileList);
                        onChange(newUploadFileList);
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
                    <img src={uploadFile.image} height="100%" alt="" />
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
                  alignItems: "center"
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
