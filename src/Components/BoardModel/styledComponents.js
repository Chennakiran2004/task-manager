import styled from "styled-components";

// Page Content
export const Content = styled.div`
  text-align: center;
  color: white;
  margin-top: 20px;
`;

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const CreateBoardButton = styled.button`
  padding: 15px 25px;
  border: 2px dashed white;
  border-radius: 10px;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  display: flex;
  width: 514px;
  height: 245px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 4px;
  background: #fff;
  position: relative;

  /* Shadow 3 */
  box-shadow: 0px 8px 40px 0px rgba(0, 33, 89, 0.16);
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const InputField = styled.input`
  width: 352px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #a7b1bf;
  border: none;

  &::placeholder {
    padding-left: 10px;
    color: #ffff;
  }
`;

export const CreateButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: blue;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darkblue;
  }
`;

export const BoardInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
  width: 70%;
  padding-left: 8%;
`;

export const User = styled.p`
  color: var(--Light-blue-gray-600, #475569);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
`;
