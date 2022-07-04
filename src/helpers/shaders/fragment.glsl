
precision mediump float;
 
uniform sampler2D u_image;
 
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
uniform vec2 u_resolution;

const int l_spread = 20;


const float l_maxDist = float(l_spread);
const float l_maxDistSq = pow(l_maxDist, 2.0);


void main() {
  vec2 l_onePixel = vec2(1.0, 1.0) / u_resolution;  

  bool l_startWithin = texture2D(u_image, v_texCoord).a >= 0.5;
   
  float l_minDistSq = float(l_maxDistSq);

  
  for (int l_xOffset = -l_spread; l_xOffset <= l_spread; l_xOffset++) {
    for (int l_yOffset = -l_spread; l_yOffset <= l_spread; l_yOffset++) {
      vec2 l_pixelOffset = vec2(l_xOffset, l_yOffset);
      vec2 l_pos = v_texCoord + (l_pixelOffset * l_onePixel);
      bool l_within = texture2D(u_image, l_pos).a >= 0.5;
      
      // Matching bit, no use
      if (l_within == l_startWithin) { continue; }
      
      
      float l_distSq = pow(l_pixelOffset.x, 2.0) + pow(l_pixelOffset.y, 2.0);
      l_minDistSq = min(l_minDistSq, l_distSq);
    }
  }

  float l_withinMultiplier = l_startWithin ? 1.0 : -1.0;
  float l_intensity = 0.5 + l_withinMultiplier * (pow(l_minDistSq, 0.5) / float(l_spread));
  gl_FragColor = vec4(l_intensity, l_intensity, l_intensity, 1.0);
}