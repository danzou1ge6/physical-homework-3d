import { minObjRadius, minSpeed, tanVelocityFromRadius,
         defaultGravityConstant, 
         minRotationAngularSpeed,
         maxRotationAngularSpeed} from "../constants.js";
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

function randomPosition() {
    let radius = randomNumber(minObjRadius, minObjRadius)
    return randomUnitVector3d().scale(radius)
}

// params:
//     r: Vector3d
//     gracityConstant: Number
function randomVelocity(r) {
    let m = randomUnitVector3d()
    let n = m.cross(r).normalized()
    let a = randomNumber(-tanVelocityFromRadius, tanVelocityFromRadius)
    let v = n.add(r.normalized().scale(a))

    // the Miniumal Speed Required to Escape From Position `r`
    let escapeSpeed = Math.sqrt(2 * defaultGravityConstant / r.norm())

    return v.scale(randomNumber(minSpeed, escapeSpeed))
}

function randomParam(width, height) {
    let pos = randomPosition()
    let v = randomVelocity(pos)
    let dirX = randomUnitVector3d()
    let dirY = randomUnitVector3d().cross(dirX).normalized()
    return {
        initialPos: pos,
        initialVelocity: v,
        initialDirectionX: dirX,
        initialDirectionY: dirY,
        rotationAxis: randomUnitVector3d(),
        rotationAngularSpeed: randomNumber(minRotationAngularSpeed, maxRotationAngularSpeed),
        objectWidth: width,
        objectHeight: height
    }
}

export {randomPosition, randomVelocity, randomParam, randomNumber}
