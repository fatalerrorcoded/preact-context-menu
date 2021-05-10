import { h, JSX, ComponentChildren, createContext } from "preact";
import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { createPortal } from "preact/compat";

export type Coords = { x: number, y: number };

type ContextMenuWithDataProps = Omit<Omit<Omit<JSX.HTMLAttributes<HTMLDivElement>, "id">, "ref">, "onContextMenu"> & {
    id: string,
    children: (data: any) => ComponentChildren,
    onClose?: (data: any) => void,
}

type ContextMenuProps = Omit<ContextMenuWithDataProps, "children"> & {
    children: ComponentChildren,
}

export let menuOffset = 8;

export const contextMenus: Map<string, (coords: Coords, data: any) => void> = new Map();
export const MenuContext = createContext<((data: any) => void) | undefined>(undefined);

var menuContainer: Element;

if (typeof window !== 'undefined') {
    menuContainer = document.createElement("div");
    menuContainer.classList.add("preact-context-menu");
    menuContainer.setAttribute("style", "overflow: hidden; pointer-events: none;");
    document.body.appendChild(menuContainer);
}

export const ContextMenuWithData = (props: ContextMenuWithDataProps) => {
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
    const [data, setData] = useState<any>(undefined);
    const ref = useRef<HTMLDivElement>(null);

    const trigger = useCallback((coords: Coords, data: any) => {
        setEventCoords(coords);
        setRender(true);
        setData(data);
    }, []);

    const closeMenu = useCallback((data: any) => {
        setRender(false);
        setPlacement(undefined);
        setData(undefined);
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
        if (render && typeof window !== 'undefined') {
            const div = ref.current;
            if (div === null) return;
            let coords = eventCoords || {x: 0, y: 0};
            let x = coords.x + menuOffset;
            let y = coords.y + menuOffset;

            const width = window.innerWidth;
            const height = window.innerHeight;

            if (x + div.offsetWidth > width - 8) {
                x = coords.x - div.offsetWidth;
            }

            if (y + div.offsetHeight > height - 8) {
                y = height - div.offsetHeight - 8;
            }

            setPlacement({ x, y });
            document.addEventListener('mousedown', onClickAway);
            return () => document.removeEventListener('mousedown', onClickAway);
        }

        return undefined;
    }, [render, eventCoords])
    
    if (render) {
        let finalStyle: any = style || {};
        finalStyle.position = "fixed";
        if (placement !== undefined) {
            finalStyle.top = placement.y;
            finalStyle.left = placement.x;
            finalStyle.pointerEvents = "initial";
        } else {
            finalStyle.opacity = 0;
            finalStyle.pointerEvents = "none";
        }

        return createPortal(
            <MenuContext.Provider value={(data: any) => closeMenu(data)}>
                <div ref={ref} id={id} {...divProps as any}
                    // This is to stop the browser context menu from opening
                    onContextMenu={(event) => event.preventDefault()}
                    className={className !== undefined ? `context-menu ${className}` : "context-menu"} style={finalStyle}
                >{children(data)}</div>
            </MenuContext.Provider>,
            menuContainer);
    } else {
        return null;
    }
}

const ContextMenu = (props: ContextMenuProps) => {
    let {
        children,
        ...rest
    } = props;
    return (
        <ContextMenuWithData {...rest}>
            {(_) => children}
        </ContextMenuWithData>
    );
}

export default ContextMenu;
