#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform int u_spread;
uniform vec4 u_inColor;
uniform vec4 u_outColor;

in vec2 t_texCoord;

out vec4 o_outputColor;

void main() {
  o_outputColor = texture(u_image, t_texCoord);
}