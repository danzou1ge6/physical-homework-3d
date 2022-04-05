import { mouseScrollSensitivity } from "../constants.js"

export function useTrackMouseScroll(updateRadius) {
    function handleScroll(event) {
        updateRadius(mouseScrollSensitivity * event.deltaY)
    }
    window.addEventListener('wheel', handleScroll)
}
