const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;
  
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  
  varying highp vec2 vTextureCoord;
  
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying highp vec2 vTextureCoord;
  uniform vec4 uColor;
  
  void main(void) {
    float distance = length(vTextureCoord - vec2(0.5, 0.5));
    if (distance < 0.5) {
      gl_FragColor = uColor;
    } else {
      discard;
    }
  }
`;