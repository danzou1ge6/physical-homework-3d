import { onMounted, onUnmounted } from "vue";
import { mouseMoveSensitivity } from "../constants";

export function useTrackMouseSwipe(updateAngle) {
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

    onMounted(() => {window.addEventListener('mousemove', onMouseMove)})
    onUnmounted(() => {window.removeEventListener('mousemove', onMouseMove)})

}