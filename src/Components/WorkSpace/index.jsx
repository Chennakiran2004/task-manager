// "use client";

// import CreateBoard from "../CreateBoard";
// import Navbar from "../Navbar";
// import {
//   WorkspaceContainer,
//   Header,
//   Logo,
//   SearchBar,
//   Button,
//   Content,
//   BoardContainer,
//   CreateBoardButton,
//   HomeHeadingImage,
//   HomeHeadingContainer,
//   OrganizationButton,
//   BoardsButton,
//   HeaderRightSection,
//   InputElementContainer,
//   InputeElement,
//   SearchIcon,
//   InputAndLogoutContainer,
//   ProfileLogo,
//   HomeIcon,
//   HomeIconContainer,
// } from "./styledComponents";

// import { FaSearch } from "react-icons/fa";

// const Workspace = () => {
//   return (
//     <>
//       <Navbar />
//       <CreateBoard />
//     </>
//   );
// };

// export default Workspace;

"use client";

import { useState } from "react";
import CreateBoard from "../CreateBoard";
import Navbar from "../Navbar";
import { WorkspaceContainer } from "./styledComponents";

const Workspace = () => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

  const handleWorkspaceSelect = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
  };

  return (
    <WorkspaceContainer>
      <Navbar onWorkspaceSelect={handleWorkspaceSelect} />
      <CreateBoard workspaceId={selectedWorkspaceId} />
    </WorkspaceContainer>
  );
};

export default Workspace;
