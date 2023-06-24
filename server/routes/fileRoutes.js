//server routes to handle get and post requests
const { upload, getFiles } = require("../controllers/fileControllers");
const router = require("express").Router();
router.post("/upload", upload);
router.post("/getFiles", getFiles);
module.exports = router;