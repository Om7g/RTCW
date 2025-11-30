import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/authProvider";

function DashBoard() {
  const { token, setToken } = useContext(AuthContext);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [canvases, setCanvases] = useState([]);
  const [newCanvasName, setNewCanvasName] = useState("");
  const [shareEmails, setShareEmails] = useState({});
  const [shareErrors, setShareErrors] = useState({});
  const [shareSuccess, setShareSuccess] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (!token) return;

    const fetchUser = async () => {
      try {
        console.log(token);
        const res = await fetch("http://localhost:8000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUserName(data.name);
        else console.error("Failed to fetch user:", data.message);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const fetchCanvases = async () => {
      try {
        console.log(token);
        const res = await fetch("http://localhost:8000/api/canvas/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCanvases(data);
        else console.error("Failed to fetch canvases:", data.message);
      } catch (err) {
        console.error("Canvas Fetch Error:", err);
      }
    };

    fetchUser();
    fetchCanvases();
  }, [token]);

  const handleLogout = () => {
    setToken("");
    navigate("/login");
  };

  const handleCreateCanvas = async () => {
    if (!newCanvasName.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/api/canvas/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCanvasName }),
      });

      const data = await res.json();
      if (res.ok) {
        setCanvases((prev) => [...prev, { name: newCanvasName, _id: data.canvasId, owner: { name: userName } }]);
        setNewCanvasName("");
      } else {
        console.error("Failed to create canvas:", data.message);
      }
    } catch (err) {
      console.error("Canvas Create Error:", err);
    }
  };

  const handleDeleteCanvas = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/canvas/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Delete failed:", data.error);
        return;
      }

      setCanvases((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting canvas:", error);
    }
  };

  const handleShareCanvas = async (canvasId) => {
    const email = shareEmails[canvasId];
    if (!email) return;

    try {
      const res = await fetch(`http://localhost:8000/api/canvas/share/${canvasId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ canvasId, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setShareSuccess((prev) => ({ ...prev, [canvasId]: "Canvas shared successfully!" }));
        setShareErrors((prev) => ({ ...prev, [canvasId]: "" }));
        setShareEmails((prev) => ({ ...prev, [canvasId]: "" }));
        setTimeout(() => {
          setShareSuccess((prev) => ({ ...prev, [canvasId]: "" }));
        }, 3000);
      } else {
        setShareErrors((prev) => ({ ...prev, [canvasId]: data.error }));
        setShareSuccess((prev) => ({ ...prev, [canvasId]: "" }));
      }
    } catch (err) {
      setShareErrors((prev) => ({ ...prev, [canvasId]: "An error occurred while sharing" }));
    }
  };

  return (
    <>
      <div className="flex justify-end max-w-7xl mx-auto mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="min-h-screen bg-gray-100 text-gray-800 px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-xl text-gray-600">What are you about to cook today?</p>
        </div>

        {/* Create Canvas */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCanvasName}
              onChange={(e) => setNewCanvasName(e.target.value)}
              placeholder="Enter canvas name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleCreateCanvas}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Your Canvases</h2>
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Canvas Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Owned By</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {canvases.map((canvas, index) => (
                  <tr key={canvas._id}>
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{canvas.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{canvas.owner?.name || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center flex-wrap">
                        <button
                          onClick={() => {
                            localStorage.setItem("canvasId", canvas._id);
                            navigate(`/load/${canvas._id}`);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Open
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteCanvas(canvas._id)}
                        >
                          Delete
                        </button>
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2 items-center">
                            <input
                              type="email"
                              placeholder="Enter email to share"
                              value={shareEmails[canvas._id] || ""}
                              onChange={(e) =>
                                setShareEmails((prev) => ({ ...prev, [canvas._id]: e.target.value }))
                              }
                              className="px-2 py-1 border border-gray-300 rounded-md"
                            />
                            <button
                              onClick={() => handleShareCanvas(canvas._id)}
                              className="text-green-600 hover:underline"
                            >
                              Share
                            </button>
                          </div>
                          {shareErrors[canvas._id] && (
                            <p className="text-red-500 text-sm">{shareErrors[canvas._id]}</p>
                          )}
                          {shareSuccess[canvas._id] && (
                            <p className="text-green-600 text-sm">{shareSuccess[canvas._id]}</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {canvases.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-center text-sm text-gray-500" colSpan="4">
                      No canvases found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
