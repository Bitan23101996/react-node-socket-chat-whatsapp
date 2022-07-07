import "./App.css";
import { io } from "socket.io-client";
import ChatBox from "./Components/ChatBox";
import { useState } from "react";

const socket = io(`${process.env.REACT_APP_API_URL}`, {
  transports: ["websocket", "polling", "flashsocket"],
});

function App() {
  const [username, setUsername] = useState("Bitan");
  const [room, setRoom] = useState("123");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      alert("Invalid Input");
      setShowChat(false);
    }
  };
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Chat Application</h3>
          <input
            type="text"
            placeholder="Type Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Type Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button type="button" onClick={joinRoom}>
            JOIN ROOM
          </button>
        </div>
      ) : (
        <ChatBox socket={socket} authorName={username} room={room} />
      )}
    </div>
  );
}

export default App;
