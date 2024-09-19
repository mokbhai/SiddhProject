const fs = require("fs");
const { google } = require("googleapis");
const express = require("express");
const open = require("open");

const app = express();
const PORT = 3000;
let oAuth2Client;

app.set("view engine", "ejs");

// Load client secrets from a local file.
fs.readFile("google_sec.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  authorize(JSON.parse(content), (auth) => {
    listFilesInFolder(auth, "1SICLsagB_R4j66xyO9J77LI4lBisXCdw");
  });
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    `http://localhost:${PORT}/oauth2callback`
  );

  // Check if we have previously stored a token.
  fs.readFile("token.json", (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  open(authUrl);

  app.get("/oauth2callback", (req, res) => {
    const code = req.query.code;
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return res.send("Error retrieving access token");
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile("token.json", JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log("Token stored to", "token.json");
      });
      res.send("Authentication successful! You can close this tab.");
      callback(oAuth2Client);
    });
  });
}
async function listAllFiles(auth) {
  const drive = google.drive({ version: "v3", auth });
  let pageToken = null;
  const files = [];

  do {
    try {
      const res = await drive.files.list({
        fields: "nextPageToken, files(id, name)",
        spaces: "drive",
        pageToken: pageToken,
      });
      files.push(...res.data.files);
      pageToken = res.data.nextPageToken;
    } catch (err) {
      console.error("The API returned an error: " + err);
      break;
    }
  } while (pageToken);

  if (files.length) {
    console.log("Files:");
    files.forEach((file) => {
      console.log(`${file.name} (${file.id})`);
    });
  } else {
    console.log("No files found.");
  }
}
async function listAllFolders(auth) {
  const drive = google.drive({ version: "v3", auth });
  let pageToken = null;
  const folders = [];

  do {
    try {
      const res = await drive.files.list({
        fields: "nextPageToken, files(id, name, mimeType)",
        spaces: "drive",
        q: "mimeType='application/vnd.google-apps.folder'",
        pageToken: pageToken,
      });
      folders.push(...res.data.files);
      pageToken = res.data.nextPageToken;
    } catch (err) {
      console.error("The API returned an error: " + err);
      break;
    }
  } while (pageToken);

  if (folders.length) {
    console.log("Folders:");
    folders.forEach((folder) => {
      console.log(`${folder.name} (${folder.id})`);
    });
  } else {
    console.log("No folders found.");
  }
}

function downloadFile(auth) {
  const drive = google.drive({ version: "v3", auth });
  const fileId = "1vw1Frb0zoB5NNNukBFYpu-_m3iIT0VKU";
  const dest = fs.createWriteStream("lpu.jpg");

  drive.files.get(
    { fileId: fileId, alt: "media" },
    { responseType: "stream" },
    (err, res) => {
      if (err) return console.log("Error downloading file:", err);
      res.data
        .on("end", () => {
          console.log("Download completed.");
        })
        .on("error", (err) => {
          console.error("Error downloading file:", err);
        })
        .pipe(dest);
    }
  );
}

async function listFilesInFolder(auth, folderId) {
  const drive = google.drive({ version: "v3", auth });
  let pageToken = null;
  const files = [];

  do {
    try {
      const res = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: "nextPageToken, files(id, name, mimeType, webViewLink)",
        spaces: "drive",
        pageToken: pageToken,
      });
      files.push(...res.data.files);
      pageToken = res.data.nextPageToken;
    } catch (err) {
      console.error("The API returned an error: " + err);
      break;
    }
  } while (pageToken);

  app.get("/", (req, res) => {
    res.render("index", { files });
  });

  // Start the server after setting up the route
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

app.get("/download/:fileId", async (req, res) => {
  const fileId = req.params.fileId;
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  try {
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );

    response.data
      .on("end", () => console.log("Done"))
      .on("error", (err) => console.error("Error downloading file:", err))
      .pipe(res);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).send("Error fetching file");
  }
});
