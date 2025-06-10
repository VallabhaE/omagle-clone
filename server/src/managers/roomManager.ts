import { ADD_ICE_CANDIDATE, ANSWER, OFFER, SEND_OFFER } from "../constants/constants"
import { User } from "./userManager"


export interface Room {
    user1: User
    user2: User
}
let GLOBAL_ROOMID = 1

export class RoomManager {
    private rooms: Map<string, Room>
    // init 
    constructor() {
        this.rooms = new Map<string, Room>();
    }
    getRoomId(): Number {
        return GLOBAL_ROOMID++
    }
    createRoom(user1: User, user2: User) {
        let roomId = this.getRoomId().toString()

        this.rooms.set(roomId, {
            user1, user2
        })

        user1.socket.emit(SEND_OFFER, {
            roomId
        })

        user2.socket.emit(SEND_OFFER, {
            roomId
        })
    }

    onOffer(roomId: string, sdp: string, senderSocketId: string) {
        let room = this.rooms.get(roomId)
        if (!room) {
            return
        }
        let roomUser = (room.user1.socket.id === senderSocketId) ? room.user2 : room.user1

        roomUser.socket.emit(OFFER, {
            sdp, roomId
        })
    }

    onAnswer(roomId: string, sdp: string, senderSocketId: string) {
        let room = this.rooms.get(roomId)
        if (!room) {
            return
        }
        let roomUser = (room.user1.socket.id === senderSocketId) ? room.user2 : room.user1

        roomUser.socket.emit(ANSWER, {
            sdp, roomId
        })
    }

    onIceCandidate(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver") {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser.socket.emit(ADD_ICE_CANDIDATE, ({ candidate, type }));

    }
}