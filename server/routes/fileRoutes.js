//server routes to handle get and post requests
const { upload, download, deleteFile, getFiles, getVideos, streamAction, stream } = require("../controllers/fileControllers");
const router = require("express").Router();
router.post("/upload", upload);
router.post("/getFiles", getFiles);
router.post("/getVideos", getVideos);
router.post("/download", download);
router.post("/delete", deleteFile);
router.get("/stream/:streamId", stream);
router.post("/streamAction", streamAction);
module.exports = router;