import md5 from "js-md5";
import PSD from "psd.js";
import { Buffer } from "buffer";

function fileToBase64Promise(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).replace(/^data:(.*)base64,/, ""));
    reader.onerror = (e) => reject(e);
  });
}

export async function fileToBase64(file: File) {
  return await fileToBase64Promise(file);
}

export function base64ToMd5(base64: string) {
  return md5(base64);
}

export const dataURLtoBlob = (dataurl: string) => {
  const arr: string[] = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { // eslint-disable-line
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const BolbToFile = (blob: BlobPart, name: string, mime: string) => {
  const file = new File([blob], name, {
    type: mime,
  });
  return file;
};

export async function psdResolve(file: File) {
  window.Buffer = Buffer; // psd.js 源码没有将 Buffer 赋值给 window，需要手动赋值，不然会报错 Buffer不存在的错误
  const psdUrl = (window.URL || window.webkitURL).createObjectURL(file);
  const psdEvt = await PSD.fromURL(psdUrl);
  const imageBase64 = psdEvt.image.toBase64();
  const layers = psdEvt.tree().descendants();
  const layerNameList = (layers || []).map(layer => layer.name) as string[];
  const colorMode = psdEvt.header.mode; // 颜色模式（3 表示 RGB模式，4 表示 CMYK模式）
  const uid = base64ToMd5(imageBase64); // psd 文件必须使用其对应image的base64来生成唯一标识符。如果直接使用psd文件的base64来生成，在不同的操作系统下，md5的结果会有不同。
  try {
    const treeExport = psdEvt.tree().export();
    return {
      uid,
      file,
      layers,
      layerNameList,
      colorMode,
      width: psdEvt.image.width(),
      height: psdEvt.image.height(),
      treeExport,
      image: {
        base64: imageBase64,
        file: BolbToFile(dataURLtoBlob(imageBase64), `psdImage_${+new Date()}`, "image/png")
      }
    };
  } catch (error) {
    console.error(error);
    return {
      uid,
      file,
      layers,
      layerNameList,
      colorMode,
      width: psdEvt.image.width(),
      height: psdEvt.image.height(),
      treeExport: null,
      image: {
        base64: imageBase64,
        file: BolbToFile(dataURLtoBlob(imageBase64), `psdImage_${+new Date()}`, "image/png")
      }
    };
  }

}
