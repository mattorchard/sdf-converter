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
  float maxDistance = float(u_spread);
  float maxDistanceSquared = pow(maxDistance, 2.0);

  bool isStartWithinShape = texture(u_image, t_texCoord).a >= 0.5; 

  float minDistanceSquared = float(maxDistanceSquared);
  for (int xOffset = -u_spread; xOffset <= u_spread; xOffset++) {
    for (int yOffset = -u_spread; yOffset <= u_spread; yOffset++) {
      vec2 pixelOffset = vec2(xOffset, yOffset);
      vec2 searchPosition = t_texCoord + (pixelOffset / u_resolution);
      bool isWithinShape = texture(u_image, searchPosition).a >= 0.5;

      // Not an edge, so can be ignored
      if (isWithinShape == isStartWithinShape) { continue; }

      float distanceSquared = pow(pixelOffset.x, 2.0) + pow(pixelOffset.y, 2.0);
      minDistanceSquared = min(minDistanceSquared, distanceSquared);
    }
  }

  float distanceRatio = (pow(minDistanceSquared, 0.5) / float(u_spread));
  float withinPolarity = isStartWithinShape ? 1.0 : -1.0;
  float intensity = 0.5 + withinPolarity * distanceRatio;
  o_outputColor = mix(u_outColor, u_inColor, intensity);
}