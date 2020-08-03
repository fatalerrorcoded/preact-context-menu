import { h, render } from "preact";
import { ContextMenu, ContextMenuTrigger } from "../index";

const TestElement = () => {
    return (
        <div>
            <ContextMenu id="yes">
                yes gay
            </ContextMenu>
            <br />
            <ContextMenuTrigger id="yes">
                ah yes
            </ContextMenuTrigger>
            <br /><br />
            <ContextMenuTrigger id="broken">
                intentionally broken
            </ContextMenuTrigger>
        </div>
    );
}

render(<TestElement />, document.body.appendChild(document.createElement("div")));
