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

## Example

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
