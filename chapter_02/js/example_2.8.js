var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = a_PointSize;\n' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' +
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

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (! u_FragColor) {
        console.log("failed to get the storage location of u_FragColor");
        return;
    }

    gl.vertexAttrib1f(a_PointSize, 5.0);

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    };
    gl.vertexAttrib3f(a_Position, 0.0, 0.2, 0.0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];
var RED = [1.0, 0, 0, 1];
var GREEN = [0, 1.0, 0, 1];
var BLUE = [0, 0, 1.0, 1];
var WHITE = [1.0, 1.0, 1.0, 1];

function click(ev, gl, canvas, a_Position, u_FragColor) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var x = ev.clientX;
    var y = ev.clientY;
    var client = ev.target.getBoundingClientRect();

    x = ((x - client.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - client.top)) / (canvas.height / 2);
    g_points.push([x, y]);

    if (x > 0 && y > 0) {
        g_colors.push(RED)
    } else if (x < 0 && y > 0) {
        g_colors.push(GREEN);
    } else if (x < 0 && y < 0) {
        g_colors.push(BLUE);
    } else {
        g_colors.push(WHITE);
    }

    for (var i = 0; i < g_points.length; i += 1) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}