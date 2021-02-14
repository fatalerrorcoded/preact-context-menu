import { h, ComponentChildren } from "preact";
import { useCallback } from "preact/hooks";

import { MenuContext } from "./menu";

type MenuItemProps = {
    children: ComponentChildren,
    data?: any,
    disabled?: boolean,
}

const MenuItem = (props: MenuItemProps) => {
    const onClick = useCallback((event: h.JSX.TargetedEvent, fn: ((data: any) => void) | undefined, data: any) => {
        if (props.disabled === true) return;
        event.stopPropagation();
        if (fn === undefined) throw new Error(`MenuItem is not inside a ContextMenu`);
        fn(data);
    }, []);

    return (
        <MenuContext.Consumer>
            {(fn) => (
                <span onClick={(event) => onClick(event, fn, props.data)}>{props.children}</span>
            )}
        </MenuContext.Consumer>
    );
}

export default MenuItem;
