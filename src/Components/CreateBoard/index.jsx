// "use client";

// import { useState } from "react";
// import {
//   Content,
//   BoardContainer,
//   CreateBoardButton,
//   BoardItem,
// } from "./styeldComponents";
// import BoardModal from "../BoardModel";

// const CreateBoard = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [boards, setBoards] = useState([]);

//   const handleCreateBoard = (boardTitle) => {
//     if (boardTitle.trim()) {
//       setBoards([...boards, boardTitle]);
//       setIsModalOpen(false);
//     }
//   };
//   return (
//     <Content>
//       <h2>William John's Workspace</h2>
//       <p>
//         {boards.length === 0
//           ? "You don't have any boards in your workspace"
//           : "Your Boards"}
//       </p>

//       <BoardContainer>
//         {boards.map((board, index) => (
//           <BoardItem key={index}>{board}</BoardItem>
//         ))}

//         <CreateBoardButton onClick={() => setIsModalOpen(true)}>
//           + Create new board
//         </CreateBoardButton>
//       </BoardContainer>

//       {isModalOpen && (
//         <BoardModal
//           onClose={() => setIsModalOpen(false)}
//           onCreate={handleCreateBoard}
//         />
//       )}
//     </Content>
//   );
// };

// export default CreateBoard;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Content,
  BoardContainer,
  CreateBoardButton,
  BoardItem,
} from "./styeldComponents";
import BoardModal from "../BoardModel";

const CreateBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    setBoards(storedBoards);
  }, []);

  const handleCreateBoard = (boardTitle) => {
    if (boardTitle.trim()) {
      const newBoards = [...boards, boardTitle];
      setBoards(newBoards);
      localStorage.setItem("boards", JSON.stringify(newBoards));
      setIsModalOpen(false);
    }
  };

  return (
    <Content>
      <h2>William John's Workspace</h2>
      <p>{boards.length === 0 ? "No boards found" : "Your Boards"}</p>

      <BoardContainer>
        {boards.map((board, index) => (
          <BoardItem key={index} onClick={() => router.push(`/board/${board}`)}>
            {board}
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
