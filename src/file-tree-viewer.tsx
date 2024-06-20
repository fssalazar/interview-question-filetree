import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { readINode } from "./api/read-inode";
import { useEffect, useState } from "react";
import { INode } from "./types/file-types";

export function FileTreeViewer() {
  const [rootNode, setRootNode] = useState<INode | null>(null);
  const [nodes, setNodes] = useState<Map<string, INode>>(new Map());
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const rootData = await readINode("root");
      setRootNode(rootData);
      setNodes(new Map([["root", rootData]]));
      setOpenNodes(new Set(["root"]));
    };
    fetchData();
  }, []);

  const fetchNode = async (id: string) => {
    if (!nodes.has(id)) {
      const data = await readINode(id);
      setNodes((prev) => new Map(prev).set(id, data));
      return data;
    }
    return nodes.get(id) as INode;
  };

  const toggleNode = (id: string) => {
    setOpenNodes((prev) => {
      const newOpenNodes = new Set(prev);
      if (newOpenNodes.has(id)) {
        newOpenNodes.delete(id);
      } else {
        newOpenNodes.add(id);
      }
      return newOpenNodes;
    });
  };

  const renderNode = (node: INode) => {
    if (node.type === "file") {
      return (
        <div key={node.id} className="flex items-center">
          <FileIcon className="h-5 w-5" />
          {node.name}
        </div>
      );
    }

    if (node.type === "directory") {
      const isOpen = openNodes.has(node.id);
      return (
        <div key={node.id}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleNode(node.id)}>
            {isOpen ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            {isOpen ? <FolderOpenIcon className="h-5 w-5" /> : <FolderIcon className="h-5 w-5" />}
            <div>{node.name}</div>
          </div>
          {isOpen && (
            <div className="pl-10">
              {node.children?.map((childId) => {
                const childNode = nodes.get(childId);
                if (!childNode) {
                  fetchNode(childId);
                  return <div key={childId}>Loading...</div>;
                }
                return renderNode(childNode);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded p-6 space-y-6">
      <div className="grid">
        <h1 className="text-lg font-medium">File Tree Viewer</h1>
        <p className="max-w-md text-gray-500">
          Create a file tree viewer component that displays a directory structure. The component should be able to
          expand and collapse folders, and should display the file and folder icons.
        </p>
      </div>

      <div className="grid">
        <span className="text-base font-medium">Icons</span>
        <p className="text-gray-500">For your convenience, here are the icons you can use</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center justify-center border rounded p-3">
            <FileIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <FolderIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <FolderOpenIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <ChevronRightIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <p className="max-w-md border-l-[3px] border-l-gray-300 pl-4 py-1 text-gray-500">
        When you're ready, delete the contents of the
        <br />
        <code className="bg-gray-600 text-gray-100 font-medium px-1 py-0.5 rounded text-sm">
          ./src/file-tree-viewer.tsx
        </code>{" "}
        file and start building.
      </p>
      <div>{rootNode && renderNode(rootNode)}</div>
    </div>
  );
}
