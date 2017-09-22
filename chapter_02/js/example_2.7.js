var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = a_PointSize;\n' +
    '}';

var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0, 0, 1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById("canvas");

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("failed to initialize shaders");
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_Position < 0 || a_PointSize < 0) {
        console.log("failed to get the storage location of a_Position or a_PointSize");
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 5.0);

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position);
    };
    gl.vertexAttrib3f(a_Position, 0.0, 0.2, 0.0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];

function click(ev, gl, canvas, a_Position) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var x = ev.clientX;
    var y = ev.clientY;
    var client = ev.target.getBoundingClientRect();

    x = ((x - client.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - client.top)) / (canvas.height / 2);

    g_points.push(x);
    g_points.push(y);

    for (var i = 0; i < g_points.length; i += 2) {
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}