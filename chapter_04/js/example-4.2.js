var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}';

var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0, 0, 1.0);\n' +
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

    var n = initVertextBuffers(gl);
    if (n < 0) {
        console.log("failed to set the positions of the vertices");
        return;
    }

    var modelMatrix = new Matrix4();

    var ANGLE = 40;
    var TX = 0.3;
    modelMatrix.setRotate(ANGLE, 0, 0, 1);
    modelMatrix.translate(TX, 0, 0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertextBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    var n = 3;

    var vertextBuffer = gl.createBuffer();
    if (!vertextBuffer) {
        console.log("fail to create buffer object");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);
    return n;
}