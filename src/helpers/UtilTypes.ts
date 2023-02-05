export type ImageMetadata = {
  name: string;
  width: number;
  height: number;
};

export type InputImage = {
  image: HTMLImageElement;
  metadata: ImageMetadata;
};

export type OutputCanvas = {
  canvas: HTMLCanvasElement;
  metadata: ImageMetadata;
};

export type JsxNode =
  | JSX.Element
  | number
  | string
  | boolean
  | null
  | undefined;

export type PickOfValues<Base, Desired> = {
  [key in keyof Base as Base[key] extends Desired ? key : never]: Base[key];
};

export type KeysOfValues<Base, Desired> = keyof PickOfValues<Base, Desired>;
