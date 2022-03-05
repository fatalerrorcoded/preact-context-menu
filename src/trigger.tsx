import { h, ComponentChildren } from "preact";

import { refContextMenu } from "./util";

type ContextMenuTriggerProps = {
    id: string,
    data?: any,
    children?: ComponentChildren,
    disabled?: boolean,
    touchTimeout?: number
}

/**
 * Component which wraps around other components to provide a context menu trigger area.
 * @param props Trigger props
 * @returns Component
 */
const ContextMenuTrigger = ({ id, data, children, disabled, touchTimeout }: ContextMenuTriggerProps) => {
    return <span ref={refContextMenu(id, data, disabled, touchTimeout)}>{children}</span>;
}

export default ContextMenuTrigger;
