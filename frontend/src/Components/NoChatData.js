import React from "react";

const NoChatData = ({ theme }) => {
  return (
    <>
      <h1 className={(theme ? "dark-mode" : "") + " no-chat-found"}>
        No chat found. <br /> Type your message below
      </h1>
    </>
  );
};

export default NoChatData;
