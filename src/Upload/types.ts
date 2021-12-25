export type UploadProps = {
  type: "image" | "psd"
  value: (string | File) | (string | File)[] | FileList
  children?: JSX.Element[]
  multiple?: boolean
  onChange: (files: any) => void
  style?: {
    [key: string]: string | number
  }
  size?:"small" | "medium" | "large"
}
export type TCurrFiles = {
  file?: File;
  layers?: any[];
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