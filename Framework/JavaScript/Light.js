import { Vector4 } from "./Tool";

class Light {
    constructor(lightName, lightType) {
        this.lightName = lightName;
        this.lightType = lightType;
        this.position = new Vector4();
        this.color = new Vector4();
    }

    GetLightData(){
        return this.lightType();
    }

    setPosition(position) {
        this.position = position;
    }

    setColor(color) {
        this.color = color;
    }

    getPosition() {
        return this.position
    }

    getColor() {
        return this.color;
    }
}

class DirectionalLight extends Light {
    constructor(lightName = "null") {
        super(lightName, 0);

        this.lightDirection = new Vector4();
    }

    SetLightDirection(lightDirection){
        this.lightDirection = lightDirection;
    }

    GetLightData(){
        return [super.GetLightData(), [this.lightDirection]];
    }
}

class PointLight extends Light {
    constructor(lightName = "null") {
        super(lightName, 1);
    }
}

class SpotLight extends Light {
    constructor(lightName = "null") {
        super(lightName, 2);
    }
}