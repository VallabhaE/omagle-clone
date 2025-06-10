import React, { useEffect, useRef, useState } from 'react'

const Loading = () => {
    const [joined, setJoined] = useState<boolean>(false)

    const [name, setName] = useState<string>("")
    const [localAudioTrace, setLocalAudioTrack] = useState<null | MediaStreamTrack>(null);
    const [localVideoTrace, setLocalVideoTrack] = useState<null | MediaStreamTrack>(null);
    const videoRef = useRef<HTMLVideoElement>(null)

    const getCam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })

        setLocalAudioTrack(stream.getAudioTracks()[0])
        setLocalVideoTrack(stream.getVideoTracks()[0])

        if (!videoRef.current) {
            return
        }
        videoRef.current.srcObject = new MediaStream([stream.getVideoTracks()[0]])
        videoRef.current.play()
    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam()
        }
    }, [videoRef])

    if (!joined) {
        return <div style={{display:'flex'}}>
            <video ref={videoRef}></video>
            <input type="text" onChange={(e) => {
                setName(e.target.value);
            }}></input>

            <button onClick={() => {
                setJoined(true);
            }}>Join</button>
        </div>
    }

    return (
        <div>loading</div>
    )
}

export default Loading