#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform int u_spread;
uniform vec4 u_inColor;
uniform vec4 u_outColor;

in vec2 t_texCoord;

out vec4 o_outputColor;

bool isWithinShape(vec2 position);
bool isWithinShape(vec2 position) {
  return texture(u_image, position).a >= 0.5;
}

void main() {
  bool isStartWithinShape = isWithinShape(t_texCoord);
  float maxDistanceSquared = pow(float(u_spread), 2.0);
  float minDistanceSquared = float(maxDistanceSquared);

  for (int xOffset = -u_spread; xOffset <= u_spread; xOffset++) {
    for (int yOffset = -u_spread; yOffset <= u_spread; yOffset++) {
      vec2 pixelOffset = vec2(xOffset, yOffset);
      vec2 searchPosition = t_texCoord + (pixelOffset / u_resolution);

      // Not an edge, so can be ignored
      if (isWithinShape(searchPosition) == isStartWithinShape) { continue; }

      float distanceSquared = pow(pixelOffset.x, 2.0) + pow(pixelOffset.y, 2.0);
      minDistanceSquared = min(minDistanceSquared, distanceSquared);
    }
  }

  float distanceRatio = (sqrt(minDistanceSquared) - 0.5) / float(u_spread);
  float withinPolarity = isStartWithinShape ? 1.0 : -1.0;
  float intensity = 0.5 + withinPolarity * distanceRatio;
  o_outputColor = mix(u_outColor, u_inColor, intensity);
}