export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    inner(a, b) {

    }

    cross(a, b) {
        let x = a.y * b.z - a.z * b.y;
        let y = a.z * b.x - a.x * b.z;
        let z = a.x * b.y - a.y * b.x;

        return new Vector3(x, y, z);
    }

    add(a, b) {
        let x = a.x + b.x;
        let y = a.y + b.y;
        let z = a.z + b.z;

        return new Vector3(x, y, z);
    }

    subtract(a, b) {
        let x = a.x - b.x;
        let y = a.y - b.y;
        let z = a.z - b.z;

        return new Vector3(x, y, z);
    }

    normalize(a) {
        let x = 0, y = 0, z = 0;
        let length = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        if (length > 0.000001) {
            x = a.x / length;
            y = a.y / length;
            z = a.z / length;
        }

        return new Vector3(x, y, z);
    }
}

export class Vector4 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

export class Matrix4 {
    projection(){

    }

    multiply(){

    }

    inverse(){

    }
}

export class Transform {
    constructor() {
        this.position = new Vector3();
        this.scale = new Vector3();
        this.rotation = new Vector3();
    }
}