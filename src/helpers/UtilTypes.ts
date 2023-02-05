export type NamedImage = {
  image: HTMLImageElement;
  name: string;
};

export type NamedCanvas = {
  canvas: HTMLCanvasElement;
  name: string;
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
