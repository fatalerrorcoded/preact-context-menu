import { h, ComponentChildren } from "preact";
import { useCallback } from "preact/hooks";

import { MenuContext } from "./menu";

type MenuItemProps = {
    children: ComponentChildren
}

const MenuItem = (props: MenuItemProps) => {
    const onClick = useCallback((fn: (() => void) | undefined) => {
        if (fn === undefined) throw new Error(`MenuItem is not inside a ContextMenu`);
        fn();
    }, []);

    return (
        <MenuContext.Consumer>
            {(fn) => (
                <span onClick={() => onClick(fn)}>{props.children}</span>
            )}
        </MenuContext.Consumer>
    );
}

export default MenuItem;
