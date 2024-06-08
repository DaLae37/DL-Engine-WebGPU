import { Matrix4, Transform, Vector3 } from "../Core/Tool.js"
import { canvas } from "../Core/Core.js"

export class Camera {
    constructor() {
        this.projectionMatrix = Matrix4.identity();
        this.matrix = Matrix4.identity();
        this.viewMatrix = Matrix4.identity();
        this.cameraMatrix = Matrix4.identity();
        this.rotationMatrix = Matrix4.identity();

        this.right = new Vector3();
        this.forward = new Vector3();

        this.eye = new Vector3(0, 0, 10);
        this.at = new Vector3(0, 0, 0);
        this.up = new Vector3(0, 1, 0);

        this.fieldOfView = Transform.degreeToRadian(90);
        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;
    }

    Update(deltaTime) {
        this.rotationMatrix = Transform.rotate(this.rotationMatrix, new Vector3(this.pitch, this.yaw, this.roll));
        this.projectionMatrix = this.perspective(this.fieldOfView, canvas.getCanvas().clientWidth / canvas.getCanvas().clientHeight, 1, 100);

        this.matrix = this.look(this.eye, this.at, this.up);
        this.viewMatrix = Matrix4.inverse(this.matrix);

        this.cameraMatrix = Matrix4.multiply(this.viewMatrix, this.projectionMatrix);
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

        radianFOV = Math.tan(Math.PI * 0.5 - 0.5 * radianFOV);

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

    SetFeildOfView(degree){
        this.fieldOfView = Transform.degreeToRadian(degree);
    }

    SetPosition(position){
        this.eye = position;
    }

    SetRotation(rotation){
        
    }

    Translate(offset){
        this.eye = Vector3.add(this.eye, offset);
        this.at = Vector3.add(this.at, offset);
    }

    Rotate(degeres){
        this.at = Vector3.add(this.at, degeres);
    }
} 