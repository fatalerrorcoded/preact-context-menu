import { Coords, contextMenus, menuOffset } from "./menu";

let currentMouseCoords: Coords = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
    document.addEventListener("mousemove", (event: MouseEvent) =>
        currentMouseCoords = { x: event.clientX, y: event.clientY });
}

export const openContextMenu = (id: string, data?: any, coords?: Coords) => {
    const fn = contextMenus.get(id);
    if (fn === undefined) throw new Error(`There is no ContextMenu with the ID ${id}`);
    fn(coords ? { x: coords.x - menuOffset, y: coords.y - menuOffset } : currentMouseCoords, data);
}
