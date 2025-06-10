import { Socket } from "socket.io"
import { RoomManager } from "./roomManager"
import { ADD_ICE_CANDIDATE, ANSWER, OFFER } from "../constants/constants"
export interface User {
    socket: Socket
    name: string
}


export class UserManager {
    private users: User[]
    private queue: string[]
    private roomManager: RoomManager

    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: string, socket: Socket) {
        this.users.push({
            name, socket
        })

        this.queue.push(socket.id)
        socket.emit("lobby")

        this.clearQueue()
        this.initHandler(socket)
    }

    removeUser(id: string) {
        this.users = this.users.filter((x) => x.socket.id !== id)
        this.queue = this.queue.filter((x) => id !== id)
    }

    clearQueue() {
        if (this.queue.length < 2) {
            console.log("Not more then 2 entrys available")
            return
        }
        let id1 = this.queue.pop()
        let id2 = this.queue.pop()

        const user1 = this.users.find((x) => x.socket.id == id1)
        const user2 = this.users.find((x) => x.socket.id == id2)

        if (!user1 || !user2) {
            console.log("Some User not found");
            return
        }

        this.roomManager.createRoom(user1, user2)
        this.clearQueue()
    }

    initHandler(socket: Socket) {
        socket.on(OFFER, ({ sdp, roomId }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id)
        })

        socket.on(ANSWER, ({ sdp, roomId }) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id)
        })

        socket.on(ADD_ICE_CANDIDATE, ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidate(roomId, socket.id, candidate, type)
        })
    }
}

