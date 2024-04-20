import { useState } from "react";
import ReactFlow, { MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { FiX } from "react-icons/fi";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const addNode = () => {
    const newNodeId = `node-${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      data: { label: `New Node ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 400 },
    };
    setNodes([...nodes, newNode]);
    const existingNodeId = "2"; // Change this to the ID of the existing node you want to connect to
    const newEdge = {
      id: `e${newNodeId}-${existingNodeId}`,
      source: newNodeId,
      target: existingNodeId,
      animated: true,
    };
    setEdges([...edges, newEdge]);
  };

  const handleElementClick = (event, node) => {
    event.preventDefault();
    setSelectedNode(node);
  };
  const handleNodeMouseEnter = (event, node) => {
    event.preventDefault();
    const updatedNode = {
      ...node,
      data: { ...node.data, showDeleteIcon: true },
    };
    const updatedNodes = nodes.map((n) => (n.id === node.id ? updatedNode : n));
    setNodes(updatedNodes);
  };

  const handleNodeMouseLeave = (event, node) => {
    event.preventDefault();
    const updatedNode = {
      ...node,
      data: { ...node.data, showDeleteIcon: false },
    };
    const updatedNodes = nodes.map((n) => (n.id === node.id ? updatedNode : n));
    setNodes(updatedNodes);
  };

  const handleDeleteNode = (event, nodeId) => {
    event.preventDefault();
    const updatedNodes = nodes.filter((node) => node.id !== nodeId);
    const updatedEdges = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNode(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "200px",
        }}
      >
        <button style={{ color: "red" }} onClick={addNode}>
          Add Node
        </button>
      </div>
      <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={handleElementClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
        >
          <MiniMap />
          <Controls />
          {nodes.map(
            (node) =>
              node.data.showDeleteIcon && (
                <div
                  style={{ position: "absolute", top: node.position.x }}
                  onClick={handleDeleteNode}
                >
                  X
                </div>
              )
          )}
        </ReactFlow>
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            width: "200px",
            height: "100%",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderLeft: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {selectedNode && (
            <div style={{ flex: 1, backgroundColor: "#e5e5e5" }}>
              <h3>Update the node here</h3>
              <input
                type="text"
                placeholder="Enter title"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                onClick={() => {
                  if (selectedNode) {
                    setNodes((nodes) =>
                      nodes.map((node) =>
                        node.id === selectedNode.id
                          ? {
                              ...node,
                              data: { ...node.data, label: inputValue },
                            }
                          : node
                      )
                    );
                  }
                  console.log(selectedNode.data);
                }}
              >
                Update Node
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Flow;
