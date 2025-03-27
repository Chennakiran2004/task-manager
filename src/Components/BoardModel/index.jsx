import { useState } from "react";
import {
  ModalOverlay,
  ModalContainer,
  CloseButton,
  InputField,
  CreateButton,
  BoardInputContainer,
  User,
} from "./styledComponents";

const BoardModal = ({ onClose, onCreate }) => {
  const [boardTitle, setBoardTitle] = useState("");

  const handleCreate = () => {
    if (boardTitle.trim()) {
      onCreate(boardTitle);
      setBoardTitle("");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.4142 12.0002L17.7072 7.70725C18.0982 7.31625 18.0982 6.68425 17.7072 6.29325C17.3162 5.90225 16.6842 5.90225 16.2933 6.29325L12.0002 10.5862L7.70725 6.29325C7.31625 5.90225 6.68425 5.90225 6.29325 6.29325C5.90225 6.68425 5.90225 7.31625 6.29325 7.70725L10.5862 12.0002L6.29325 16.2933C5.90225 16.6842 5.90225 17.3162 6.29325 17.7072C6.48825 17.9022 6.74425 18.0002 7.00025 18.0002C7.25625 18.0002 7.51225 17.9022 7.70725 17.7072L12.0002 13.4142L16.2933 17.7072C16.4882 17.9022 16.7443 18.0002 17.0002 18.0002C17.2562 18.0002 17.5122 17.9022 17.7072 17.7072C18.0982 17.3162 18.0982 16.6842 17.7072 16.2933L13.4142 12.0002Z"
              fill="#64748B"
            />
          </svg>
        </CloseButton>
        <BoardInputContainer>
          <h3>Add board title</h3>
          <InputField
            type="text"
            placeholder="Enter board title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
          />
          <User>Willam John’s Workspace</User>
          <CreateButton onClick={handleCreate}>Create Board</CreateButton>
        </BoardInputContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BoardModal;
