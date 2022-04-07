const BASE_URL = import.meta.env.BASE_URL

let index = {
    "sorakado-ai": {
        center: "SorakadoAi.jpg",
        outer: [
            "SorakadoAi.jpg",
            "SorakadoAi.jpg",
            "SorakadoAi.jpg",
            "SorakadoAi.jpg",
            "SorakadoAi.jpg",
            "SorakadoAi.jpg",
            "SorakadoAi.jpg"
        ]
    },
    "2022-04-07": {
        center: "JieGe.jpg",
        outer: [
            "2022-04-07/1.png",
            "2022-04-07/2.png",
            "2022-04-07/3.png",
            "2022-04-07/4.png",
            "2022-04-07/5.png"
        ]
    }
}

Object.keys(index).forEach(key => {
    index[key].center = BASE_URL + index[key].center
    index[key].outer = index[key].outer.map(entry =>
        BASE_URL + entry)
})

export default index