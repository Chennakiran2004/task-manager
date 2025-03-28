import styled from "styled-components";

export const Content = styled.div`
  text-align: center;
  color: white;
  padding-top: 4%;
  background-color: #0074bf;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8%;
`;

export const BoardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

export const BoardItem = styled.div`
  background: white;
  color: black;
  border-radius: 5px;
  width: 250px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

export const TaskInput = styled.input`
  width: 90%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

export const TaskButton = styled.button`
  margin-top: 5px;
  padding: 5px 10px;
  background: blue;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: darkblue;
  }
`;

export const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;

  li {
    background: #f0f0f0;
    padding: 5px;
    margin: 3px 0;
    border-radius: 3px;
    text-align: left;
  }
`;

export const CreateBoardButton = styled.button`
  padding: 15px 25px;
  border: 2px dashed white;
  border-radius: 10px;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
