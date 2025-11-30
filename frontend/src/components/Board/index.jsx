import { useContext, useEffect, useRef, useLayoutEffect } from "react";
import rough from "roughjs";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";
import { updateCanvas } from "../../utils/api";
import { AuthContext } from "../../store/authProvider";
import { socket } from "../../socket"; // Make sure socket is properly initialized and exported

function Board() {
    const canvasRef = useRef(null);
    const textAreaRef = useRef(null);
    const { elements, boardMouseDownHandler, boardMouseMoveHandler, boardMouseUpHandler, toolActionType, textAreaBlurHandler, undo, redo } = useContext(boardContext);
    const { toolboxState } = useContext(toolboxContext);
    const { token } = useContext(AuthContext);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Init logic if needed
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === "z") {
                undo();
            } else if (event.ctrlKey && event.key === "y") {
                redo();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [undo, redo]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        const roughCanvas = rough.canvas(canvas);

        elements.forEach((element) => {
            switch (element.type) {
                case TOOL_ITEMS.LINE:
                case TOOL_ITEMS.RECTANGLE:
                case TOOL_ITEMS.CIRCLE:
                case TOOL_ITEMS.ARROW:
                    roughCanvas.draw(element.roughEle);
                    break;
                case TOOL_ITEMS.BRUSH:
                    context.fillStyle = element.stroke;
                    context.fill(element.path);
                    break;
                case TOOL_ITEMS.TEXT:
                    context.textBaseline = "top";
                    context.font = `${element.size || 20}px 'Caveat', cursive`;
                    context.fillStyle = element.stroke;
                    context.fillText(element.text, element.x1, element.y1);
                    break;
                default:
                    console.warn("Unrecognized element type:", element.type);
            }
        });
    }, [elements]);

    useEffect(() => {
        if (toolActionType === TOOL_ACTION_TYPES.WRITING && textAreaRef.current) {
            setTimeout(() => textAreaRef.current.focus(), 0);
        }
    }, [toolActionType]);

    const handleBoardMouseDown = (event) => {
        boardMouseDownHandler(event, toolboxState);
    };

    const handleBoardMouseUp = (event) => {
        boardMouseUpHandler();
        const canvasId = localStorage.getItem("canvasId");
        if (canvasId && elements.length) {
            socket.emit("drawingUpdate", { canvasId, elements });
            // updateCanvas(canvasId, elements, token); // If using HTTP fallback
        }
    };

    const handleBoardMouseMove = (event) => {
        boardMouseMoveHandler(event);
    };

    const lastElement = elements[elements.length - 1];

    return (
        <>
            {toolActionType === TOOL_ACTION_TYPES.WRITING && lastElement && (
                <textarea
                    ref={textAreaRef}
                    className="fixed border-none bg-transparent resize-none outline-none p-0 m-0 w-auto h-auto overflow-hidden text-inherit font-caveat"
                    style={{
                        top: lastElement.y1,
                        left: lastElement.x1,
                        fontSize: `${lastElement.size || 20}px`,
                        color: lastElement.stroke,
                    }}
                    onBlur={(event) => textAreaBlurHandler(event.target.value)}
                />
            )}
            <canvas
                id="canvas"
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ backgroundColor: "#1c1c1e" }}
                onMouseDown={handleBoardMouseDown}
                onMouseUp={handleBoardMouseUp}
                onMouseMove={handleBoardMouseMove}
            />
        </>
    );
}

export const useBoard = () => useContext(boardContext);
export default Board;
