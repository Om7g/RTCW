// import {io} from "socket.io-client"
const API_BASE_URL = "http://localhost:8000/api/canvas";

// Accept token and canvasId as arguments
export const updateCanvas = async (canvasId, elements, token) => {
    try {
        console.log(token, canvasId);
        const response = await fetch(`${API_BASE_URL}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({ canvasId: canvasId, elements: elements }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Canvas updated in DB!", data);
        return data;
    } catch (error) {
        console.error("Error updating canvas:", error);
    }
};



