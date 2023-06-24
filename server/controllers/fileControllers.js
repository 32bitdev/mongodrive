const { Users, FileDetails, FileBucket, ObjectId } = require("../collections/mongoCollections");
const { randomUUID } = require("crypto");
const { Readable } = require("stream");

//upload request handler
module.exports.upload = async (req, res, next) => {
    try {
        if (req.files === null)
            return res.status(400).json({ status: false, msg: "No file selected" });
        const file = await req.files.file;
        const _id = await req.body._id;
        if (file.size > 1024 * 1048576)
            return res.status(400).json({ status: false, msg: "File size is too big" });
        if (file.name === "")
            return res.status(400).json({ status: false, msg: "File name cannot be blank" });
        if (file.name.indexOf(" ") === 0)
            return res.status(400).json({ status: false, msg: "File name cannot start with space" });
        const user = await Users.findOne({ _id: new ObjectId(_id) });
        if (!(user))
            return res.status(500).json({ status: false, msg: "User not found" });
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date();
        const uploadedOn = date.getDay() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        let newFileCount = user.fileCount + 1;
        const fileId = user._id + newFileCount;
        const buffer = file.data;
        const stream = Readable.from(buffer);
        const fileUploadStream = FileBucket.openUploadStream(`${fileId}`);
        const fileReadStream = stream;
        fileReadStream.pipe(fileUploadStream);
        const update = await Users.updateOne({ _id: new ObjectId(_id) }, { $set: { fileCount: newFileCount } });
        if (!update.acknowledged)
            return res.status(500).json({ status: false, msg: "Something went wrong" });
        const fileDetailsAdd = await FileDetails.insertOne({ fileId: fileId, fileName: file.name, owner: _id, uploadedOn: uploadedOn, fileSize: file.size, fileType: file.mimetype });
        if (!fileDetailsAdd.acknowledged) return res.json({ msg: "Something Went Wrong", status: false });
        return res.json({ status: true, msg: "Upload Successfull" });
    }
    catch (ex) {
        next(ex);
    }
};

//get files
module.exports.getFiles = async (req, res, next) => {
    try {
        const { _id } = req.body;
        const files = await FileDetails.find({ owner: _id }).sort({_id:-1}).toArray();
        return res.status(200).json({ status: true, files: files });
    } catch (ex) {
        next(ex);
    }
};
