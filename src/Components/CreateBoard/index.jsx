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

const CreateBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(`${BASE_URL}api/boards`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
        setBoards([]);
      }
    };
    fetchBoards();
  }, []);

  const handleCreateBoard = async (boardTitle) => {
    if (boardTitle.trim()) {
      try {
        const response = await fetch(`${BASE_URL}api/boards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: boardTitle }),
        });

        if (!response.ok) {
          throw new Error("Failed to create board");
        }

        const newBoard = await response.json();
        setBoards([...boards, newBoard]); // Update UI
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating board:", error);
      }
    }
  };

  return (
    <Content>
      <TextContainer>
        <h2>William John's Workspace</h2>
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

        <CreateBoardButton onClick={() => setIsModalOpen(true)}>
          + Create new board
        </CreateBoardButton>
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
