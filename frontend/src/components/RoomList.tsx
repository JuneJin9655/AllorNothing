import React, { useState, useEffect } from "react";
import axios from "axios";

interface Room {
  roomId: string;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    axios
      .get("/api/rooms")
      .then((response) => {
        setRooms(response.data.rooms); // 确保后端返回的数据结构正确
      })
      .catch((error) => {
        console.error("Failed to fetch rooms", error);
      });
  }, []);

  return (
    <div>
      <h2>Room List</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>{room.roomId}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
