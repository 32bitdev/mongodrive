import React, { useEffect, useState } from "react";
import { getVideosRoute, streamActionRoute, streamRoute, logoutRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Flip, ToastContainer, toast } from "react-toastify";
import axios from "axios";
import create from "../assets/create.png";
import copy from "../assets/copy.png";
import close from "../assets/close.png";
import "react-toastify/dist/ReactToastify.css";
import "../css/Stream.css";

export default function Stream() {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const [videos, setVideos] = useState([]);
    const [activeStreamsCount, setActiveStreamsCount] = useState(0);
    const toastId = React.useRef(null);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        transition: Flip,
        theme: "colored",
        hideProgressBar: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: false,
        closeButton: false,
    };
    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY)) {
                if (!navigate) return;
                navigate("/login");
            }
        }
        fetchData();
    }, [navigate]);
    useEffect(() => {
        async function fetchData() {
            const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
            try {
                const { data } = await axios.post(`${getVideosRoute}`, { _id: user._id });
                if (data.status === true) {
                    setVideos(data.videos);
                    setActiveStreamsCount(data.activeStreamsCount);
                    setShowContent(true);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);
    const streamAction = async (state, fileId) => {
        const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
        try {
            const { data } = await axios.post(`${streamActionRoute}`, { _id: user._id, fileId: fileId, state: state });
            if (data.status === true) {
                if (state)
                    toast.success("Stream link created", toastOptions);
                else
                    toast.success("Stream link closed", toastOptions);
                setVideos(data.videos);
                setActiveStreamsCount(data.activeStreamsCount);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const copyId = (Id) => {
        navigator.clipboard.writeText(`${streamRoute}/${Id}`);
        if (!toast.isActive(toastId.current)) {
            toastId.current = toast.info("Stream link copied", toastOptions);
        }
    }
    const handleClickLogout = async () => {
        const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
        try {
            const data = await axios.get(`${logoutRoute}/${user._id}`);
            if (data.status === 200) {
                localStorage.clear();
                navigate("/login");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div className="header">
                <p className="titleDesktopStream">mongoStream</p>
                <p className="titleMobileStream">mStream</p>
                <div>
                    <button onClick={() => navigate("/")} className="backToDrive" title="Navigate to mongoDrive">Back to Drive</button>
                    <button onClick={() => handleClickLogout()} className="logOut" title="logOut">logOut</button>
                </div>
            </div>
            <div className="streamBody">
                {(showContent) ?
                    <>
                        {
                            (videos.length) ?
                                <>
                                    <div className="videoContainer">
                                        {
                                            (activeStreamsCount) ?
                                                <div className="activeStreams">
                                                    <p>Active Streams:</p>
                                                    {videos.map((video) => {
                                                        return (
                                                            <div className="cover" key={uuidv4()}>
                                                                {
                                                                    (video.streamActive) ?
                                                                        <div className="video">
                                                                            <div className="videoTitle">{video.fileName}</div>
                                                                            <button onClick={() => copyId(video.streamId)} className="copyLink" title="Copy stream link"><img src={copy} alt="copy" /></button>
                                                                            <button onClick={() => streamAction(false, video.fileId)} className="close" title="Close stream link"><img src={close} alt="close" /></button>
                                                                        </div>
                                                                        :
                                                                        <>
                                                                        </>
                                                                }
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        <div className="allVideos">
                                            <p>Your Videos:</p>
                                            {videos.map((video) => {
                                                return (
                                                    <div className="cover" key={uuidv4()}>
                                                        {
                                                            !(video.streamActive) ?
                                                                <div className="video">
                                                                    <div className="videoTitle">{video.fileName}</div>
                                                                    <button onClick={() => streamAction(true, video.fileId)} className="create" title="Create stream link"><img src={create} alt="create" /></button>
                                                                </div>
                                                                :
                                                                <div className="video">
                                                                    <div className="videoTitle">{video.fileName}</div>
                                                                    <button onClick={() => streamAction(false, video.fileId)} className="close" title="Close stream link"><img src={close} alt="close" /></button>
                                                                </div>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                                :
                                <div className="noVideos">
                                    No Videos to Show
                                </div>
                        }
                    </>
                    :
                    <></>
                }
            </div>
            <ToastContainer style={{ backgroundColor: "rgba(0, 0, 0, 0)", overflow: "hidden" }} toastStyle={{ backgroundColor: "rgb(235, 235, 235)" }} newestOnTop />
        </>
    )
}
