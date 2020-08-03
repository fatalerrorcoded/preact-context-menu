import { h, JSX, ComponentChildren } from "preact";
import { useEffect, useCallback } from "preact/hooks";

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
