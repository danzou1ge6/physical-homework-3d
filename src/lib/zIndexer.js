export class ZIndexSorter {
    constructor(start, keys) {
        this.start = start
        this.data = keys.map(key => ({key: key}))
    }
    sort() {
        // Desc
        this.data.sort((a, b) => b.z - a.z)
    }
    getZIndex(z, key) {
        let idxForKey = this.data.findIndex(d => d.key == key)
        if(idxForKey == -1){
            this.data.push({
                key: key,
                z: z
            })
        }else{
            this.data[idxForKey].z = z
        }
        this.sort()
        return this.start + this.data.findIndex(d => d.key == key)
    }
}