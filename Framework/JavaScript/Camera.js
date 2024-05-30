import { Matrix4, Vector3, Vector4 } from "./Tool.js"
import { canvas } from "./Core.js"

export class Camera {
    constructor() {
        this.position = new Vector3();

        this.cameraMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();

        this.right = new Vector3();
        this.forward = new Vector3();

        this.eye = new Vector3(0, 1, -5);
        this.at = new Vector3(0, 1, 0);
        this.up = new Vector3(0, 1, 0);

        this.fieldOfView = 0;
        this.pitch = 0;
        this.yaw = 0;
    }

    Update(deltaTime) {
        this.projectionMatrix = this.perspective(this.fieldOfView, canvas.WIDTH / canvas.HEIGHT, 1, 1000);
        this.viewMatrix = Matrix4.inverse(this.look(this.eye, this.at, this.up));
        this.cameraMatrix = Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
    }

    getCameraMatrix(){
        return this.cameraMatrix;
    }

    look(eye, target, up) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        let zAxis = Vector3.normalize(Vector3.subtract(eye, target));
        let xAxis = Vector3.normalize(Vector3.cross(up, zAxis));
        let yAxis = Vector3.normalize(Vector3.cross(zAxis, xAxis));

        matrix[0][0] = xAxis.x;
        matrix[0][1] = xAxis.y;
        matrix[0][2] = xAxis.z;
        matrix[0][3] = 0;

        matrix[1][0] = yAxis.x;
        matrix[1][1] = yAxis.y;
        matrix[1][2] = yAxis.z;
        matrix[1][3] = 0;

        matrix[2][0] = zAxis.x;
        matrix[2][1] = zAxis.y;
        matrix[2][2] = zAxis.z;
        matrix[2][3] = 0;

        matrix[3][0] = eye.x;
        matrix[3][1] = eye.y;
        matrix[3][2] = eye.z;
        matrix[3][3] = 1;

        return matrix
    }

    projection(width, height, depth) {
        return this.orthographic(width, 0, height, 0, depth, -depth);
    }

    perspective(radianFOV, aspect, zNear, zFar) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));
        matrix[0][0] = radianFOV / aspect;
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = radianFOV;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = zFar * (1 / (zNear - zFar));
        matrix[2][3] = -1;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = zNear * zFar * (1 / (zNear - zFar));
        matrix[3][3] = 0;

        return matrix;
    }

    orthographic(right, left, top, bottom, far, near) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        matrix[0][0] = 2 / (right - left);
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = - (right + left) / (right - left);

        matrix[1][0] = 0;
        matrix[1][1] = 2 / (top - bottom);
        matrix[1][2] = 0;
        matrix[1][3] = - (top + bottom) / (top - bottom);

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = 1 / (far - near);
        matrix[2][3] = - near / (far - near);

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 1;

        return matrix
    }
}