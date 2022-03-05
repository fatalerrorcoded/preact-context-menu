import { h, ComponentChildren, JSX } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

import { openContextMenu } from "./util";

type ContextMenuTriggerProps = {
    id: string,
    data?: any,
    children?: ComponentChildren,
    disabled?: boolean,
    touchTimeout?: number
}

/**
 * Component which wraps around other components to provide a context menu trigger area.
 * @param props Trigger props
 * @returns Component
 */
const ContextMenuTrigger = (props: ContextMenuTriggerProps) => {
    // For most browsers, we can use onContextMenu.
    const onContextMenu = useCallback((event: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
        if (props.disabled === true) return;
        openContextMenu(props.id, props.data, { x: event.clientX, y: event.clientY });
        event.stopPropagation();
        event.preventDefault();
    }, [props.id, props.data]);

    const ref = useRef<HTMLSpanElement>(null);
    const timeoutRef = useRef<number>();

    // On iOS devices, we need to manually handle the touch events.
    const onTouchStart = useCallback((event: JSX.TargetedTouchEvent<HTMLSpanElement>) => {
        if (props.disabled === true) return;
        event.stopPropagation();
        event.preventDefault();

        const touch = event.touches[0];
        
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            openContextMenu(props.id, props.data, { x: touch.clientX, y: touch.clientY });
        }, props.touchTimeout ?? 610) as unknown as number;
    }, [props.id, props.data]);

    // Cancel context menu if we move, end or cancel the touch.
    const onTouchCancel = useCallback(() => {
        clearTimeout(timeoutRef.current);
    }, []);

    // Bind events directly, since Preact has some trouble here.
    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('touchstart', onTouchStart, { passive: true });
            ref.current.addEventListener('touchcancel', onTouchCancel, { passive: true });
            ref.current.addEventListener('touchmove', onTouchCancel, { passive: true });
            ref.current.addEventListener('touchend', onTouchCancel, { passive: true });

            return () => {
                ref.current!.removeEventListener('touchstart', onTouchStart);
                ref.current!.removeEventListener('touchcancel', onTouchCancel);
                ref.current!.removeEventListener('touchmove', onTouchCancel);
                ref.current!.removeEventListener('touchend', onTouchCancel);
            }
        }

        return () => {};
    }, [ref]);

    return <span ref={ref} onContextMenu={onContextMenu}>{props.children}</span>;
}

export default ContextMenuTrigger;
