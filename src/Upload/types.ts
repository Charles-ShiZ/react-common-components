type Uid = string | number
export type UploadFile = {
  uid: Uid
  name: string
  type: string
  size?: number
  image: string
  file?: File
  fileBase64?: string
  psd?: {
    colorMode: number // 颜色模式（3 表示 RGB模式，4 表示 CMYK模式）
    width: number
    height: number
    treeExport: unknown
    layers: unknown[]
    layerNameList: string[]
  }
}
export type UploadProps = {
  type: "png" | "psd"
  value: UploadFile[]
  children?: JSX.Element[]
  multiple?: boolean
  onChange(fileList: UploadFile[]): void
  style?: {
    [key: string]: string | number
  }
  size?: "small" | "medium" | "large"
}
export type TCurrFiles = {
  file?: File;
  layers?: string[];
  image?: {
    base64?: string;
    file?: File;
  };
}
export enum EWidth {
  "small" = "70",
  "medium" = "100",
  "large" = "200",
}