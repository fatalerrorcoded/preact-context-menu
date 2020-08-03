import { h, ComponentChildren, JSX } from "preact";
import { useCallback } from "preact/hooks";

import { contextMenus } from "./menu";

type ContextMenuTriggerProps = {
    id: string,
    children?: ComponentChildren
}

const ContextMenuTrigger = (props: ContextMenuTriggerProps) => {
    const onContextMenu = useCallback((event: JSX.TargetedEvent<HTMLSpanElement, MouseEvent>) => {
        event.preventDefault();
        let fn = contextMenus.get(props.id);
        if (fn === undefined) throw new Error(`There is no ContextMenu with the ID ${props.id}`);
        fn();
    }, [props.id]);

    return <span onContextMenu={onContextMenu}>{props.children}</span>;
}

export default ContextMenuTrigger;
