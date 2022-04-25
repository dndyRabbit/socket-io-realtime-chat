import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [state, setState] = useState({
    username: "",
    room: "",
  });

  const [showChat, setShowChat] = useState(false);

  const joinARoom = (e) => {
    e.preventDefault();

    if (state.username !== "" && state.room !== "") {
      socket.emit("join_room", state.room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>join chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(e) => setState({ ...state, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setState({ ...state, room: e.target.value })}
          />

          <button onClick={joinARoom}>Join a Room</button>
        </div>
      ) : (
        <Chat socket={socket} state={state} />
      )}
    </div>
  );
}

export default App;
