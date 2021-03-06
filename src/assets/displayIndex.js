const BASE_URL = import.meta.env.BASE_URL

let index = {
    "neko-shizuku": {
        center: 'NekoShizuku.mp4',
        outer: [
            'NekoShizuku.mp4',
            'NekoShizuku.mp4',
            'NekoShizuku.mp4',
            'NekoShizuku.mp4',
            'NekoShizuku.mp4'
        ]
    },
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
    "jie-ge": {
        center: "JieGe.jpg",
        outer: [
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg"
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
    },
    "2022-04-08": {
        center: "JieGe.jpg",
        outer: [
            "2022-04-08/1.png",
            "2022-04-08/2.png",
            "2022-04-08/3.png",
            "2022-04-08/4.png",
            "2022-04-08/5.png",
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg"
        ]
    },
    "2022-04-12": {
        center: "JieGe.jpg",
        outer: [
            "2022-04-12/1.png",
            "2022-04-12/2.png",
            "2022-04-12/3.png",
            "2022-04-12/4.png",
            "JieGe.jpg",
            "JieGe.jpg",
            "JieGe.jpg"
        ]
    },
    "2022-04-15": {
        center: "JieGe.jpg",
        outer: [
            "2022-04-15/1.png",
            "2022-04-15/2.png",
            "PureReasonHamCountry.mp4",
            "PureReasonHamCountry.mp4",
            "PureReasonHamCountry.mp4",
            "PureReasonHamCountry.mp4",
            'NekoShizuku.mp4',
            'NekoShizuku.mp4',
            "JieGe.jpg",
            "JieGe.jpg",
        ]
    }
}

Object.keys(index).forEach(key => {
    index[key].center = BASE_URL + index[key].center
    index[key].outer = index[key].outer.map(entry =>
        BASE_URL + entry)
})

export default index