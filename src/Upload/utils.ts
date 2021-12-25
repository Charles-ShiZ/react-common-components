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
export async function fileToBase64(files: FileList | File[] | File): Promise<string[] | string> {
  if (Array.isArray(files) || files instanceof FileList) {
    return await Promise.all(Array.from(files).map(async (file) => await fileToBase64Promise(file)));
  } else {
    return await fileToBase64Promise(files);
  }
}
export function base64ToMd5(base64:string) {
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

export async function resolvePsd(file: File) {
  window.Buffer = Buffer; // psd.js 源码没有将 Buffer 赋值给 window，需要手动赋值，不然会报错 Buffer不存在的错误
  const psdUrl = (window.URL || window.webkitURL).createObjectURL(file);
  const psdEvt = await PSD.fromURL(psdUrl);
  const imageBase64 = psdEvt.image.toBase64();
  return {
    file,
    layers: psdEvt.tree().descendants(),
    image: {
      base64: imageBase64,
      file: BolbToFile(dataURLtoBlob(imageBase64), `psdImage_${+new Date()}`, "image/png")
    }
  };
}
