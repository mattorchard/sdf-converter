#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
// the texCoords passed in from the vertex shader.
in vec2 t_texCoord;


const int spread = 20;
const float maxDist = float(spread);
const float maxDistSq = pow(maxDist, 2.0);

out vec4 o_outputColor;

void main() {
  vec2 onePixel = vec2(1.0, 1.0) / u_resolution;  

  bool startWithin = texture(u_image, t_texCoord).a >= 0.5;
   
  float minDistSq = float(maxDistSq);

  
  for (int xOffset = -spread; xOffset <= spread; xOffset++) {
    for (int yOffset = -spread; yOffset <= spread; yOffset++) {
      vec2 pixelOffset = vec2(xOffset, yOffset);
      vec2 pos = t_texCoord + (pixelOffset * onePixel);
      bool within = texture(u_image, pos).a >= 0.5;

      // Matching bit, no use
      if (within == startWithin) { continue; }

      float distSq = pow(pixelOffset.x, 2.0) + pow(pixelOffset.y, 2.0);
      minDistSq = min(minDistSq, distSq);
    }
  }

  float withinMultiplier = startWithin ? 1.0 : -1.0;
  float intensity = 0.5 + withinMultiplier * (pow(minDistSq, 0.5) / float(spread));
  o_outputColor = vec4(intensity, intensity, intensity, 1.0);
}