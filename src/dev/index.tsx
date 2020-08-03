import { h, render } from "preact";

const TestElement = () => {
    return (
        <div>
            ah yes
        </div>
    );
}

render(<TestElement />, document.body.appendChild(document.createElement("div")));
