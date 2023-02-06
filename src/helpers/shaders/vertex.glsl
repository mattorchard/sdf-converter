#version 300 es
precision mediump float;

in vec2 i_texCoord;
out vec2 t_texCoord;

void main() {
  // Convert tex coord space (0->1) to clip space (-1->1), with Y flipped
  vec2 clipSpace = ((i_texCoord * 2.0) - 1.0) * vec2(1, -1);

  gl_Position = vec4(clipSpace, 0, 1);
  t_texCoord = i_texCoord;
}