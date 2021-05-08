import { h, ComponentChildren, JSX } from "preact";
import { useCallback } from "preact/hooks";

import { contextMenus } from "./menu";

type ContextMenuTriggerProps = {
    id: string,
    data?: any,
    children?: ComponentChildren,
    disabled?: boolean,
}

const ContextMenuTrigger = (props: ContextMenuTriggerProps) => {
    const onContextMenu = useCallback((event: JSX.TargetedEvent<HTMLSpanElement, MouseEvent>) => {
        if (props.disabled === true) return;
        let fn = contextMenus.get(props.id);
        if (fn === undefined) throw new Error(`There is no ContextMenu with the ID ${props.id}`);
        event.stopPropagation();
        event.preventDefault();
        fn({ x: event.clientX, y: event.clientY }, props.data);
    }, [props.id, props.data]);

    return <span onContextMenu={onContextMenu as any}>{props.children}</span>;
}

export default ContextMenuTrigger;
