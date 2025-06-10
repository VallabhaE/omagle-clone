import React, { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

const url = ""
const SEND_OFFER = "send-offer"
const OFFER = "offer"
const ANSWER = "answer"
const ADD_ICE_CANDIDATE = "add-ice-candidate"
const room = ({
    name, localAudioTrack, localVideoTrack
}: {
    name: string,
    localAudioTrack: MediaStreamTrack,
    localVideoTrack: MediaStreamTrack,
}) => {
    const [lobby, setLobby] = useState(true)
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null)
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null)

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = io(url)
        socket.on(SEND_OFFER, async ({ roomId }) => {
            setLobby(false)

            const pc = new RTCPeerConnection()
            setSendingPc(pc)
            pc.addTrack(localVideoTrack)
            pc.addTrack(localAudioTrack)

            pc.onicecandidate = async (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "sender",
                        roomId
                    })
                }
            }

            pc.onnegotiationneeded = async () => {
                const sdp = await pc.createOffer();
                pc.setLocalDescription(sdp)
                socket.emit(OFFER,{
                    sdp,roomId
                })
            }
        })
        // end of send-offer

        // offer
        // on ice candidate is pending
        socket.on("lobby",()=>{
            setLobby(true)
        })

        socket.on(ANSWER,({roomId, sdp: remoteSdp})=>{
            setSendingPc((pc)=>{
                pc?.setRemoteDescription(remoteSdp)
                return pc
            })
        })
    }, [name])
    return (
        <div>room : {name}</div>
    )
}

export default room