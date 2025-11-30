import React, { useContext } from "react";
import clsx from "clsx";
import {
  COLORS,
  FILL_TOOL_TYPES,
  SIZE_TOOL_TYPES,
  STROKE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(boardContext);
  const { toolboxState, changeStroke, changeFill, changeSize } =
    useContext(toolboxContext);

  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size = toolboxState[activeToolItem]?.size;

  return (
    <div
      className="absolute top-1/2 left-5 text-sm px-5 py-4 rounded-2xl shadow-lg border border-gray-600 bg-white/10 backdrop-blur-md text-white space-y-6 z-50"
      style={{ transform: "translateY(-50%)" }}
    >
      {/* Stroke */}
      {STROKE_TOOL_TYPES.includes(activeToolItem) && (
        <div>
          <div className="block mb-2 font-semibold">Stroke</div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => changeStroke(activeToolItem, e.target.value)}
              className="w-6 h-6 rounded-full border-none cursor-pointer"
              title="Pick stroke color"
            />
            {Object.keys(COLORS).map((k) => (
              <div
                key={k}
                className={clsx(
                  "inline-block w-5 h-5 rounded-full border border-white/20 cursor-pointer transition hover:scale-110",
                  strokeColor === COLORS[k] && "ring-2 ring-blue-400"
                )}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeStroke(activeToolItem, COLORS[k])}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fill */}
      {FILL_TOOL_TYPES.includes(activeToolItem) && (
        <div>
          <div className="block mb-2 font-semibold">Fill</div>
          <div className="flex flex-wrap items-center gap-2">
            {fillColor === null ? (
              <div
                className="w-6 h-6 border border-white/20 bg-transparent flex items-center justify-center cursor-pointer relative rounded hover:scale-110"
                onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
                title="Use fill"
              >
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-red-500 rotate-45" />
              </div>
            ) : (
              <input
                type="color"
                value={fillColor}
                onChange={(e) => changeFill(activeToolItem, e.target.value)}
                className="w-6 h-6 rounded-full border-none cursor-pointer"
                title="Pick fill color"
              />
            )}

            <div
              className={clsx(
                "w-6 h-6 border border-white/20 bg-transparent flex items-center justify-center cursor-pointer relative rounded hover:scale-110",
                fillColor === null && "ring-2 ring-blue-400"
              )}
              onClick={() => changeFill(activeToolItem, null)}
              title="No fill"
            >
              <div className="w-4 h-4 bg-gray-400 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-red-600 rotate-45" />
              </div>
            </div>

            {Object.keys(COLORS).map((k) => (
              <div
                key={k}
                className={clsx(
                  "inline-block w-5 h-5 rounded-full border border-white/20 cursor-pointer transition hover:scale-110",
                  fillColor === COLORS[k] && "ring-2 ring-blue-400"
                )}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeFill(activeToolItem, COLORS[k])}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {SIZE_TOOL_TYPES.includes(activeToolItem) && (
        <div>
          <div className="block mb-2 font-semibold">
            {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
          </div>
          <input
            type="range"
            min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
            max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
            step={1}
            value={size}
            onChange={(e) => changeSize(activeToolItem, e.target.value)}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default Toolbox;
