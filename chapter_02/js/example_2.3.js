function main() {
    var canvas = document.getElementById("canvas");
    if (!canvas) {
        console.log("fail to get canvas element");
    }

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("fail to get the rendering context for WebGl");
    }
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}