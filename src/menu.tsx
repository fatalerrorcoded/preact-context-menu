import { h, JSX, ComponentChildren } from "preact";
import { useEffect, useCallback } from "preact/hooks";

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
        pointerEvents: 'initial',
        backgroundColor: "#FFFFFF",
    }
});

const menuContainer = document.createElement("div");
menuContainer.classList.add(css(styles.preact_context_menu));
document.body.appendChild(menuContainer);

export const contextMenus: Map<string, () => void> = new Map();

type ContextMenuProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "id"> & {
    id: string,
    children?: ComponentChildren
}

const ContextMenu = (props: ContextMenuProps) => {
    let {
        id,
        children,
        ...divProps
    } = props;

    const trigger = useCallback(() => {}, []);

    useEffect(() => {
        if (contextMenus.has(id)) throw new Error(`There is another ContextMenu element with the ID ${id}`);
        contextMenus.set(id, trigger);
        return () => {
            contextMenus.delete(id);
        }
    }, [id]);

    return <div id={id} {...divProps}>{children}</div>;
}

export default ContextMenu;
