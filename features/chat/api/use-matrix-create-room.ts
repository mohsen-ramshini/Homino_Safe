// hooks/matrix/use-matrix-create-room.ts
import axios from "axios";
import Cookies from "js-cookie";

const MATRIX_HOMESERVER_URL = "http://192.168.100.87:8008";

export const useMatrixCreateRoom = () => {
  const createRoom = async (roomName: string, participants?: string[]) => {
    if (!roomName) throw new Error("Room name is required");

    const accessToken = Cookies.get("synapse_access_token");
    if (!accessToken) throw new Error("Matrix access token missing!");

    const payload: any = {
      name: roomName,
      preset: "private_chat",
      is_direct: false,
    };

    if (participants && participants.length > 0) {
      payload.invite = participants;
    }

    const response = await axios.post(
      `${MATRIX_HOMESERVER_URL}/_matrix/client/v3/createRoom`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  };

  return { createRoom };
};
