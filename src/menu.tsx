import { h, JSX, ComponentChildren } from "preact";
import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { createPortal } from "preact/compat";

import { StyleSheet, css } from "aphrodite";

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
        pointerEvents: 'initial',
        backgroundColor: "#FFFFFF",
    }
});

const menuContainer = document.createElement("div");
menuContainer.classList.add(css(styles.preact_context_menu));
document.body.appendChild(menuContainer);

export const contextMenus: Map<string, (event: MouseEvent) => void> = new Map();

type Coords = { x: number, y: number } | undefined;

type ContextMenuProps = Omit<Omit<JSX.HTMLAttributes<HTMLDivElement>, "id">, "ref"> & {
    id: string,
    children?: ComponentChildren
}

const ContextMenu = (props: ContextMenuProps) => {
    let {
        id,
        children,
        className,
        ...divProps
    } = props;
    
    const [render, setRender] = useState(false);
    const [placement, setPlacement] = useState<Coords>(undefined);
    const [eventCoords, setEventCoords] = useState<Coords>(undefined);
    const ref = useRef<HTMLDivElement>(null);

    const trigger = useCallback((event: MouseEvent) => {
        setEventCoords({ x: event.clientX, y: event.clientY });
        setRender(true);
    }, []);

    const onClickAway = useCallback((event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as any)) {
            setRender(false);
            setPlacement(undefined);
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
            console.log(div);
            if (div === null) return;
            const eventCoords2 = eventCoords || {x: 0, y: 0};
            let x = eventCoords2.x + 8;
            let y = eventCoords2.y + 8;
            const width = document.documentElement.scrollWidth;
            const height = document.documentElement.scrollHeight;

            console.log(x, div.offsetWidth, width - 8);
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

    if (className) className += ` ${css(styles.menu)}`;
    else className = css(styles.menu);
    if (render) {
        let style: any = {};
        if (placement !== undefined) {
            style.top = placement.y;
            style.left = placement.x;
        } else {
            style.opacity = 0;
            style["pointer-events"] = "none";
        }

        return createPortal(
            <div ref={ref} id={id} {...divProps}
                className={className} style={style}
            >{children}</div>,
            menuContainer);
    } else {
        return null;
    }
}

export default ContextMenu;
