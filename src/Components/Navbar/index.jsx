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

const Navbar = ({ onWorkspaceSelect }) => {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [isBoardsDropdownOpen, setBoardsDropdownOpen] = useState(false);
  const [isWorkspacesDropdownOpen, setWorkspacesDropdownOpen] = useState(false);
  const [isWorkspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${BASE_URL}api/workspaces`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch workspaces");
        }
        const data = await response.json();
        setWorkspaces(data);
        if (data.length > 0 && !selectedWorkspaceId) {
          setSelectedWorkspaceId(data[0]._id);
          onWorkspaceSelect(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        setWorkspaces([]);
      }
    };

    fetchWorkspaces();
  }, [selectedWorkspaceId, onWorkspaceSelect]);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!selectedWorkspaceId) return;
      try {
        const response = await fetch(
          `${BASE_URL}api/boards?workspaceId=${selectedWorkspaceId}`,
          {
            method: "GET",
          }
        );
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
  }, [selectedWorkspaceId]);

  const handleHomeClick = () => {
    router.push("/workspace");
  };

  const handleLogoutClick = () => {
    router.push("/");
  };

  const handleBoardClick = (boardId) => {
    router.push(`/board/${boardId}`);
    setBoardsDropdownOpen(false);
  };

  const handleWorkspaceClick = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
    onWorkspaceSelect(workspaceId);
    setWorkspacesDropdownOpen(false);
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      alert("Workspace name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/workspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorkspaceName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create workspace: ${errorData.message}`);
      }

      const newWorkspace = await response.json();
      setWorkspaces((prev) => [...prev, newWorkspace]);
      setNewWorkspaceName("");
      setWorkspaceModalOpen(false);
      setWorkspacesDropdownOpen(true);
      setSelectedWorkspaceId(newWorkspace._id);
      onWorkspaceSelect(newWorkspace._id);
    } catch (error) {
      console.error("Error creating workspace:", error.message);
      alert(error.message);
    }
  };

  const handleCreateWorkspaceClick = () => {
    setWorkspaceModalOpen(true);
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

        <div style={{ position: "relative" }}>
          <BoardsButton
            onClick={() => setBoardsDropdownOpen(!isBoardsDropdownOpen)}
          >
            📋 Boards ⌄
          </BoardsButton>
          {isBoardsDropdownOpen && (
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

        {/* Workspaces Dropdown */}
        <div style={{ position: "relative" }}>
          <OrganizationButton
            onClick={() => setWorkspacesDropdownOpen(!isWorkspacesDropdownOpen)}
          >
            🏢 Workspaces ⌄
          </OrganizationButton>
          {isWorkspacesDropdownOpen && (
            <DropdownMenu>
              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <DropdownItem
                    key={workspace._id}
                    onClick={() => handleWorkspaceClick(workspace._id)}
                    style={{
                      backgroundColor:
                        selectedWorkspaceId === workspace._id
                          ? "#e0e0e0"
                          : "transparent",
                    }}
                  >
                    {workspace.name}
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem disabled>No Workspaces Available</DropdownItem>
              )}
              <DropdownItem onClick={handleCreateWorkspaceClick}>
                + Create Workspace
              </DropdownItem>
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
        <h4 onClick={handleLogoutClick}>Logout</h4>
        <ProfileLogo src="/3.png" />
      </InputAndLogoutContainer>

      {isWorkspaceModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <h3>Create New Workspace</h3>
          <input
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Enter workspace name"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateWorkspace();
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCreateWorkspace}
              style={{
                padding: "8px 16px",
                backgroundColor: "#1976AD",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Create
            </button>
            <button
              onClick={() => setWorkspaceModalOpen(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {isWorkspaceModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setWorkspaceModalOpen(false)}
        />
      )}
    </Header>
  );
};

export default Navbar;
