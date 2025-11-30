import React, { useContext } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { RiRectangleLine } from "react-icons/ri";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaEraser,
  FaFont,
  FaUndoAlt,
  FaRedoAlt,
  FaDownload,
} from "react-icons/fa";
import { PiPencilSimpleLine } from "react-icons/pi";
import { TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/board-context";

const handleDownloadClick = () => {
  const canvas = document.getElementById("canvas");
  const data = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = data;
  anchor.download = "board.png";
  anchor.click();
};
const Toolbar = () => {
  const { activeToolItem, changeToolHandler, undo, redo } =
    useContext(boardContext);

  const containerClasses =
    "absolute left-1/2 top-5 px-4 py-2 flex gap-2 rounded-2xl border border-gray-600 backdrop-blur-md bg-white/10 shadow-lg z-50";

  const toolItemClasses =
    "flex justify-center items-center text-xl p-3 text-white transition-all duration-150 ease-in-out cursor-pointer rounded-xl";

  const hoverClasses =
    "hover:bg-white/20 hover:scale-110";

  const activeClasses =
    "bg-white/30 scale-110 shadow-inner text-blue-300";

  const tools = [
    { id: TOOL_ITEMS.RECTANGLE, icon: <RiRectangleLine /> },
    { id: TOOL_ITEMS.LINE, icon: <FaSlash /> },
    { id: TOOL_ITEMS.CIRCLE, icon: <FaRegCircle /> },
    { id: TOOL_ITEMS.ARROW, icon: <FaArrowRight /> },
    { id: TOOL_ITEMS.BRUSH, icon: <PiPencilSimpleLine /> },
    { id: TOOL_ITEMS.ERASER, icon: <FaEraser /> },
    { id: TOOL_ITEMS.TEXT, icon: <FaFont /> },
  ];

  return (
    <div
      className={containerClasses}
      style={{
        transform: "translateX(-50%)",
        boxShadow: "1px 0 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {tools.map(({ id, icon }) => (
        <div
          key={id}
          className={twMerge(
            clsx(toolItemClasses, hoverClasses, {
              [activeClasses]: activeToolItem === id,
            })
          )}
          onClick={() => changeToolHandler(id)}
        >
          {icon}
        </div>
      ))}

      {/* Undo Button */}
      <div
        className={twMerge(clsx(toolItemClasses, hoverClasses))}
        onClick={undo}
        title="Undo"
      >
        <FaUndoAlt />
      </div>

      {/* Redo Button */}
      <div
        className={twMerge(clsx(toolItemClasses, hoverClasses))}
        onClick={redo}
        title="Redo"
      >
        <FaRedoAlt />
      </div>
      <div
        className={twMerge(clsx(toolItemClasses, hoverClasses))}
        onClick={handleDownloadClick}
        title="Download"
      >
        <FaDownload />
      </div>
    </div>
  );
};

export default Toolbar;
