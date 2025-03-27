import styled from "styled-components";

export const WorkspaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0079bf;
  color: white;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
  background-color: #0079bf;
`;

export const HomeHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HomeHeadingImage = styled.svg`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

export const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: Pacifico;
`;

export const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Styled "Organization" dropdown button
export const OrganizationButton = styled.button`
  background-color: #5f98c6;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: #4a89c0;
  }
`;

// Styled "Boards" button
export const BoardsButton = styled.button`
  background-color: #1b92e3;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: #1778c8;
  }
`;

export const Content = styled.div`
  text-align: center;
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

export const InputElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #5f98c6;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: #4a89c0;
  }
`;

export const InputeElement = styled.input`
  background: none;
  border: none;
  color: white;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7); /* Change this color */
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 10px;
  color: white;
  font-size: 16px;
  pointer-events: none;
`;

export const InputAndLogoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const ProfileLogo = styled.img``;

export const HomeIcon = styled.svg``;

export const HomeIconContainer = styled.div`
  background-color: #5f98c6;
  color: white;
  border: none;
  font-size: 14px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: #4a89c0;
  }
`;
