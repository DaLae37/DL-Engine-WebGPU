import { Matrix4, Vector3, Vector4 } from "./Tool.js"

export class Camera {
    constructor(isMainCamera = False) {
        this.mainCamera = isMainCamera;

        this.eye = new Vector3();
        this.at = new Vector3();
        this.up = new Vector3();

        this.matrix = new Matrix4();

        this.forward = new Vector4();
        this.right = new Vector4();

        this.fieldOfView = 0;
    }

    Update(deltaTime) {
        let zAxis = Vector3.normalize(Vector3.subtract(eye, target));
        let xAxis = Vector3.normalize(Vector3.cross(up, zAxis));
        let yAxis = Vector3.normalize(Vector3.cross(zAxis, xAxis));

        this.matrix[0][0] = xAxis;
        this.matrix[0][1] = xAxis;
        this.matrix[0][2] = xAxis;
        this.matrix[0][3] = 0;

        this.matrix[1][0] = yAxis;
        this.matrix[1][1] = yAxis;
        this.matrix[1][2] = yAxis;
        this.matrix[1][3] = 0;

        this.matrix[2][0] = zAxis;
        this.matrix[2][1] = zAxis;
        this.matrix[2][2] = zAxis;
        this.matrix[2][3] = 0;

        this.matrix[3][0] = this.eye.x;
        this.matrix[3][1] = this.eye.y;
        this.matrix[3][2] = this.eye.z;
        this.matrix[3][3] = 1;
    }

    look(target, up) {
        Matrix4.inverse(this.matrix)
    }

    projection(width, height, depth) {
        return this.orthographic(width, 0, height, 0, depth, -depth);
    }

    perspective(radianFOV, aspect, zNear, zFar) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));
        matrix[0][0] = cos;
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = cos;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = 1;
        matrix[2][3] = -1;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
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