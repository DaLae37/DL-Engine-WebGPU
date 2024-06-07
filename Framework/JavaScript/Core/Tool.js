export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static inner(a, b) {
        let x = a.x * b.x;
        let y = a.y * b.y;

        return new Vector2(x, y);
    }

    static cross(a, b) {
        let value = a.x * b.y - a.y * b.x;

        return value;
    }

    static add(a, b) {
        let x = a.x + b.x;
        let y = a.y + b.y;

        return new Vector2(x, y);
    }

    static subtract(a, b) {
        let x = a.x - b.x;
        let y = a.y - b.y;

        return new Vector2(x, y);
    }

    static normalize(vector2) {
        let x = 0, y = 0, z = 0;
        let length = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
        if (length > 0.000001) {
            x = vector2.x / length;
            y = vector2.y / length;
        }

        return new Vector2(x, y);
    }
}

export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static inner(a, b) {
        let x = a.x * b.x;
        let y = a.y * b.y;
        let z = a.z * b.z;

        return new Vector3(x, y, z);
    }

    static cross(a, b) {
        let x = a.y * b.z - a.z * b.y;
        let y = a.z * b.x - a.x * b.z;
        let z = a.x * b.y - a.y * b.x;

        return new Vector3(x, y, z);
    }

    static add(a, b) {
        let x = a.x + b.x;
        let y = a.y + b.y;
        let z = a.z + b.z;

        return new Vector3(x, y, z);
    }

    static subtract(a, b) {
        let x = a.x - b.x;
        let y = a.y - b.y;
        let z = a.z - b.z;

        return new Vector3(x, y, z);
    }

    static normalize(vector3) {
        let x = 0, y = 0, z = 0;
        let length = Math.sqrt(vector3.x * vector3.x + vector3.y * vector3.y + vector3.z * vector3.z);
        if (length > 0.000001) {
            x = vector3.x / length;
            y = vector3.y / length;
            z = vector3.z / length;
        }

        return new Vector3(x, y, z);
    }

    static Vec4toVec3(a){
        new Vector3(a.x, a.y, a.z);
    }

    static ArraytoVec3(a){
        return new Vector3(a[0], a[1], a[2]);
    }
}

export class Vector4 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static Vec3toVec4(a){
        new Vector4(a.x, a.y, a.z, 0);
    }
}

export class Matrix3 {
    constructor() {
        this.matrix = Array.from(Array(3), () => new Float32Array(3).fill(0));
    }

    static Mat4toMat3(a) {
        let matrix = Array.from(Array(3), () => new Float32Array(3).fill(0));

        matrix[0][0] = a[0][0];
        matrix[0][1] = a[0][1];
        matrix[0][2] = a[0][2];

        matrix[1][0] = a[1][0];
        matrix[1][1] = a[1][1];
        matrix[1][2] = a[1][2];

        matrix[2][0] = a[2][0];
        matrix[2][1] = a[2][1];
        matrix[2][2] = a[2][2];

        return matrix
    }
}

export class Matrix4 {
    constructor() {
        this.matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));
    }

    static identity() {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        matrix[0][0] = 1;
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = 1;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = 1;
        matrix[2][3] = 0;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 1;

        return matrix;
    }

    static Mat3toMat4(a) {
        let matrix = new Matrix4();
        matrix[0][0] = a[0][0];
        matrix[0][1] = a[0][1];
        matrix[0][2] = a[0][2];
        matrix[0][3] = 0;

        matrix[1][0] = a[1][0];
        matrix[1][1] = a[1][1];
        matrix[1][2] = a[1][2];
        matrix[1][3] = 0;

        matrix[2][0] = a[2][0];
        matrix[2][1] = a[2][1];
        matrix[2][2] = a[2][2];
        matrix[2][3] = 0;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 0;

        return matrix;
    }

    static Mat4toFloat32Array(a) {
        let array = new Float32Array(16);
        
        array[0] = a[0][0];
        array[1] = a[0][1];
        array[2] = a[0][2];
        array[3] = a[0][3];

        array[4] = a[1][0];
        array[5] = a[1][1];
        array[6] = a[1][2];
        array[7] = a[1][3];

        array[8] = a[2][0];
        array[9] = a[2][1];
        array[10] = a[2][2];
        array[11] = a[2][3];

        array[12] = a[3][0];
        array[13] = a[3][1];
        array[14] = a[3][2];
        array[15] = a[3][3];

        return array;
    }

    static transpose(a) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));
        matrix[0][0] = a[0][0];
        matrix[0][1] = a[1][0];
        matrix[0][2] = a[2][0];
        matrix[0][3] = a[3][0];

        matrix[1][0] = a[0][1];
        matrix[1][1] = a[1][1];
        matrix[1][2] = a[2][1];
        matrix[1][3] = a[3][1];

        matrix[2][0] = a[0][2];
        matrix[2][1] = a[1][2];
        matrix[2][2] = a[2][2];
        matrix[2][3] = a[3][2];

        matrix[3][0] = a[0][3];
        matrix[3][1] = a[1][3];
        matrix[3][2] = a[2][3];
        matrix[3][3] = a[3][3];


        return matrix;
    }

    static multiply(a, b) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    matrix[i][j] += a[i][k] * b[k][j];
                }
            }
        }

        return matrix;
    }

    static inverse(matrix) {
        let inverseMatrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        inverseMatrix[0][0] = matrix[1][1] * matrix[2][2] * matrix[3][3] -
            matrix[1][1] * matrix[2][3] * matrix[3][2] -
            matrix[2][1] * matrix[1][2] * matrix[3][3] +
            matrix[2][1] * matrix[1][3] * matrix[3][2] +
            matrix[3][1] * matrix[1][2] * matrix[2][3] -
            matrix[3][1] * matrix[1][3] * matrix[2][2];

        inverseMatrix[0][1] = -matrix[0][1] * matrix[2][2] * matrix[3][3] +
            matrix[0][1] * matrix[2][3] * matrix[3][2] +
            matrix[2][1] * matrix[0][2] * matrix[3][3] -
            matrix[2][1] * matrix[0][3] * matrix[3][2] -
            matrix[3][1] * matrix[0][2] * matrix[2][3] +
            matrix[3][1] * matrix[0][3] * matrix[2][2];

        inverseMatrix[0][2] = matrix[0][1] * matrix[1][2] * matrix[3][3] -
            matrix[0][1] * matrix[1][3] * matrix[3][2] -
            matrix[1][1] * matrix[0][2] * matrix[3][3] +
            matrix[1][1] * matrix[0][3] * matrix[3][2] +
            matrix[3][1] * matrix[0][2] * matrix[1][3] -
            matrix[3][1] * matrix[0][3] * matrix[1][2];

        inverseMatrix[0][3] = -matrix[0][1] * matrix[1][2] * matrix[2][3] +
            matrix[0][1] * matrix[1][3] * matrix[2][2] +
            matrix[1][1] * matrix[0][2] * matrix[2][3] -
            matrix[1][1] * matrix[0][3] * matrix[2][2] -
            matrix[2][1] * matrix[0][2] * matrix[1][3] +
            matrix[2][1] * matrix[0][3] * matrix[1][2];

        inverseMatrix[1][0] = -matrix[1][0] * matrix[2][2] * matrix[3][3] +
            matrix[1][0] * matrix[2][3] * matrix[3][2] +
            matrix[2][0] * matrix[1][2] * matrix[3][3] -
            matrix[2][0] * matrix[1][3] * matrix[3][2] -
            matrix[3][0] * matrix[1][2] * matrix[2][3] +
            matrix[3][0] * matrix[1][3] * matrix[2][2];

        inverseMatrix[1][1] = matrix[0][0] * matrix[2][2] * matrix[3][3] -
            matrix[0][0] * matrix[2][3] * matrix[3][2] -
            matrix[2][0] * matrix[0][2] * matrix[3][3] +
            matrix[2][0] * matrix[0][3] * matrix[3][2] +
            matrix[3][0] * matrix[0][2] * matrix[2][3] -
            matrix[3][0] * matrix[0][3] * matrix[2][2];

        inverseMatrix[1][2] = -matrix[0][0] * matrix[1][2] * matrix[3][3] +
            matrix[0][0] * matrix[1][3] * matrix[3][2] +
            matrix[1][0] * matrix[0][2] * matrix[3][3] -
            matrix[1][0] * matrix[0][3] * matrix[3][2] -
            matrix[3][0] * matrix[0][2] * matrix[1][3] +
            matrix[3][0] * matrix[0][3] * matrix[1][2];

        inverseMatrix[1][3] = matrix[0][0] * matrix[1][2] * matrix[2][3] -
            matrix[0][0] * matrix[1][3] * matrix[2][2] -
            matrix[1][0] * matrix[0][2] * matrix[2][3] +
            matrix[1][0] * matrix[0][3] * matrix[2][2] +
            matrix[2][0] * matrix[0][2] * matrix[1][3] -
            matrix[2][0] * matrix[0][3] * matrix[1][2];

        inverseMatrix[2][0] = matrix[1][0] * matrix[2][1] * matrix[3][3] -
            matrix[1][0] * matrix[2][3] * matrix[3][1] -
            matrix[2][0] * matrix[1][1] * matrix[3][3] +
            matrix[2][0] * matrix[1][3] * matrix[3][1] +
            matrix[3][0] * matrix[1][1] * matrix[2][3] -
            matrix[3][0] * matrix[1][3] * matrix[2][1];

        inverseMatrix[2][1] = -matrix[0][0] * matrix[2][1] * matrix[3][3] +
            matrix[0][0] * matrix[2][3] * matrix[3][1] +
            matrix[2][0] * matrix[0][1] * matrix[3][3] -
            matrix[2][0] * matrix[0][3] * matrix[3][1] -
            matrix[3][0] * matrix[0][1] * matrix[2][3] +
            matrix[3][0] * matrix[0][3] * matrix[2][1];

        inverseMatrix[2][2] = matrix[0][0] * matrix[1][1] * matrix[3][3] -
            matrix[0][0] * matrix[1][3] * matrix[3][1] -
            matrix[1][0] * matrix[0][1] * matrix[3][3] +
            matrix[1][0] * matrix[0][3] * matrix[3][1] +
            matrix[3][0] * matrix[0][1] * matrix[1][3] -
            matrix[3][0] * matrix[0][3] * matrix[1][1];

        inverseMatrix[2][3] = -matrix[0][0] * matrix[1][1] * matrix[2][3] +
            matrix[0][0] * matrix[1][3] * matrix[2][1] +
            matrix[1][0] * matrix[0][1] * matrix[2][3] -
            matrix[1][0] * matrix[0][3] * matrix[2][1] -
            matrix[2][0] * matrix[0][1] * matrix[1][3] +
            matrix[2][0] * matrix[0][3] * matrix[1][1];

        inverseMatrix[3][0] = -matrix[1][0] * matrix[2][1] * matrix[3][2] +
            matrix[1][0] * matrix[2][2] * matrix[3][1] +
            matrix[2][0] * matrix[1][1] * matrix[3][2] -
            matrix[2][0] * matrix[1][2] * matrix[3][1] -
            matrix[3][0] * matrix[1][1] * matrix[2][2] +
            matrix[3][0] * matrix[1][2] * matrix[2][1];

        inverseMatrix[3][1] = matrix[0][0] * matrix[2][1] * matrix[3][2] -
            matrix[0][0] * matrix[2][2] * matrix[3][1] -
            matrix[2][0] * matrix[0][1] * matrix[3][2] +
            matrix[2][0] * matrix[0][2] * matrix[3][1] +
            matrix[3][0] * matrix[0][1] * matrix[2][2] -
            matrix[3][0] * matrix[0][2] * matrix[2][1];

        inverseMatrix[3][2] = -matrix[0][0] * matrix[1][1] * matrix[3][2] +
            matrix[0][0] * matrix[1][2] * matrix[3][1] +
            matrix[1][0] * matrix[0][1] * matrix[3][2] -
            matrix[1][0] * matrix[0][2] * matrix[3][1] -
            matrix[3][0] * matrix[0][1] * matrix[1][2] +
            matrix[3][0] * matrix[0][2] * matrix[1][1];

        inverseMatrix[3][3] = matrix[0][0] * matrix[1][1] * matrix[2][2] -
            matrix[0][0] * matrix[1][2] * matrix[2][1] -
            matrix[1][0] * matrix[0][1] * matrix[2][2] +
            matrix[1][0] * matrix[0][2] * matrix[2][1] +
            matrix[2][0] * matrix[0][1] * matrix[1][2] -
            matrix[2][0] * matrix[0][2] * matrix[1][1];

        let determinant = matrix[0][0] * inverseMatrix[0][0] + matrix[0][1] * inverseMatrix[1][0] + matrix[0][2] * inverseMatrix[2][0] + matrix[0][3] * inverseMatrix[3][0];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                inverseMatrix[i][j] = inverseMatrix[i][j] * (1 / determinant);
            }
        }
        return inverseMatrix;
    }

    static translation(offset) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        matrix[0][0] = 1;
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = 1;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = 1;
        matrix[2][3] = 0;

        matrix[3][0] = offset.x;
        matrix[3][1] = offset.y;
        matrix[3][2] = offset.z;
        matrix[3][3] = 1;

        return matrix;
    }

    static scaling(scale) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        matrix[0][0] = scale.x;
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = scale.y;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = scale.z;
        matrix[2][3] = 0;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 1;

        return matrix;
    }

    static rotationX(radian) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        let cos = Math.cos(radian);
        let sin = Math.sin(radian);

        matrix[0][0] = 1;
        matrix[0][1] = 0;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = cos;
        matrix[1][2] = -sin;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = sin;
        matrix[2][2] = cos;
        matrix[2][3] = 0;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 1;

        return matrix;
    }

    static rotationY(radian) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        let cos = Math.cos(radian);
        let sin = Math.sin(radian);

        matrix[0][0] = cos;
        matrix[0][1] = 0;
        matrix[0][2] = sin;
        matrix[0][3] = 0;

        matrix[1][0] = 0;
        matrix[1][1] = 1;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = -sin;
        matrix[2][1] = 0;
        matrix[2][2] = cos;
        matrix[2][3] = 0;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 1;

        return matrix;
    }

    static rotationZ(radian) {
        let matrix = Array.from(Array(4), () => new Float32Array(4).fill(0));

        let cos = Math.cos(radian);
        let sin = Math.sin(radian);

        matrix[0][0] = cos;
        matrix[0][1] = -sin;
        matrix[0][2] = 0;
        matrix[0][3] = 0;

        matrix[1][0] = sin;
        matrix[1][1] = cos;
        matrix[1][2] = 0;
        matrix[1][3] = 0;

        matrix[2][0] = 0;
        matrix[2][1] = 0;
        matrix[2][2] = 1;
        matrix[2][3] = 0;

        matrix[3][0] = 0;
        matrix[3][1] = 0;
        matrix[3][2] = 0;
        matrix[3][3] = 1;

        return matrix;
    }
}

export class Transform {
    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = new Vector3(0, 0, 0);
    }

    static degreeTOradian(degree) {
        let radian = degree * (Math.PI / 180);
        return radian;
    }

    static translate(matrix, offset) { //offset : Vector3
        return Matrix4.multiply(matrix, Matrix4.translation(offset));
    }

    static scale(matrix, scale) { //scale : Vector3
        return Matrix4.multiply(matrix, Matrix4.scaling(scale));
    }

    static rotate(matrix, radians) { //radians : Vector3
        let x = Matrix4.multiply(matrix, Matrix4.rotationX(radians.x));
        let y = Matrix4.multiply(x, Matrix4.rotationY(radians.y));
        let z = Matrix4.multiply(y, Matrix4.rotationZ(radians.z));

        return z;
    }
}

class Color {
    constructor() {
        this.colorDictionary = {} //Dictionary
        this.colorDictionary["white"] = [1, 1, 1, 1];
        this.colorDictionary["black"] = [0, 0, 0, 1];
        this.colorDictionary["red"] = [1, 0, 0, 1];
        this.colorDictionary["green"] = [0, 1, 0, 1];
        this.colorDictionary["blue"] = [0, 0, 1, 1];
    }

    GetColorName(colorCode) {
        return Object.keys(this.colorDictionary).filter(key => this.colorDictionary[key] === colorCode).toString();
    }

    GetColorCode(colorName) {
        return this.colorDictionary[colorName];
    }
}

export const color = new Color();