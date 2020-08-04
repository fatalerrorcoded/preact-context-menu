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

### Opening and closing the menus

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

A context menu can also be opened by calling the openContextMenu function with the context menu ID and optionally the coordinates where the context menu should appear

```js
import { openContextMenu } from "preact-context-menu";

openContextMenu("unique_id");

// Or with the coordinates
openContextMenu("unique_id", {
    x: 30,
    y: 10,
})
```
