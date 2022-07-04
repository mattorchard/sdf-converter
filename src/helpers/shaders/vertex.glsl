#version 300 es
precision mediump float;

in vec2 i_position;
in vec2 i_texCoord;
uniform vec2 u_resolution;

out vec2 t_texCoord;

// all shaders have a main function
void main() {

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = i_position / u_resolution;

  // convert from 0->1 to -1->+1 (clip space)
  vec2 clipSpace = (zeroToOne * 2.0) - 1.0;

  // Outputs
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  t_texCoord = i_texCoord;
}