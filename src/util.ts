import { JSX } from "preact";
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

var timeout = 0;

const iOS = () => /(iPad|iPhone|iPod)/g.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

/**
 * Bind context menu events to a Ref.
 * @param ref Ref object
 * @param id Context Menu ID
 * @param data Data to pass to callback function
 * @param disabled Whether the context menu is disabled
 * @param touchTimeout Long press duration to show context menu
 */
export const useTriggerEvents = (id: string, data?: any, disabled?: boolean, touchTimeout = 610) => {
    if (iOS()) {
        // On iOS devices, we need to manually handle the touch events.
        const onTouchStart = (event: JSX.TargetedTouchEvent<HTMLSpanElement>) => {
            if (disabled === true) return;
            const touch = event.touches[0];
            
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                openContextMenu(id, data, { x: touch.clientX, y: touch.clientY });
            }, touchTimeout) as unknown as number;
        };

        // Cancel context menu if we move, end or cancel the touch.
        const onTouchCancel = () => {
            clearTimeout(timeout);
        };

        return {
            onTouchStart,
            onTouchCancel,
            onTouchMove: onTouchCancel,
            onTouchEnd: onTouchCancel
        }
    } else {
        // For most browsers, we can use onContextMenu.
        const onContextMenu = (event: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
            if (disabled === true) return;
            openContextMenu(id, data, { x: event.clientX, y: event.clientY });
            event.stopPropagation();
            event.preventDefault();
        };

        return {
            onContextMenu
        }
    }
}
