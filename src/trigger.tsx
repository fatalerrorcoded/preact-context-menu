import { h, ComponentChildren, JSX } from "preact";
import { useCallback } from "preact/hooks";

import { openContextMenu } from "./util";

type ContextMenuTriggerProps = {
    id: string,
    data?: any,
    children?: ComponentChildren,
    disabled?: boolean,
}

const ContextMenuTrigger = (props: ContextMenuTriggerProps) => {
    const onContextMenu = useCallback((event: JSX.TargetedEvent<HTMLSpanElement, MouseEvent>) => {
        if (props.disabled === true) return;
        openContextMenu(props.id, props.data, { x: event.clientX, y: event.clientY });
        event.stopPropagation();
        event.preventDefault();
    }, [props.id, props.data]);

    return <span onContextMenu={onContextMenu as any}>{props.children}</span>;
}

export default ContextMenuTrigger;
