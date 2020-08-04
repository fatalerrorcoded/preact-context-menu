import { h, render } from "preact";
import { ContextMenu, ContextMenuTrigger } from "../index";

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
            </ul>
            <h3>Error handling.</h3>
            <ContextMenuTrigger id="broken">
                Intentionally broken, can't right-click me.
            </ContextMenuTrigger>
        </div>
    );
}

render(<TestElement />, document.body.appendChild(document.createElement("div")));
