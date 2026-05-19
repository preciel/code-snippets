function onTouchStart(touchEvent) {
    for(const _touch of touchEvent.changedTouches) {
        const dot = document.createElement("div");

        dot.id = `touch-debugger-${_touch.identifier}`;
        Object.assign(dot.style, {
            backgroundColor: "red",
            borderRadius: "50%",
            height: "20px",
            width: "20px",
            position: "fixed",
            left: `${_touch.clientX}px`,
            top: `${_touch.clientY}px`,
            zIndex: "9000",
            pointerEvents: "none",
        });

        document.body.append(dot);
    }
}

function onTouchMove(touchEvent) {
    for(const _touch of touchEvent.changedTouches) {
        const dot = document.getElementById(`touch-debugger-${_touch.identifier}`);

        if(dot) {
            Object.assign(dot.style, {
                left: `${_touch.clientX}px`,
                top: `${_touch.clientY}px`,
            });
        }
    }
}

function onTouchEnd(touchEvent) {
    for(const _touch of touchEvent.changedTouches) {
        document.getElementById(`touch-debugger-${_touch.identifier}`)?.remove();
    }
}

export function touchDebuggerInit() {
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
}
