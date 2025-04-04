import styled from "styled-components";
import { motion } from "framer-motion";

export const BoardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  overflow-x: auto;
  background: #0079bf;
  min-height: 100vh;
`;

export const Column = styled.div`
  background: #f0f0f0;
  width: 280px;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

export const ColumnTitle = styled.h3`
  color: var(--Light-blue-gray-600, #475569);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  text-align: left;
`;

export const TaskPlaceholder = styled.div`
  color: gray;
  font-size: 14px;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const TaskInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
`;

export const TaskInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  fill: #fff;
  color: black;
  filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.12));
  background: none;

  &::placeholder {
    color: black;
  }
`;

export const TaskButtonContainer = styled.div`
  display: flex;
  gap: 5px;
`;

export const TaskButton = styled.button`
  flex: 1;
  padding: 6px;
  background: #0079bf;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;

  &:hover {
    background: #005f8a;
  }
`;

export const CancelButton = styled.button`
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: gray;

  &:hover {
    color: black;
  }
`;

export const TaskList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin-top: 10px;
  background: none;

  li {
    background: #f0f0f0;
    padding: 8px;
    margin: 5px 0;
    border-radius: 5px;
    text-align: left;
    color: black;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
`;

export const AddListButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  width: 280px;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

export const ReorderItem = styled(motion.li)`
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

export const TaskCard = styled.div`
  background-color: #f4f5f7;
  border-radius: 3px;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  font-size: 14px;
  color: #172b4d;
`;

export const ListTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 5px 0;
`;

export const ListOptionsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #172b4d;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #005f8a;
  }
`;

export const ListOptionsMenu = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  right: 0;
  top: 25px;
  z-index: 10;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  color: black;
`;

export const ListOption = styled.div`
  padding: 6px 10px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #f0f0f0;
  }
`;
