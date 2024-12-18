// Vertex Shader
export const vs = `
  attribute vec4 a_position;
  attribute vec3 a_normal;
  attribute vec2 a_texcoord;

  uniform mat4 u_world;
  uniform mat4 u_view;
  uniform mat4 u_projection;
  uniform vec3 u_viewWorldPosition;

  varying vec3 v_normal;
  varying vec2 v_texcoord;
  varying vec3 v_surfaceToView;

  void main() {
    gl_Position = u_projection * u_view * u_world * a_position;

    vec3 surfaceWorldPosition = (u_world * a_position).xyz;
    v_normal = mat3(u_world) * a_normal;
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
    v_texcoord = a_texcoord;
  }
`;

// Fragment Shader
export const fs = `
  precision highp float;

  varying vec3 v_normal;
  varying vec2 v_texcoord;
  varying vec3 v_surfaceToView;

  uniform sampler2D u_texture;
  uniform vec3 u_lightDirection;
  uniform vec3 diffuse;
  uniform vec3 ambient;
  uniform vec3 specular;
  uniform float shininess;
  uniform vec3 u_ambientLight;

  void main() {
    vec3 normal = normalize(v_normal);
    vec3 surfaceToLight = normalize(-u_lightDirection);
    vec3 surfaceToView = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLight + surfaceToView);

    float light = max(dot(normal, surfaceToLight), 0.0);
    float specularLight = pow(max(dot(normal, halfVector), 0.0), shininess);

    vec3 texColor = texture2D(u_texture, v_texcoord).rgb;
    vec3 totalLight = ambient * u_ambientLight + diffuse * light + specular * specularLight;

    vec2 scaledTexcoord = v_texcoord * vec2(1.0, 1.0); // Sesuaikan faktor skala
    gl_FragColor = texture2D(u_texture, scaledTexcoord);

  }
`;
