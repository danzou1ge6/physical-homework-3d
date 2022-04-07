import { generationConstants } from "../constants.js";
import { Vector3d } from './linalg.js'

function randomNumber(min, max) {
    let rand = Math.random();
    return min + rand * (max - min);
}

function randomUnitVector3d() {
    let pitch = randomNumber(-Math.PI, Math.PI)
    let yaw = randomNumber(0, 2 * Math.PI)
    return new Vector3d([
        Math.cos(pitch) * Math.cos(yaw),
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(pitch)
    ])
}


class RandomParamGenerator {
    constructor(setting) {
        this.setting = setting
    }
    
    randomPosition() {
        let radius = randomNumber(
            this.setting.minObjRadius,
            this.setting.minObjRadius)
        return randomUnitVector3d().scale(radius)
    }

    // params:
    //     r: Vector3d
    //     gracityConstant: Number
    randomVelocity(r) {
        let m = randomUnitVector3d()
        let n = m.cross(r).normalized()
        let a = randomNumber(
            -this.setting.tanVelocityFromRadius,
            this.setting.tanVelocityFromRadius)
        let v = n.add(r.normalized().scale(a))

        return v.scale(randomNumber(
            this.setting.minSpeed,
            this.setting.maxSpeed))
    }

    randomParam() {
        let pos = this.randomPosition()
        let v = this.randomVelocity(pos)
        let dirX = randomUnitVector3d()
        let dirY = randomUnitVector3d().cross(dirX).normalized()
        return {
            initialPos: pos,
            initialVelocity: v,
            initialDirectionX: dirX,
            initialDirectionY: dirY,
            rotationAxis: randomUnitVector3d(),
            rotationAngularSpeed: randomNumber(
                this.setting.minRotationAngularSpeed,
                this.setting.maxRotationAngularSpeed
            ),
            objectWidth: this.setting.imgSize,
            objectHeight: this.setting.imgSize
        }
    }
}

function randomParam() {
    return new RandomParamGenerator(generationConstants)
            .randomParam()
}


export {randomParam, randomNumber, RandomParamGenerator}
