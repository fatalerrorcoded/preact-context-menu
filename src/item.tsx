import { h, ComponentChildren } from "preact";
import { useCallback } from "preact/hooks";

import { MenuContext } from "./menu";

type MenuItemProps = {
    children: ComponentChildren,
    data?: any,
}

const MenuItem = (props: MenuItemProps) => {
    const onClick = useCallback((fn: ((data: any) => void) | undefined, data: any) => {
        if (fn === undefined) throw new Error(`MenuItem is not inside a ContextMenu`);
        fn(data);
    }, []);

    return (
        <MenuContext.Consumer>
            {(fn) => (
                <span onClick={() => onClick(fn, props.data)}>{props.children}</span>
            )}
        </MenuContext.Consumer>
    );
}

export default MenuItem;
