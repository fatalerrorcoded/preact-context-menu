import { h, JSX, ComponentChildren, createContext } from "preact";
import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { createPortal } from "preact/compat";

import { StyleSheet, css } from "aphrodite";

type Coords = { x: number, y: number };

type ContextMenuProps = Omit<Omit<JSX.HTMLAttributes<HTMLDivElement>, "id">, "ref"> & {
    id: string,
    children?: ComponentChildren,
    onClose?: (data: any) => void
}

const styles = StyleSheet.create({
    preact_context_menu: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    menu: {
        position: 'absolute',
        pointerEvents: 'initial'
    }
});

const offset = 8;

const menuContainer = document.createElement("div");
menuContainer.classList.add(css(styles.preact_context_menu));
document.body.appendChild(menuContainer);

export const contextMenus: Map<string, (coords: Coords) => void> = new Map();
export const MenuContext = createContext<((data: any) => void) | undefined>(undefined);
let currentMouseCoords: Coords = { x: 0, y: 0 };

document.addEventListener("mousemove", (event: MouseEvent) =>
    currentMouseCoords = { x: event.clientX, y: event.clientY });

export const openContextMenu = (id: string, coords?: Coords) => {
    const fn = contextMenus.get(id);
    if (fn === undefined) throw new Error(`There is no ContextMenu with the ID ${id}`);
    fn(coords ? { x: coords.x - offset, y: coords.y - offset } : currentMouseCoords);
}

const ContextMenu = (props: ContextMenuProps) => {
    let {
        id,
        children,
        className,
        onClose,
        style,
        ...divProps
    } = props;
    
    const [render, setRender] = useState(false);
    const [placement, setPlacement] = useState<Coords | undefined>(undefined);
    const [eventCoords, setEventCoords] = useState<Coords | undefined>(undefined);
    const ref = useRef<HTMLDivElement>(null);

    const trigger = useCallback((coords: Coords) => {
        setEventCoords(coords);
        setRender(true);
    }, []);

    const closeMenu = useCallback((data: any) => {
        setRender(false);
        setPlacement(undefined);
        if (props.onClose !== undefined) props.onClose(data);
    }, [props.onClose]);

    const onClickAway = useCallback((event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as any)) {
            closeMenu(undefined);
        }
    }, []);

    useEffect(() => {
        if (contextMenus.has(id)) throw new Error(`There is another ContextMenu element with the ID ${id}`);
        contextMenus.set(id, trigger);
        return () => {
            contextMenus.delete(id);
        }
    }, [id]);

    useEffect(() => {
        if (render) {
            const div = ref.current;
            if (div === null) return;
            const eventCoords2 = eventCoords || {x: 0, y: 0};
            let x = eventCoords2.x + offset;
            let y = eventCoords2.y + offset;
            const width = document.documentElement.scrollWidth;
            const height = document.documentElement.scrollHeight;

            if (x + div.offsetWidth > width - 8) {
                x = eventCoords2.x - div.offsetWidth;
            }

            if (y + div.offsetHeight > height - 8) {
                y = height - div.offsetHeight - 8;
            }

            setPlacement({ x, y });
            document.addEventListener('mousedown', onClickAway);
            return () => document.removeEventListener('mousedown', onClickAway);
        } else {
            setPlacement(undefined);
            setEventCoords(undefined);
            return undefined;
        }
    }, [render])
    
    let finalClassName = css(styles.menu);
    if (className) finalClassName += ` ${className}`;
    if (render) {
        let finalStyle: any = style || {};
        if (placement !== undefined) {
            finalStyle.top = placement.y;
            finalStyle.left = placement.x;
            if (!className && !finalStyle["background-color"]) finalStyle["background-color"] = "#FFFFFF";
        } else {
            finalStyle.opacity = 0;
            finalStyle["pointer-events"] = "none";
        }

        return createPortal(
            <MenuContext.Provider value={(data: any) => closeMenu(data)}>
                <div ref={ref} id={id} {...divProps}
                    className={finalClassName} style={finalStyle}
                >{children}</div>
            </MenuContext.Provider>,
            menuContainer);
    } else {
        return null;
    }
}

export default ContextMenu;
