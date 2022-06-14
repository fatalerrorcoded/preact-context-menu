# Preact Context Menu

## Installation

Using yarn

```bash
yarn add preact-context-menu
```

Using npm

```bash
npm install --save preact-context-menu
```

## Usage

The simplest way to use preact-context-menu is to setup a pair of ContextMenu and ContextMenuTrigger with the same ID

```jsx
import { h } from "preact";
import { ContextMenu, ContextMenuTrigger } from "preact-context-menu";

function Component() {
    return (
        <div>
            <ContextMenu id="unique_id">
                My Context Menu
            </ContextMenu>
            <ContextMenuTrigger id="unique_id">
                Right-click me to open context menu!
            </ContextMenuTrigger>
        </div>
    );
}
```

### Opening and closing menus

Besides closing when clicked outside of, a menu can also be closed when a MenuItem is clicked or when you call the function provided from the MenuContext that can be imported from `preact-context-menu/menu`

An onClose function prop is triggered on ContextMenu if present, with a data parameter if provided to a MenuItem or passed to the MenuContext close function, or undefined when closed by clicking outside of the menu

```jsx
import { h } from "preact";
import { ContextMenu, MenuItem } from "preact-context-menu";
import { MenuContext } from "preact-context-menu/menu";

function Menu() {
    return (
        <ContextMenu id="unique_id">
            <MenuItem>
                Click me to close the menu!
            </MenuItem>
            <br /><br />
            {/* or to pass info to the onClose prop on ContextMenu */}
            <MenuItem data={{ hello: "Hello, world!" }}>
                Click me to close the menu with data!
            </MenuItem>
            <br /><br />
            <MenuContext.Consumer>
                {(close) => (
                    <div>
                        <span onClick={() => close()}>Click me to close the menu!</span>
                        <br /><br />
                        <span onClick={() => close({ hello: "Hello, world!" })}>Click me to close the menu with data!</span>
                    </div>
                )}
            </MenuContext.Consumer>
        </ContextMenu>
    )
}
```

If you want to avoid wrapping your component in a span that listens for the browser's context menu event, you can use attachContextMenu to create a trigger out of any component, optionally passing any extra data.

```jsx
import { h } from "preact";
import { ContextMenu, useTriggerEvents } from "preact-context-menu";

function Component() {
    return (
        <div>
            <ContextMenu id="unique_id">
                My Context Menu
            </ContextMenu>
            <div {...useTriggerEvents("unique_id")}>
                Right-click me to open context menu!
            </div>
            <div {...useTriggerEvents("unique_id", { hello: "Hello, world!" })}>
                Right-click me to open context menu with data!
            </div>
        </div>
    );
}
```

#### Opening a menu programmatically

A context menu can also be opened by calling the openContextMenu function with the context menu ID and optionally any data and/or the coordinates where the context menu should appear

A context menu will open at the last known mouse location if no coordinates are provided.

```js
import { openContextMenu } from "preact-context-menu";

openContextMenu("unique_id");

// Or with the coordinates
openContextMenu("unique_id", {}, {
    x: 30,
    y: 10,
});

// Providing extra data
openContextMenu("unique_id", { hello: "Hello, world!" });
```

### Getting data into and out of a menu

For getting data into a context menu, you can use a ContextMenuWithData, which instead of an element, takes a function that passes the data down

```jsx
import { h } from "preact";
import { ContextMenuWithData } from "preact-context-menu";

function Menu() {
    return (
        <ContextMenuWithData id="unique_id">
            {(data) => (
                <span>{JSON.stringify(data)}</span>
            )}
        </ContextMenuWithData>
    );
}
```

To get data out of a context menu containing menu items, you can use the onClose prop on the context menu to detect when the menu is closed either by clicking on a menu item, or outside the menu

When the menu is closed by clicking outside of it, onClose will be passed `undefined` as the data argument.

```jsx
import { h } from "preact";
import { useState } from "preact/hooks";
import { ContextMenu } from "preact-context-menu";

function Component() {
    const [data, setData] = useState<any>(undefined);
    const onClose = useCallback((data: any) => {
        console.log(data);
        setData(data);
    }, []);

    return (
        <div>
            <div>Returned data: {data ? data.toString() : "undefined"}</div>
            <br />
            <ContextMenu id="unique_id" onClose={onClose}>
                <ul>
                    <li>
                        <MenuItem data={1}>
                            Click me to return 1!
                        </MenuItem>
                    </li>
                    <li>
                        <MenuItem data="Hello, world!">
                            Or me to return "Hello, world!"!
                        </MenuItem>
                    </li>
                </ul>
            </ContextMenu>
        </div>
    );
}
```
