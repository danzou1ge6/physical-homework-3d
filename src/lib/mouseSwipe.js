import { onMounted, onUnmounted } from "vue";
import { mouseMoveSensitivity } from "../constants";

export function useTrackMouseSwipe(updateAngle, elemRef) {
    // updateAngle
    // param:
    //     {
    //         deltaPitch: Number
    //         deltaYaw: Number
    //     }

    function onMouseMove(event) {
        if(event.buttons == 1){  // Left Click
            updateAngle({
                deltaPitch: mouseMoveSensitivity * event.movementY,
                deltaYaw: -mouseMoveSensitivity * event.movementX
            })
        }
    }

    let touchState = []
    function onTouchStart(event) {
        if(event.touches.length == 1){
            touchState = event.touches
        }
    }
    function onTouchEnd() {
        touchState = []
    }
    function onTouchMove(event) {
        if(touchState.length == 1 && event.changedTouches.length == 1){
            let movementX = event.changedTouches[0].clientX
                - touchState[0].clientX
            let movementY = event.changedTouches[0].clientY
                - touchState[0].clientY
            updateAngle({
                deltaPitch: mouseMoveSensitivity * movementY,
                deltaYaw: -mouseMoveSensitivity * movementX
            })
            touchState = event.touches
        }
    }

    onMounted(() => {
        if(elemRef.value.ontouchmove === undefined){
            elemRef.value.addEventListener('mousemove', onMouseMove)
        }else{
            elemRef.value.addEventListener('touchstart', onTouchStart)
            elemRef.value.addEventListener('touchmove', onTouchMove)
            elemRef.value.addEventListener('touchend', onTouchEnd)
        }

    })
    onUnmounted(() => {
        if(elemRef.value.ontouchmove){
            elemRef.value.removeEventListener('touchstart', onTouchStart)
            elemRef.value.removeEventListener('touchmove', onTouchMove)
            elemRef.value.removeEventListener('touchend', onTouchEnd)
        }else{
            elemRef.value.removeEventListener('mousemove', onMouseMove)
        }
    })

}