import { h, render } from "preact";
import { useState, useCallback } from "preact/hooks";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "../index";

import { StyleSheet, css } from "aphrodite";

const styles = StyleSheet.create({
    styled: {
        backgroundColor: "#4a4a4a",
        color: "#ffffff",
        padding: "8px",
        borderRadius: "8px",
        fontFamily: "'Arial', sans-serif",
    }
});

const DataTest = () => {
    const [data, setData] = useState<any>(undefined);
    const onClose = useCallback((data: any) => {
        console.log(data);
        setData(data);
    }, []);

    return (
        <div>
            <div>Returned data: {data ? data.toString() : "undefined"}</div>
            <br />
            <ContextMenu id="data_passing" onClose={onClose}>
                <ul>
                    <li>
                        <MenuItem data={1}>
                            Click me to return 1!
                        </MenuItem>
                    </li>
                    <li>
                        <MenuItem data="yes">
                            Or me to return "yes"!
                        </MenuItem>
                    </li>
                    <li>
                        <MenuItem data={{ yes: "indeed", number: 12 }}>
                            Or me to return an object!
                        </MenuItem>
                    </li>
                </ul>
            </ContextMenu>
            <ContextMenuTrigger id="data_passing">
                Right-click me to open context menu!
            </ContextMenuTrigger>
        </div>
    )
}

const TestElement = () => {
    return (
        <div>
            <h1>Preact Context Menu</h1>
            <h3>Simple context menu.</h3>
            <ContextMenu id="simple">
                My Context Menu
            </ContextMenu>
            <ContextMenuTrigger id="simple">
                Right-click me to open context menu!
            </ContextMenuTrigger>
            <h3>Multiple triggers.</h3>
            <ContextMenu id="multiple">
                My Context Menu
            </ContextMenu>
            <ul>
                <li>
                    <ContextMenuTrigger id="multiple">
                        Right-click me to open context menu!
                    </ContextMenuTrigger>
                </li>
                <li>
                    <ContextMenuTrigger id="multiple">
                        Or me!
                    </ContextMenuTrigger>
                </li>
                <li>
                    <ContextMenuTrigger id="multiple">
                        Or this one!
                    </ContextMenuTrigger>
                </li>
                <li>
                    <ContextMenuTrigger id="multiple" disabled>
                        But you can't use me since I am disabled
                    </ContextMenuTrigger>
                </li>
            </ul>
            <h3>Menu items</h3>
            <ContextMenu id="items">
                <ul>
                    <li>
                        <MenuItem>
                            Click me to close the menu!
                        </MenuItem>
                    </li>
                    <li>
                        <MenuItem>
                            Or me!
                        </MenuItem>
                    </li>
                    <li>
                        <MenuItem>
                            Or even me!
                        </MenuItem>
                    </li>
                    <li>
                        <MenuItem disabled>
                            But you can't use me since I am disabled
                        </MenuItem>
                    </li>
                </ul>
            </ContextMenu>
            <ContextMenuTrigger id="items">
                Right-click me to open context menu!
            </ContextMenuTrigger>
            <h3>Error handling.</h3>
            <ContextMenuTrigger id="broken">
                Intentionally broken trigger, can't right-click me.
            </ContextMenuTrigger>
            <br /><br />
            <MenuItem>
                Intentionally broken menu item.
            </MenuItem>
            <h3>Data passing</h3>
            <DataTest />
            <h3>Styling</h3>
            <ContextMenu id="styling" className={css(styles.styled)}>
                My Context Menu
            </ContextMenu>
            <ContextMenuTrigger id="styling">
                Right-click me to open context menu!
            </ContextMenuTrigger>
            <h3>Nesting</h3>
            <ContextMenu id="nested1">
                <ContextMenuTrigger id="nested2">
                    Right-click me to open <i>another</i> context menu!
                </ContextMenuTrigger>
            </ContextMenu>
            <ContextMenu id="nested2">
                A nested context menu!
            </ContextMenu>
            <ContextMenuTrigger id="nested1">
                Right-click me to open context menu!
            </ContextMenuTrigger>
        </div>
    );
}

render(<TestElement />, document.body.appendChild(document.createElement("div")));
