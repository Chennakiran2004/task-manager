"use client";

import { useRouter } from "next/navigation";
import {
  LoginCardButton,
  LoginCardContainer,
  LoginCardImage,
  LoginCardText,
  LoginHeadingContainer,
  LoginHeadingImage,
  LoginHeadingText,
  LoginMainContainer,
} from "./styledComponents";

const Login = () => {
  const router = useRouter();
  const handleHomeClick = () => {
    console.log("Home");
    router.push("/workspace");
  };

  return (
    <LoginMainContainer>
      <LoginHeadingContainer>
        <LoginHeadingImage
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <rect width="48" height="48" rx="4.45161" fill="white" />
          <rect x="8" y="8" width="14" height="32" rx="2" fill="#1976AD" />
          <rect x="26" y="8" width="14" height="20" rx="2" fill="#1976AD" />
        </LoginHeadingImage>
        <LoginHeadingText>Task Manager</LoginHeadingText>
      </LoginHeadingContainer>
      <LoginCardContainer>
        <LoginCardImage src="/Group 7405.svg" />
        <LoginCardText>Task tracking for your every needs</LoginCardText>
        <LoginCardButton onClick={handleHomeClick}>
          LOGIN IN WITH TRELLO
        </LoginCardButton>
      </LoginCardContainer>
    </LoginMainContainer>
  );
};

export default Login;
