class Vector3d {
    constructor(list1d) {
        this.data = list1d
        this.normValue = null
    }
    get x() {return this.data[0]}
    get y() {return this.data[1]}
    get z() {return this.data[2]}
    dot(vec) {
        return this.data.reduce((s, v, i) => s + v * vec.data[i], 0)
    }
    cross(vec) {
        let x = this.y * vec.z - this.z * vec.y
        let y = - this.x * vec.z + this.z * vec.x
        let z = this.x * vec.y - this.y * vec.x
        return new Vector3d([x, y, z])
    }
    scale(s) {
        return new Vector3d(this.data.map(v => v * s))
    }
    add(vec) {
        return new Vector3d(this.data.map((v, i) => v + vec.data[i]))
    }
    minus(vec) {
        return new Vector3d(this.data.map((v, i) => v - vec.data[i]))
    }
    norm() {
        if(!this.normValue){
            this.normValue = Math.sqrt(this.data.reduce((s, v) => s + v * v, 0))
        }
        return this.normValue
    }
    normalized() {
        return this.scale(1 / this.norm())
    }
    // `axis` is not normalized
    rotate(axis, rad) {
        return this.scale(Math.cos(rad))
            .add(this.cross(axis).scale(Math.sin(rad)))
            .add(axis.scale((1 - Math.cos(rad)) * this.dot(axis)))
    }
}

class Matrix3D {
    // list2d = [[row1], [row2], [row3]]
    constructor(list2d) {
        this.data = list2d
    }
    row(i) {
        return new Vector3d(this.data[i])
    }
    col(j) {
        return new Vector3d(this.data.map(row => row[j]))
    }
    get T() {
        return new Matrix3D([0, 1, 2].map(j => this.data.map(row => row[j])))
    }
    dotVec(vec) {
        return new Vector3d(this.data.map(r => 
            r.reduce((s, v, i) => s + v * vec.data[i], 0))
        )
    }
    dotMat(mat) {
        let matT = mat.T
        return new Matrix3D(
            [0, 1, 2].map(i => 
                [0, 1, 2].map(j => this.row(i).dot(matT.row(j)))
            )
        )
    }
    scale(s) {
        return new Matrix3D([0, 1, 2].map(i => 
            [0, 1, 2].map(j => this.data[i][j] * s))
        )
    }
    det() {
        return this.row(0).dot(this.row(1).cross(this.row(2)))
    }
    inv() {
        let det = this.det()
        let c = new Matrix3D([[1,2],[2,0],[0,1]].map(([i1, i2]) => 
            this.row(i1).cross(this.row(i2)).data))
        return c.scale(1 / det).T
    }
}


export {Matrix3D, Vector3d}
