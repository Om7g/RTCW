import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../store/authProvider";
import Board from "../Board";
import Toolbar from "../Toolbar";
import BoardProvider from "../../store/BoardProvider";
import ToolboxProvider from "../../store/ToolboxProvider";
import Toolbox from "../Toolbox";
import axios from "axios";

import { getSvgPathFromStroke } from "../../utils/element";
import getStroke from "perfect-freehand";
import { socket } from "../../socket";

const rehydrateElements = (elements) => {
  return elements.map((el) => {
    if (el.type === "BRUSH") {
      const path = new Path2D(getSvgPathFromStroke(getStroke(el.points)));
      return { ...el, path };
    }
    return el;
  });
};

function CanvasPage() {
  const { canvasId } = useParams();
  const [canvas, setCanvas] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!canvasId || !token) return;

    const fetchCanvas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/canvas/load/${canvasId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const initialElements = rehydrateElements(response.data.elements);
        setCanvas({ ...response.data, elements: initialElements });

        // Send token for socket auth
        socket.auth = { token };
        socket.connect();

        socket.emit("joinCanvas", { canvasId });

        // Clear previous listeners (to avoid stacking)
        socket.off("loadCanvas");
        socket.off("receiveDrawingUpdate");

        socket.on("loadCanvas", (elements) => {
          setCanvas((prev) => ({
            ...prev,
            elements: rehydrateElements(elements),
          }));
        });

        socket.on("receiveDrawingUpdate", (updatedElements) => {
          setCanvas((prev) => ({
            ...prev,
            elements: rehydrateElements(updatedElements),
          }));
        });

      } catch (error) {
        console.error("Failed to load Canvas", error);
      }
    };

    fetchCanvas();

    return () => {
      socket.disconnect();
    };
  }, [canvasId, token]);

  if (!canvas?.elements) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <BoardProvider initialElements={canvas.elements}>
        <ToolboxProvider>
          <Toolbar />
          <Toolbox />
          <Board />
        </ToolboxProvider>
      </BoardProvider>
    </div>
  );
}

export default CanvasPage;
