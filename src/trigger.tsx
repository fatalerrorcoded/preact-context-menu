import { h, ComponentChildren, JSX } from "preact";
import { useCallback } from "preact/hooks";

import { contextMenus } from "./menu";

type ContextMenuTriggerProps = {
    id: string,
    children?: ComponentChildren
}

const ContextMenuTrigger = (props: ContextMenuTriggerProps) => {
    const onContextMenu = useCallback((event: JSX.TargetedEvent<HTMLSpanElement, MouseEvent>) => {
        let fn = contextMenus.get(props.id);
        if (fn === undefined) throw new Error(`There is no ContextMenu with the ID ${props.id}`);
        event.preventDefault();
        fn(event);
    }, [props.id]);

    return <span onContextMenu={onContextMenu}>{props.children}</span>;
}

export default ContextMenuTrigger;
