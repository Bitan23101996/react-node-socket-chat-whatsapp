import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import NoChatData from "./NoChatData";
import debounce from "lodash/debounce";

const ChatBox = ({ socket, authorName, room }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [toggleTheme, setToggleTheme] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sentMessage = async () => {
    if (currentMsg !== "") {
      let msgPayload = {
        authorName,
        room,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("sent_message", msgPayload);
      setMessageList((prevMsg) => [...prevMsg, msgPayload]);
      setCurrentMsg("");
    }
  };

  const toggleSwitch = (event) => {
    console.log(event.target.checked);
    setToggleTheme(event.target.checked);
  };
  useEffect(() => {
    socket.on("receive_message", (msgData) => {
      setMessageList((prevList) => [...prevList, msgData]);
    });
  }, [socket]);

  const handleIsTyping = debounce(() => {
    // continually delays setting "isTyping" to false for 3000ms until the user has stopped typing and the delay runs out
    setIsTyping(false);
  }, 3000);

  return (
    <>
      <div className={"container content " + (toggleTheme ? "dark-mode " : "")}>
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="card">
              <div className="card-header">
                {isTyping ? (
                  <label>{authorName} is typing...</label>
                ) : (
                  <label>Chat</label>
                )}
                {/*------------ Toggle Button ----------*/}
                <label className="switch">
                  <input type="checkbox" onClick={toggleSwitch} />
                  <span className="slider round"></span>
                </label>
                {/*------------ Toggle Button ----------*/}
              </div>
              <ScrollToBottom
                className="chat-card-body"
                followButtonClassName="scroll-btn"
              >
                <div className="card-body ">
                  {/* chat-card-body */}
                  <ul className="chat-list">
                    {messageList.length > 0 &&
                      messageList.map((data, index) => {
                        return (
                          <li
                            key={index}
                            className={
                              data.authorName === authorName ? "out" : "in"
                            }
                          >
                            <div className="chat-img">
                              <img
                                alt="Avtar"
                                src={
                                  data.authorName === authorName
                                    ? "/images/avatar1.png"
                                    : "/images/female.jpg"
                                }
                              />
                            </div>
                            <div className="chat-body">
                              <div className="chat-message">
                                <h5> {data.authorName} </h5>
                                <p> {data.message} </p>
                                <label
                                  className={
                                    "text-muted msg-time " +
                                    (data.authorName === authorName
                                      ? "left "
                                      : "right ")
                                  }
                                >
                                  {data.time}
                                </label>
                              </div>
                            </div>
                          </li>
                        );
                      })}

                    {messageList.length === 0 && (
                      <NoChatData theme={toggleTheme} />
                    )}
                  </ul>
                </div>
              </ScrollToBottom>
            </div>

            {/*----------------- Message Type Section------------------ */}
            <div className="msg-type-section">
              <input
                type="text"
                name="currentMsg"
                value={currentMsg}
                placeholder="Type message..."
                onKeyDown={(e) => e.key === "Enter" && sentMessage()}
                onChange={(e) => {
                  setCurrentMsg(e.target.value);
                  setIsTyping(true);
                  handleIsTyping();
                }}
              />
              <button
                type="button"
                onClick={sentMessage}
                className="msg-sent-btn"
              >
                &#10148;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
