import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, state }) => {
  const { username, room } = state;

  const [currentMsg, setCurrentMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  const sendMsg = async () => {
    if (currentMsg !== "") {
      const msgData = {
        room: room,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_msg", msgData);
      setMsgList((list) => [...list, msgData]);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    const receiveMsg = async () => {
      await socket.on("receive_msg", (data) => {
        setMsgList((list) => [...list, data]);
      });
    };
    receiveMsg();
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {msgList.map((item, index) => (
            <div
              className="message"
              id={username === item.author ? "other" : "you"}
              key={index}
            >
              <div>
                <div className="message-content">
                  <p>{item.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{item.time}</p>
                  <p id="author">{item.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          value={currentMsg}
          onChange={(e) => {
            setCurrentMsg(e.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMsg();
          }}
        />
        <button onClick={sendMsg}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
