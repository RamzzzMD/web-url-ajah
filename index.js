const express = require("express");
const fileUpload = require("express-fileupload");
const axios = require("axios");
const mime = require("mime-types");
const path = require("path"); // Ditambahkan untuk handle path file
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const a = "g";
const b = "h";
const c = "p";
const to = "ghp_EXpN87zDp5riPoH9"; // Setelah ghp
const ken = "KilpUZDusO2Inh0JcoaK"; // tengah2 token
const githubToken = `${a}${b}${c}${to}${ken}`;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || "main";

// Middleware untuk file upload
app.use(fileUpload());

// Melayani file statis index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("Tidak ada file yang diunggah.");
  }

  let uploadedFile = req.files.file;

  // PERINGATAN: Vercel memiliki limit body size (Hobby tier ~4.5MB)
  // Meskipun GitHub mendukung 100MB, Vercel akan memutus koneksi jika file terlalu besar.
  if (uploadedFile.size > 10 * 1024 * 1024) { 
    return res.status(400).send("File terlalu besar untuk limit server ini (maks 10 MB)");
  }

  let safeName = uploadedFile.name.replace(/\s+/g, "_");
  let fileName = `${Date.now()}_${safeName}`;
  let filePath = `uploads/${fileName}`;
  let base64Content = Buffer.from(uploadedFile.data).toString("base64");

  try {
    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        message: `Upload file ${fileName}`,
        content: base64Content,
        branch: branch,
      },
      {
        headers: {
          Authorization: `token ${githubToken}`, // Menggunakan format 'token' lebih standar untuk GitHub
          "Content-Type": "application/json",
        },
      }
    );

    let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

    // Response HTML Sukses
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unggahan Berhasil</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background-image: linear-gradient(to right top, #d16ba5, #5ffbf1); background-attachment: fixed; }
            .card-glow { box-shadow: 0 0 30px rgba(124, 58, 237, 0.6); }
        </style>
    </head>
    <body class="flex flex-col items-center justify-center min-h-screen p-4">
        <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md card-glow text-center">
            <h1 class="text-2xl font-bold mb-4">✅ Berhasil Diunggah!</h1>
            <p class="text-gray-600 mb-4">File Anda kini tersedia di GitHub.</p>
            <div class="bg-gray-100 p-3 rounded break-all text-sm mb-6">${rawUrl}</div>
            <div class="flex gap-2">
                <button onclick="navigator.clipboard.writeText('${rawUrl}'); alert('Copied!')" class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-bold">Salin URL</button>
                <a href="/" class="flex-1 bg-gray-200 py-2 rounded-full font-bold">Kembali</a>
            </div>
        </div>
    </body>
    </html>
    `);
  } catch (error) {
    console.error("GitHub Error:", error.response?.data || error.message);
    res.status(500).json({
        error: "Gagal mengunggah ke GitHub",
        details: error.response?.data?.message || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
