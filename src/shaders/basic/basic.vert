attribute vec4 a_Position;
attribute vec4 a_Color;

// model view projection matrix
uniform mat4 u_Mvp;
varying vec4 v_Color;

void main()
{
  gl_Position = u_Mvp * a_Position;
  gl_PointSize = 3.0;

  v_Color = a_Color;
}
