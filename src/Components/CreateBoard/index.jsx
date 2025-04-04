"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Content,
  BoardContainer,
  CreateBoardButton,
  BoardItem,
  TextContainer,
} from "./styeldComponents";
import BoardModal from "../BoardModel";
import { BASE_URL } from "@/Constants/apiConstants";

const CreateBoard = ({ workspaceId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!workspaceId) {
        setWorkspaceName("");
        setBoards([]);
        return;
      }

      try {
        const [boardsResponse, workspacesResponse] = await Promise.all([
          fetch(`${BASE_URL}api/boards?workspaceId=${workspaceId}`, {
            method: "GET",
          }),
          fetch(`${BASE_URL}api/workspaces`, {
            method: "GET",
          }),
        ]);

        if (!boardsResponse.ok) {
          throw new Error("Failed to fetch boards");
        }
        const boardsData = await boardsResponse.json();
        setBoards(boardsData);

        if (!workspacesResponse.ok) {
          throw new Error("Failed to fetch workspaces");
        }
        const workspacesData = await workspacesResponse.json();
        const workspace = workspacesData.find((ws) => ws._id === workspaceId);
        setWorkspaceName(workspace ? workspace.name : "Unknown Workspace");
      } catch (error) {
        console.error("Error fetching data:", error);
        setBoards([]);
        setWorkspaceName("Error Loading Name");
      }
    };

    fetchData();
  }, [workspaceId]);

  const handleCreateBoard = async (boardTitle) => {
    if (!boardTitle.trim() || !workspaceId) {
      alert("Board title and workspace ID are required");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: boardTitle, workspaceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create board");
      }

      const newBoard = await response.json();
      setBoards([...boards, newBoard]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
      alert(error.message);
    }
  };

  return (
    <Content>
      <TextContainer>
        <h2>
          {workspaceId
            ? `${workspaceName} Boards`
            : "Select a Workspace to View Boards"}
        </h2>
        <p>{boards.length === 0 ? "No boards found" : "Your Boards"}</p>
      </TextContainer>

      <BoardContainer>
        {boards.map((board) => (
          <BoardItem
            key={board._id}
            onClick={() => router.push(`/board/${board._id}`)}
          >
            {board.title}
          </BoardItem>
        ))}

        {workspaceId && (
          <CreateBoardButton onClick={() => setIsModalOpen(true)}>
            + Create new board
          </CreateBoardButton>
        )}
      </BoardContainer>

      {isModalOpen && (
        <BoardModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </Content>
  );
};

export default CreateBoard;
