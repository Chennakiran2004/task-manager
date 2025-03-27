import styled from "styled-components";

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 150px;
  padding: 8px 0;
`;

export const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: black;
  &:hover {
    background: #f0f0f0;
  }
  &:disabled {
    color: gray;
    cursor: not-allowed;
  }
`;
