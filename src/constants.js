export const defaultGravityConstant = 10000
export const mouseMoveSensitivity = Math.PI / 800  // radius every 100px
export const mouseScrollSensitivity = 10  // pixel every pixel
export const defaultViewPointDistanceToWindow = 800
export const initialViewPointPitch = Math.PI / 4
export const initialViewPointYaw = 0
export const initialViewPointRadius = 4000
export const initialDeltaT = 20
export const generationConstants = {
    minObjRadius: 3000,
    maxObjRadius: 3000,
    tanVelocityFromRadius: 0.01,
    minSpeedCoefficient: 0.99,
    maxSpeedCoefficient: 1.01,
    minRotationAngularSpeed: 0,
    maxRotationAngularSpeed: 0.01,
    planeNormalVector: null,
    imgSize: 800
}