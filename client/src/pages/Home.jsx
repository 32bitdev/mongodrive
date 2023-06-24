import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadRoute, getFilesRoute, logoutRoute } from "../utils/APIRoutes";
import { Flip, ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Files from "../components/Files";
import "react-toastify/dist/ReactToastify.css";
import "../css/Home.css";

export default function Home() {
    const navigate = useNavigate();
    const [file, setFile] = useState("");
    const [files, setFiles] = useState([]);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const fileHandleChange = (event) => {
        if (event.target.files[0].size < 1024 * 1048576)
            setFile(event.target.files[0]);
        else {
            toast.error("File size is too big", toastOptions);
            document.getElementById("customFile").value = null;
        }
    };
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
            if (file && handleValidation()) {
                const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
                try {
                    const { data } = await axios.post(`${uploadRoute}`, { file, _id: user._id }, {
                        headers: { "Content-Type": "multipart/form-data" },
                        onUploadProgress: progressEvent => {
                            setUploadPercentage(
                                parseInt(
                                    Math.round((progressEvent.loaded * 100) / progressEvent.total)
                                )
                            );
                        }
                    });
                    if (data.status === true) {
                        toast.success("File Uploaded", toastOptions);
                        try {
                            const { data } = await axios.post(`${getFilesRoute}`, { _id: user._id });
                            if (data.status === true) {
                                setFiles(data.files);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        setTimeout(() => {
                            setUploadPercentage(0);
                            setFile("");
                            document.getElementById("customFile").value = null;
                        }, 5000);
                    }
                } catch (err) {
                    if (err.response && err.response.status && err.response.status === 400) {
                        toast.error(err.response.data.msg, toastOptions);
                        setUploadPercentage(0);
                        setFile("");
                        document.getElementById("customFile").value = null;
                    }
                    else {
                        console.log("error");
                        setUploadPercentage(0);
                        setFile("");
                        document.getElementById("customFile").value = null;
                    }
                }
            }
        }
        fetchData();
    }, [file]); // eslint-disable-line
    const handleValidation = () => {
        if (file.name.indexOf(" ") === 0) {
            toast.error("Filename cannot start with space", toastOptions);
            setFile("");
            document.getElementById("customFile").value = null;
            return false;
        }
        return true;
    };
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
                <p className="titleDesktopDrive">mongoDrive</p>
                <p className="titleMobileDrive">mDrive</p>
                <div>
                    <input id="customFile" style={{ display: "none" }} type="file" onChange={(e) => fileHandleChange(e)} autoComplete="off" />
                    {
                        (file) ?
                            <>
                                {
                                    (uploadPercentage === 100) ?
                                        <>
                                            <div className="uploaded">Uploaded</div>
                                        </>
                                        :
                                        <>
                                            <div className="uploading">Uploading: {uploadPercentage}%</div>
                                        </>
                                }
                            </>
                            :
                            <>
                                <label className="custom-file-label" style={file ? { pointerEvents: "none" } : {}} htmlFor="customFile" title="Upload">Upload</label>
                            </>
                    }
                    <button onClick={() => navigate("/stream")} className="mongoStream" title="Navigate to mongoStream">mongoStream</button>
                    <button onClick={() => handleClickLogout()} className="logOut" title="logOut">logOut</button>
                </div>
            </div>
            <div className="body">
                <Files files={files} setFiles={setFiles} />
            </div>
            <ToastContainer style={{ backgroundColor: "rgba(0, 0, 0, 0)", overflow: "hidden" }} toastStyle={{ backgroundColor: "rgb(235, 235, 235)" }} newestOnTop />
        </>
    );
}