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

var ANGLE_STEP = 45;
var LAST_TIME = Date.now();

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

    gl.clearColor(0, 0, 0, 1);

    var modelMatrix = new Matrix4();
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var current_angle = 0;

    var tick = function () {
        current_angle = animate(current_angle);
        draw(gl, n, current_angle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick)
    };

    tick();
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

function animate(angle) {
    var now = Date.now();
    var elapsed = now - LAST_TIME;
    LAST_TIME = now;
    var new_angle = angle + (elapsed * ANGLE_STEP) / 1000;
    new_angle %= 360;
    return new_angle;
}

function draw(gl, n, current_angle, modelMatrix, u_modelMatrix) {
    modelMatrix.setRotate(current_angle, 0, 0, 1);
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}