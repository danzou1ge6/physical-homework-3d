import { onUnmounted, onMounted } from "vue"
import { mouseScrollSensitivity } from "../constants.js"

export function useTrackMouseScroll(updateRadius, elemRef) {

    function handleScroll(event) {
        updateRadius(mouseScrollSensitivity * event.deltaY)
    }

    let touchState = []
    function touchDistance(touch1, touch2) {
        return Math.sqrt(
            (touch1.clientX - touch2.clientX) ** 2
            + (touch1.clientY - touch2.clientY) ** 2
        )
    }
    function onTouchStart(event) {
        if(event.touches.length == 2){
            touchState = event.touches
        }
    }
    function onTouchMove(event) {
        if(event.changedTouches.length == 2 && touchState.length == 2){
            let deltaY = touchDistance(
                touchState[0],
                touchState[1]
            ) - touchDistance(
                event.changedTouches[0],
                event.changedTouches[1]
            )
            updateRadius(mouseScrollSensitivity * deltaY)
            touchState = event.touches
        }
    }
    function onTouchEnd() {
        touchState = []
    }

    onMounted(() => {
        if(elemRef.value.ontouchmove === undefined){
            elemRef.value.addEventListener('wheel', handleScroll)
            onUnmounted(() => {
            })
        }else{
            
            elemRef.value.addEventListener('touchstart', onTouchStart)
            elemRef.value.addEventListener('touchmove', onTouchMove)
            elemRef.value.addEventListener('touchend', onTouchEnd)
            onUnmounted(() => {
            })
        }
    })

    onUnmounted(() => {
        if(elemRef.value.ontouchmove){
            elemRef.value.removeEventListener('touchstart', onTouchStart)
            elemRef.value.removeEventListener('touchmove', onTouchMove)
            elemRef.value.removeEventListener('touchend', onTouchEnd)
        }else{
            elemRef.value.removeEventListener('wheel', handleScroll)
        }
    })
}
