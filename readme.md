# MongoDrive

Cloud Storage - made easy by GridFS

MongoDrive is a cloud storage platform that primarily uses MongoDB GridFS technology to store files, it also have an utility MongoStream to create a public Streaming-End-Point to serve the videos that are uploaded by the users.

## GridFS

MongoDB is a database service which lets you upload your documents but there is a limit 16 MB, documents or files having larger size than BSON-document size limit which is 16 MB, can not be saved into MongoDB and this is where GridFS comes into picture. GridFS is a specification for storing and retrieving files that exceed the BSON-document size limit of 16 MB. Instead of storing a file in a single document, GridFS divides the file into parts, or chunks, and stores each chunk as a separate document. MongoDrive uses the GridFS to store the files in MongoDB and provides a cloud storage option.

# MongoStream
With MongoDrive you can create a public streaming-end-point to deliver the content of a video to a client player app.

## Using Streaming-End-Point?
The very basic use of Streaming-End-Point is playing a video in some HTML page directly from a video that is uploaded to MongoDrive. To achieve that, following are the steps:

- Upload your desired video to MongoDrive
- Go to MongoStream to create the End-Point
- Copy your created End-Point
- Create a HTML page with a video tag
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MongoStream Video Demo</title>
</head>
<body>
    <h1>MongoStream Video Demo</h1>
    <video src="pasteyourlinkhere"></video>
</body>
</html>
```
- Put your End-Point link in the video src
- Open you HTML page and your video will be playing

# Preview
<img src="/preview/preview_1.png" width="400"> <img src="/preview/preview_2.png" width="400">

## Video Preview
[MongoDrive Walkthrough Guide](https://youtu.be/Gn3NFnSCqIs)

## Requirements

MongoDB server should be running locally.

## Deployment

To deploy this project

Open terminal and navigate to client

```bash
  cd mongodrive/client
```
Install packages

```bash
  npm install
```
Now navigate to server

```bash
  cd ../server
```
Install packages

```bash
  npm install
```

Start the server

```bash
  npm start
```

Open a new terminal in client directory and start the app

```bash
  npm start
```
## Tech Stack

React.js, Node.js, MongoDB, Express.js

## Created by
- [Subrat Pandey](https://github.com/imsubratpandey)
- [Archana Yadav](https://github.com/archanay1203)
