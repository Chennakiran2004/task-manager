"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Header,
  HomeIconContainer,
  HeaderRightSection,
  OrganizationButton,
  BoardsButton,
  HomeHeadingContainer,
  HomeHeadingImage,
  Logo,
  InputElementContainer,
  InputeElement,
  InputAndLogoutContainer,
  ProfileLogo,
} from "../WorkSpace/styledComponents";

import { DropdownItem, DropdownMenu } from "./styledComponents";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "@/Constants/apiConstants";
const Navbar = () => {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  const handleHomeClick = () => {
    router.push("/workspace");
  };

  const handleLogoutClick = () => {
    router.push("/");
  };

  const handleBoardClick = (boardId) => {
    router.push(`/board/${boardId}`);
    setDropdownOpen(false);
  };

  return (
    <Header>
      <HeaderRightSection>
        <HomeIconContainer onClick={handleHomeClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.99 20.0004H16V13.0004C16 12.4474 15.552 12.0004 15 12.0004H9C8.447 12.0004 8 12.4474 8 13.0004V20.0004H5L5.006 11.5834L11.998 4.43245L19 11.6244L18.99 20.0004ZM10 20.0004H14V14.0004H10V20.0004ZM20.424 10.1854L12.715 2.30145C12.338 1.91645 11.662 1.91645 11.285 2.30145L3.575 10.1864C3.21 10.5614 3 11.0854 3 11.6244V20.0004C3 21.1034 3.847 22.0004 4.888 22.0004H9H15H19.111C20.152 22.0004 21 21.1034 21 20.0004V11.6244C21 11.0854 20.79 10.5614 20.424 10.1854Z"
              fill="white"
            />
          </svg>
        </HomeIconContainer>
        {/* <OrganizationButton>Organization ⌄</OrganizationButton> */}
        <div style={{ position: "relative" }}>
          <BoardsButton onClick={() => setDropdownOpen(!isDropdownOpen)}>
            📋 Boards ⌄
          </BoardsButton>

          {isDropdownOpen && (
            <DropdownMenu>
              {boards.length > 0 ? (
                boards.map((board) => (
                  <DropdownItem
                    key={board._id}
                    onClick={() => handleBoardClick(board._id)}
                  >
                    {board.title}
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem disabled>No Boards Available</DropdownItem>
              )}
            </DropdownMenu>
          )}
        </div>
      </HeaderRightSection>

      <HomeHeadingContainer>
        <HomeHeadingImage
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <rect width="48" height="48" rx="4.45161" fill="white" />
          <rect x="8" y="8" width="14" height="32" rx="2" fill="#1976AD" />
          <rect x="26" y="8" width="14" height="20" rx="2" fill="#1976AD" />
        </HomeHeadingImage>
        <Logo>Task Manager</Logo>
      </HomeHeadingContainer>
      <InputAndLogoutContainer>
        {/* <InputElementContainer>
          <InputeElement type="text" placeholder="Search" />
          <FaSearch />
        </InputElementContainer> */}
        <h4 onClick={handleLogoutClick}>Logout</h4>
        <ProfileLogo src="/3.png" />
      </InputAndLogoutContainer>
    </Header>
  );
};

export default Navbar;
