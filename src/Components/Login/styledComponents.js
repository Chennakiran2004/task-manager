import styled from "styled-components";

export const LoginMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1976ad;
  gap: 8%;
`;

export const LoginHeadingContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const LoginHeadingImage = styled.svg`
  width: 48px;
  height: 48px;
`;

export const LoginHeadingText = styled.h1`
  color: #fff;
  text-align: center;
  font-family: Pacifico;
  font-size: 48px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const LoginCardContainer = styled.div`
  border-radius: 8px;
  background: #fff;
  width: 613px;
  height: 563px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8%;
  padding: 16px;
  justify-content: center;
`;

export const LoginCardImage = styled.img`
  width: 60%;
  height: 50%;
  flex-shrink: 0;
`;

export const LoginCardText = styled.p`
  color: var(--Light-blue-gray-800, #1e293b);
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const LoginCardButton = styled.button`
  display: flex;
  padding: 12px 32px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: 24px;
  background: #1976ad;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
  text-transform: uppercase;
  border: none;
  cursor: pointer;
`;
