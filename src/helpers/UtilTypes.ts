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
