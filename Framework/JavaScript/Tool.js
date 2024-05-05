export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class Transform {
    constructor(){
        this.position = new Vector3();
        this.scale = new Vector3();
        this.rotation = new Vector3();
    }
}