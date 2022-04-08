export class ZIndexSorter {
    constructor(start, keys, sortInterval) {
        this.start = start
        this.data = keys.map(key => ({key: key}))
        
        // Only Sort Every `sortInterval` `getZIndex` Call
        // to Improve Performance
        this.sortInterval = sortInterval
        this.count = 0
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
        this.count ++
        if(this.count >= this.sortInterval){
            this.sort()
            this.count = 0
        }
        return this.start + this.data.findIndex(d => d.key == key)
    }
}