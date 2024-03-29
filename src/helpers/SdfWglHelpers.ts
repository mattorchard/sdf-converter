// @ts-ignore
import vertexShader from "./shaders/vertex.glsl";
// @ts-ignore
import fragmentShader from "./shaders/fragment.glsl";
import { InputImage } from "./UtilTypes";

type VecDimension = 1 | 2 | 3 | 4;

interface Size {
  width: number;
  height: number;
}

function createContext(
  size: Size,
  type: "2d",
): [CanvasRenderingContext2D, HTMLCanvasElement];
function createContext(
  size: Size,
  type: "webgl2",
): [WebGL2RenderingContext, HTMLCanvasElement];
function createContext(size: Size, type: "webgl2" | "2d") {
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext(type);
  if (!context) throw new Error(`Unable to create canvas context`);
  return [context, canvas] as const;
}

const hexToFloat = (hex: string) => {
  const divisor = parseInt(hex, 16);
  if (!divisor) return 0;
  return 256 / divisor;
};

const colorAs4f = (color: string) => {
  if (!/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(color))
    throw new Error(`Invalid color" ${color}"`);
  const red = color.substring(1, 3);
  const green = color.substring(3, 5);
  const blue = color.substring(5, 7);
  const alpha = color.substring(7, 9) || "FF";
  return [
    hexToFloat(red),
    hexToFloat(green),
    hexToFloat(blue),
    hexToFloat(alpha),
  ] as const;
};

export interface SdfOptions {
  upResFactor: number;
  alphaThreshold: number;
  bias: number;
  spread: number;
  inColor: string;
  outColor: string;
  svgWidth: number;
  svgHeight: number;
}

let lastSdfId = 1;
const createSdfId = () => {
  lastSdfId += 1;
  return lastSdfId;
};

export const createSdf = (
  source: InputImage,
  options: SdfOptions,
): HTMLCanvasElement => {
  const sdfId = createSdfId();
  const timerId = `Creating SDF "${sdfId}"`;
  try {
    console.debug(timerId, options);
    console.time(timerId);
    const output = createSdfInternal(source, options);
    return output;
  } catch (error) {
    console.error(`Failed to create SDF "${sdfId}"`);
    throw error;
  } finally {
    console.timeEnd(timerId);
  }
};

const downRes = (
  sourceCanvas: HTMLCanvasElement,
  factor: number,
): HTMLCanvasElement => {
  const newSize = {
    width: sourceCanvas.width / factor,
    height: sourceCanvas.height / factor,
  };
  const [context, transformedCanvas] = createContext(newSize, "2d");
  context.drawImage(sourceCanvas, 0, 0, newSize.width, newSize.height);
  return transformedCanvas;
};

const createSdfInternal = (
  source: InputImage,
  options: SdfOptions,
): HTMLCanvasElement => {
  const size = {
    width: source.metadata.width * options.upResFactor,
    height: source.metadata.height * options.upResFactor,
  };
  const [gl, canvas] = createContext(size, "webgl2");

  const buildShader = (type: GLenum, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`Failed to create shader of type ${type}`);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const succeess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (succeess) return shader;

    const errorLog = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);
    throw new Error(`Failed to create "${type}" type shader \n${errorLog}`);
  };

  const buildProgram = (shaders: WebGLShader[]) => {
    const program = gl.createProgram();
    if (!program) throw new Error(`Unable to build program`);
    shaders.forEach((shader) => gl.attachShader(program, shader));

    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    const errorLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Failed to create program \n${errorLog}`);
  };

  const createBoundBuffer = (source: BufferSource): WebGLBuffer => {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error(`Unable to create buffer`);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW);
    return buffer;
  };

  const applyFloatBuffer = (
    attributeLocation: number,
    buffer: WebGLBuffer,
    dimensions: VecDimension,
  ) => {
    gl.enableVertexAttribArray(attributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      attributeLocation,
      dimensions,
      gl.FLOAT,
      false,
      0,
      0,
    );
  };

  const createTexture = (image: HTMLImageElement) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  };

  const getRectangle = ({ width, height }: Size) => {
    const x1 = 0;
    const x2 = 0 + width;
    const y1 = 0;
    const y2 = 0 + height;
    // prettier-ignore
    return [
      // First Triangle
      x1, y1,
      x2, y1,
      x1, y2,
      // Second Triangle
      x1, y2,
      x2, y1,
      x2, y2
    ];
  };

  const program = buildProgram([
    buildShader(gl.VERTEX_SHADER, vertexShader),
    buildShader(gl.FRAGMENT_SHADER, fragmentShader),
  ]);
  const texCoordLocation = gl.getAttribLocation(program, "i_texCoord");

  // Create a buffer to put three 2d clip space points in
  const texCoordBuffer = createBoundBuffer(
    new Float32Array(getRectangle({ width: 1, height: 1 })),
  );

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, size.width, size.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  createTexture(source.image);

  applyFloatBuffer(texCoordLocation, texCoordBuffer, 2);

  gl.uniform2f(
    gl.getUniformLocation(program, "u_resolution"),
    size.width,
    size.height,
  );

  gl.uniform1i(gl.getUniformLocation(program, "u_spread"), options.spread);

  gl.uniform1f(
    gl.getUniformLocation(program, "u_outputBias"),
    options.bias / 256,
  );
  gl.uniform1f(
    gl.getUniformLocation(program, "u_inputThreshold"),
    options.alphaThreshold / 256,
  );

  gl.uniform4f(
    gl.getUniformLocation(program, "u_inColor"),
    ...colorAs4f(options.inColor),
  );
  gl.uniform4f(
    gl.getUniformLocation(program, "u_outColor"),
    ...colorAs4f(options.outColor),
  );

  gl.drawArrays(gl.TRIANGLES, 0, 3 * 2);

  return downRes(canvas, options.upResFactor);
};
