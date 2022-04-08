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
    constructor(setting, gravityConstant) {
        this.setting = setting
        this.gravityConstant = gravityConstant
    }
    
    randomPosition() {
        let radius = randomNumber(
            this.setting.minObjRadius,
            this.setting.maxObjRadius)
        let direction = randomUnitVector3d()

        // if Force in a Plane
        if(!(this.setting.planeNormalVector === null)){
            direction = direction.minus(
                this.setting.planeNormalVector.scale(
                    direction.dot(this.setting.planeNormalVector)
                )
            ).normalized()
        }
        return direction.scale(radius)
    }

    // params:
    //     r: Vector3d
    randomVelocity(r) {
        let m
        if(this.setting.planeNormalVector === null){
            m = randomUnitVector3d()
        }else{
            m = this.setting.planeNormalVector
        }

        // This way `n`⊥`r`
        let n = m.cross(r).normalized()
        let a = randomNumber(
            -this.setting.tanVelocityFromRadius,
            this.setting.tanVelocityFromRadius)
        let v = n.add(r.normalized().scale(a)).normalized()

        let circalSpeed = Math.sqrt(
            this.gravityConstant / r.norm()
        )

        return v.scale(randomNumber(
            circalSpeed * this.setting.minSpeedCoefficient,
            circalSpeed * this.setting.maxSpeedCoefficient))
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

function randomParam(gravityConstant) {
    return new RandomParamGenerator(generationConstants, gravityConstant)
            .randomParam()
}


export {randomParam, randomNumber, RandomParamGenerator}
