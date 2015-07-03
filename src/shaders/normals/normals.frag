/* Phong per-frag shader */

precision mediump float;

uniform vec4 u_matAmb;
uniform vec4 u_matDif;
uniform vec4 u_matSpec;

const float shininess = 100.0;

vec4 lightPosition = vec4(0.0, 2.0, -3.0, 0.0);
vec4 lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
vec4 lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
vec4 lightSpecular = vec4(0.8, 0.9, 0.8, 1.0);

varying vec4 v_Normal;
varying vec4 v_Position;

void main ()
{
  vec4 L = normalize(lightPosition - v_Position);
  vec4 V = normalize(v_Position);
  vec4 H = normalize(L + V);

  float Kd = max(dot(v_Normal,L), 0.0);
  float Ks = pow(max(dot(v_Normal,H), 0.0), shininess);

  vec4 diffuse = Kd * lightDiffuse * u_matDif;
  vec4 specular = Ks * lightSpecular * u_matSpec;
  vec4 ambient = lightAmbient * u_matAmb;

  gl_FragColor = vec4(ambient + diffuse + specular);
}

