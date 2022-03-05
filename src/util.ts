import { JSX, Ref, RefObject } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { Coords, contextMenus, menuOffset } from "./menu";

let currentMouseCoords: Coords = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
    document.addEventListener("mousemove", (event: MouseEvent) =>
        currentMouseCoords = { x: event.clientX, y: event.clientY });
}

/**
 * Open a context menu by its ID.
 * @param id Context Menu ID
 * @param data Data to pass to callback function
 * @param coords Coordinates to place context menu at
 */
export const openContextMenu = (id: string, data?: any, coords?: Coords) => {
    const fn = contextMenus.get(id);
    if (fn === undefined) throw new Error(`There is no ContextMenu with the ID ${id}`);
    fn(coords ? { x: coords.x - menuOffset, y: coords.y - menuOffset } : currentMouseCoords, data);
}

/**
 * Bind context menu events to a Ref.
 * @param ref Ref object
 * @param id Context Menu ID
 * @param data Data to pass to callback function
 * @param disabled Whether the context menu is disabled
 * @param touchTimeout Long press duration to show context menu
 */
export const useContextMenu = (ref: RefObject<HTMLElement | null>, id: string, data?: any, disabled?: boolean, touchTimeout = 610) => {
    // For most browsers, we can use onContextMenu.
    const onContextMenu = useCallback((event: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
        if (disabled === true) return;
        openContextMenu(id, data, { x: event.clientX, y: event.clientY });
        event.stopPropagation();
        event.preventDefault();
    }, [id, data, disabled]);

    const timeoutRef = useRef<number>();

    // On iOS devices, we need to manually handle the touch events.
    const onTouchStart = useCallback((event: JSX.TargetedTouchEvent<HTMLSpanElement>) => {
        if (disabled === true) return;
        event.stopPropagation();
        event.preventDefault();

        const touch = event.touches[0];
        
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            openContextMenu(id, data, { x: touch.clientX, y: touch.clientY });
        }, touchTimeout) as unknown as number;
    }, [id, data, disabled]);

    // Cancel context menu if we move, end or cancel the touch.
    const onTouchCancel = useCallback(() => {
        clearTimeout(timeoutRef.current);
    }, []);

    // Bind events to given ref.
    useEffect(() => {
        const el = ref.current;
        if (el) {
            el.addEventListener('contextmenu', onContextMenu);
            el.addEventListener('touchstart', onTouchStart, { passive: true });
            el.addEventListener('touchcancel', onTouchCancel, { passive: true });
            el.addEventListener('touchmove', onTouchCancel, { passive: true });
            el.addEventListener('touchend', onTouchCancel, { passive: true });

            return () => {
                el.removeEventListener('contextmenu', onContextMenu);
                el.removeEventListener('touchstart', onTouchStart);
                el.removeEventListener('touchcancel', onTouchCancel);
                el.removeEventListener('touchmove', onTouchCancel);
                el.removeEventListener('touchend', onTouchCancel);
            };
        }

        return () => {};
    }, [ ref ]);
}

/**
 * Generate a new Ref that can be put on any element.
 * @param id Context Menu ID
 * @param data Data to pass to callback function
 * @param disabled Whether the context menu is disabled
 * @param touchTimeout Long press duration to show context menu
 * @returns Ref Object
 */
export const refContextMenu = (id: string, data?: any, disabled?: boolean, touchTimeout?: number) => {
    const ref = useRef<HTMLElement>(null);
    useContextMenu(ref, id, data, disabled, touchTimeout);
    return ref as Ref<HTMLElement>;
};
