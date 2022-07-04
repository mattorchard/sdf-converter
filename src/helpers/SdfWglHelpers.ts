// @ts-ignore
import vertexShader from "./shaders/vertex.glsl";
// @ts-ignore
import fragmentShader from "./shaders/fragment.glsl";

type VecDimension = 1 | 2 | 3 | 4;

interface Size {
  width: number;
  height: number;
}

function createContext(size: Size, type: "webgl2") {
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext(type);
  if (!context) throw new Error(`Unable to create canvas context`);
  return context;
}

interface SdfOptions {
  upResFactor: number;
  alphaThreshold: number;
}

export const createSdf = (
  source: HTMLImageElement,
  options: SdfOptions
): HTMLCanvasElement => {
  const size = {
    width: source.naturalWidth * options.upResFactor,
    height: source.naturalHeight * options.upResFactor,
  };
  const gl = createContext(size, "webgl2");

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
    dimensions: VecDimension
  ) => {
    gl.enableVertexAttribArray(attributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      attributeLocation,
      dimensions,
      gl.FLOAT,
      false,
      0,
      0
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
  const positionLocation = gl.getAttribLocation(program, "i_position");
  const texcoordLocation = gl.getAttribLocation(program, "i_texCoord");

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = createBoundBuffer(
    new Float32Array(getRectangle(size))
  );
  const texcoordBuffer = createBoundBuffer(
    // prettier-ignore
    new Float32Array([
      // First Triangle
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      // Second Triangle
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
    ])
  );

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, size.width, size.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  createTexture(source);

  applyFloatBuffer(positionLocation, positionBuffer, 2);
  applyFloatBuffer(texcoordLocation, texcoordBuffer, 2);

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionLocation, size.width, size.height);

  gl.drawArrays(gl.TRIANGLES, 0, 3 * 2);

  return gl.canvas;
};
