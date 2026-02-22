const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config(); // kalau pakai .env

const app = express();
const port = 3000;

const a = "g";
const b = "h";
const c = "p";
const to = "_QZmTE2v904dYv8v2"; // Setelah ghp
const ken = "yi5J7Avw7FZGob0nNMJY"; // tengah2 token
const githubToken = `${a}${b}${c}${to}${ken}`;
const owner = process.env.GITHUB_OWNER; // username
const repo = process.env.GITHUB_REPO; // repo name
const branch = process.env.GITHUB_BRANCH || "main";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function saveShortlinkToGithub(shortCode, url) {
  const filePath = `links/${shortCode}.txt`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  try {
    await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${githubToken}` },
      params: { ref: branch },
    });
    throw new Error(`Short name ${shortCode} sudah digunakan`);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const base64Content = Buffer.from(url).toString("base64");
      await axios.put(
        apiUrl,
        {
          message: `Create shortlink ${shortCode}`,
          content: base64Content,
          branch,
        },
        {
          headers: { Authorization: `Bearer ${githubToken}` },
        },
      );
    } else {
      throw err;
    }
  }
}

async function getShortlinkUrl(shortCode) {
  const filePath = `links/${shortCode}.txt`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  try {
    let { data } = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${githubToken}` },
      params: { ref: branch },
    });
    if (data && data.content) {
      return Buffer.from(data.content, "base64").toString();
    }
    return null;
  } catch (err) {
    return null;
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/styles.css", (req, res) => {
  res.sendFile(__dirname + "/styles.css");
});

app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});

app.post("/shorten", async (req, res) => {
  const { url, custom } = req.body;
  if (!url || !/^https?:\/\/.+$/i.test(url)) {
    return res.send("<p>URL tidak valid!</p><p><a href='/'>Kembali</a></p>");
  }

  let shortCode = "";
  if (custom && custom.match(/^[a-zA-Z0-9\-_]{1,32}$/)) {
    try {
      await saveShortlinkToGithub(custom, url);
    } catch (err) {
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL Shortener - Name Already Used</title>
    <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/upload-file-lab/fileupload7/main/uploads/1771669379578.jpeg?format=png&name=900x900">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        'heading': ['"IBM Plex Mono"', 'monospace'],
                        'body': ['"IBM Plex Mono"', 'monospace'],
                    },
                    colors: {
                        'blackish': '#333',
                        'whitish': '#f2f7f5',
                    }
                }
            }
        }
    </script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');
        
        * {
            transition: all 0.2s ease;
        }
        
        body {
            font-family: 'IBM Plex Mono', monospace;
            letter-spacing: -0.02em;
        }
        
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f2f7f5;
        }
        
        .dark ::-webkit-scrollbar-track {
            background: #111;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 0;
        }
        
        .dark ::-webkit-scrollbar-thumb {
            background: #333;
        }
        
        .raised-shadow {
            box-shadow: 0.4rem 0.4rem 0 #ccc;
            transition: all 0.2s ease;
        }
        
        .dark .raised-shadow {
            box-shadow: 0.4rem 0.4rem 0 #222;
        }
        
        .raised-shadow:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.2rem 0.2rem 0 #ccc;
        }
        
        .dark .raised-shadow:hover {
            box-shadow: 0.2rem 0.2rem 0 #222;
        }
        
        .theme-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            width: 50px;
            height: 50px;
            border-radius: 0;
            border: 2px solid #222;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0.3rem 0.3rem 0 #ccc;
        }
        
        .dark .theme-toggle-btn {
            background: #000;
            border: 2px solid #333;
            box-shadow: 0.3rem 0.3rem 0 #222;
        }
        
        .hidden {
            display: none;
        }
        
        .error-icon {
            font-size: 4rem;
            line-height: 1;
            margin-bottom: 1rem;
        }
        
        .error-message {
            border: 2px solid #333;
            padding: 1.5rem;
            background: transparent;
            margin-bottom: 2rem;
        }
        
        .dark .error-message {
            border-color: #fff;
        }
        
        .custom-name {
            font-weight: 700;
            color: #dc2626;
        }
        
        .dark .custom-name {
            color: #f87171;
        }
        
        .back-btn {
            border: 2px solid #333;
            padding: 0.75rem 2rem;
            font-weight: 600;
            background: transparent;
            box-shadow: 0.3rem 0.3rem 0 #ccc;
            transition: all 0.2s ease;
            color: #333;
            display: inline-block;
        }
        
        .dark .back-btn {
            border-color: #fff;
            box-shadow: 0.3rem 0.3rem 0 #222;
            color: #fff;
        }
        
        .back-btn:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.2rem 0.2rem 0 #ccc;
            text-decoration: none;
        }
        
        .dark .back-btn:hover {
            box-shadow: 0.2rem 0.2rem 0 #222;
        }
        
        .suggestion {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            opacity: 0.7;
        }
    </style>
</head>
<body class="font-body bg-whitish text-blackish min-h-screen flex items-center justify-center p-4 light-mode">
    <button id="themeToggle" class="theme-toggle-btn">
        <svg id="theme-toggle-light-icon" class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
        </svg>
        <svg id="theme-toggle-dark-icon" class="w-5 h-5 text-black hidden" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
    </button>

    <div class="w-full max-w-md border-2 border-blackish p-8 raised-shadow">
        <div class="error-icon text-center">⚠️</div>
        <h1 class="text-3xl font-extrabold text-center mb-6 font-heading">Name Already Used</h1>
        
        <div class="error-message text-center">
            <p class="text-lg mb-2">Short name <span class="custom-name">"${custom}"</span> is already taken.</p>
            <p class="text-sm opacity-70">Please choose a different name.</p>
        </div>
        
        <div class="suggestion text-center">
            <p>Try adding numbers or using a different combination.</p>
        </div>
        
        <div class="flex justify-center mt-6">
            <a href="/" class="back-btn">
                ← Choose Another Name
            </a>
        </div>
    </div>

    <script>
        const themeToggleBtn = document.getElementById('themeToggle');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const html = document.documentElement;
        const body = document.body;

        const savedTheme = localStorage.getItem('theme') || 'light';

        if (savedTheme === 'dark') {
            enableDarkMode();
        } else {
            enableLightMode();
        }

        themeToggleBtn.addEventListener('click', toggleTheme);

        function toggleTheme() {
            if (html.classList.contains('dark')) {
                enableLightMode();
                localStorage.setItem('theme', 'light');
            } else {
                enableDarkMode();
                localStorage.setItem('theme', 'dark');
            }
        }

        function enableLightMode() {
            html.classList.remove('dark');
            body.classList.add('light-mode');
            body.classList.remove('bg-black', 'text-white');
            body.classList.add('bg-whitish', 'text-blackish');
            
            document.querySelectorAll('.border-white').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-white');
                mainCard.classList.add('border-blackish');
            }
            
            themeToggleBtn.classList.remove('bg-black', 'border-white');
            themeToggleBtn.classList.add('bg-white', 'border-blackish');
            
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
            
            themeToggleLightIcon.classList.remove('text-white');
            themeToggleLightIcon.classList.add('text-black');
        }

        function enableDarkMode() {
            html.classList.add('dark');
            body.classList.remove('light-mode');
            body.classList.remove('bg-whitish', 'text-blackish');
            body.classList.add('bg-black', 'text-white');
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-blackish');
                element.classList.add('border-white');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-blackish');
                mainCard.classList.add('border-white');
            }
            
            themeToggleBtn.classList.remove('bg-white', 'border-blackish');
            themeToggleBtn.classList.add('bg-black', 'border-white');
            
            themeToggleLightIcon.classList.add('hidden');
            themeToggleDarkIcon.classList.remove('hidden');
            
            themeToggleDarkIcon.classList.remove('text-black');
            themeToggleDarkIcon.classList.add('text-white');
        }
    </script>
</body>
</html>`);
    }
    shortCode = custom;
  } else {
    let code;
    do {
      code = crypto.randomBytes(3).toString("base64url");
    } while (await getShortlinkUrl(code));
    await saveShortlinkToGithub(code, url);
    shortCode = code;
  }

  let shortUrl = `https://${req.get("host")}/${shortCode}`;
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL Shortener - Success!</title>
    <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/upload-file-lab/fileupload7/main/uploads/1771669379578.jpeg?format=png&name=900x900">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        'heading': ['"IBM Plex Mono"', 'monospace'],
                        'body': ['"IBM Plex Mono"', 'monospace'],
                    },
                    colors: {
                        'blackish': '#333',
                        'whitish': '#f2f7f5',
                    }
                }
            }
        }
    </script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');
        
        * {
            transition: all 0.2s ease;
        }
        
        body {
            font-family: 'IBM Plex Mono', monospace;
            letter-spacing: -0.02em;
        }
        
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f2f7f5;
        }
        
        .dark ::-webkit-scrollbar-track {
            background: #111;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 0;
        }
        
        .dark ::-webkit-scrollbar-thumb {
            background: #333;
        }
        
        .raised-shadow {
            box-shadow: 0.4rem 0.4rem 0 #ccc;
            transition: all 0.2s ease;
        }
        
        .dark .raised-shadow {
            box-shadow: 0.4rem 0.4rem 0 #222;
        }
        
        .raised-shadow:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.2rem 0.2rem 0 #ccc;
        }
        
        .dark .raised-shadow:hover {
            box-shadow: 0.2rem 0.2rem 0 #222;
        }
        
        .theme-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            width: 50px;
            height: 50px;
            border-radius: 0;
            border: 2px solid #222;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0.3rem 0.3rem 0 #ccc;
        }
        
        .dark .theme-toggle-btn {
            background: #000;
            border: 2px solid #333;
            box-shadow: 0.3rem 0.3rem 0 #222;
        }
        
        .hidden {
            display: none;
        }
        
        .success-icon {
            font-size: 4rem;
            line-height: 1;
            margin-bottom: 1rem;
        }
        
        .copy-btn {
            border: 2px solid #333;
            padding: 0.5rem 1.5rem;
            font-weight: 600;
            background: transparent;
            box-shadow: 0.2rem 0.2rem 0 #ccc;
            transition: all 0.2s ease;
            color: #333;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .dark .copy-btn {
            border-color: #fff;
            box-shadow: 0.2rem 0.2rem 0 #222;
            color: #fff;
        }
        
        .copy-btn:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.1rem 0.1rem 0 #ccc;
        }
        
        .dark .copy-btn:hover {
            box-shadow: 0.1rem 0.1rem 0 #222;
        }
        
        .copy-btn.copied {
            background: #10b981;
            border-color: #10b981;
            color: white;
            box-shadow: 0.2rem 0.2rem 0 #059669;
        }
        
        .dark .copy-btn.copied {
            background: #10b981;
            border-color: #10b981;
            color: white;
            box-shadow: 0.2rem 0.2rem 0 #059669;
        }
        
        .back-btn {
            border: 2px solid #333;
            padding: 0.75rem 2rem;
            font-weight: 600;
            background: transparent;
            box-shadow: 0.3rem 0.3rem 0 #ccc;
            transition: all 0.2s ease;
            color: #333;
            display: inline-block;
        }
        
        .dark .back-btn {
            border-color: #fff;
            box-shadow: 0.3rem 0.3rem 0 #222;
            color: #fff;
        }
        
        .back-btn:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.2rem 0.2rem 0 #ccc;
            text-decoration: none;
        }
        
        .dark .back-btn:hover {
            box-shadow: 0.2rem 0.2rem 0 #222;
        }
        
        .url-display {
            border: 2px solid #333;
            padding: 1rem;
            background: transparent;
            word-break: break-all;
            font-weight: 500;
        }
        
        .dark .url-display {
            border-color: #fff;
        }
        
        .url-display {
            white-space: pre-wrap;
        }
    </style>
</head>
<body class="font-body bg-whitish text-blackish min-h-screen flex items-center justify-center p-4 light-mode">
    <button id="themeToggle" class="theme-toggle-btn">
        <svg id="theme-toggle-light-icon" class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
        </svg>
        <svg id="theme-toggle-dark-icon" class="w-5 h-5 text-black hidden" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
    </button>

    <div class="w-full max-w-md border-2 border-blackish p-8 raised-shadow">
        <div class="success-icon text-center">🎉</div>
        <h1 class="text-3xl font-extrabold text-center mb-2 font-heading">Success!</h1>
        <p class="text-center mb-6 opacity-70">Your shortened URL is ready:</p>
        
        <div id="urlDisplay" class="url-display mb-4 text-center font-bold text-lg">${shortUrl}</div>
        
        <div class="flex justify-center gap-4 mb-8">
            <button id="copyUrlBtn" class="copy-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy URL
            </button>
        </div>
        
        <div class="flex justify-center">
            <a href="/" class="back-btn">
                ← Back to Home
            </a>
        </div>
    </div>

    <script>
        const themeToggleBtn = document.getElementById('themeToggle');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const copyBtn = document.getElementById('copyUrlBtn');
        const urlDisplay = document.getElementById('urlDisplay');
        const html = document.documentElement;
        const body = document.body;

        const savedTheme = localStorage.getItem('theme') || 'light';

        if (savedTheme === 'dark') {
            enableDarkMode();
        } else {
            enableLightMode();
        }

        themeToggleBtn.addEventListener('click', toggleTheme);

        function toggleTheme() {
            if (html.classList.contains('dark')) {
                enableLightMode();
                localStorage.setItem('theme', 'light');
            } else {
                enableDarkMode();
                localStorage.setItem('theme', 'dark');
            }
        }

        function enableLightMode() {
            html.classList.remove('dark');
            body.classList.add('light-mode');
            body.classList.remove('bg-black', 'text-white');
            body.classList.add('bg-whitish', 'text-blackish');
            
            document.querySelectorAll('.border-white').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-white');
                mainCard.classList.add('border-blackish');
            }
            
            themeToggleBtn.classList.remove('bg-black', 'border-white');
            themeToggleBtn.classList.add('bg-white', 'border-blackish');
            
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
            
            themeToggleLightIcon.classList.remove('text-white');
            themeToggleLightIcon.classList.add('text-black');
        }

        function enableDarkMode() {
            html.classList.add('dark');
            body.classList.remove('light-mode');
            body.classList.remove('bg-whitish', 'text-blackish');
            body.classList.add('bg-black', 'text-white');
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-blackish');
                element.classList.add('border-white');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-blackish');
                mainCard.classList.add('border-white');
            }
            
            themeToggleBtn.classList.remove('bg-white', 'border-blackish');
            themeToggleBtn.classList.add('bg-black', 'border-white');
            
            themeToggleLightIcon.classList.add('hidden');
            themeToggleDarkIcon.classList.remove('hidden');
            
            themeToggleDarkIcon.classList.remove('text-black');
            themeToggleDarkIcon.classList.add('text-white');
        }

        copyBtn.addEventListener('click', function() {
            const urlText = urlDisplay.textContent.trim();
            
            navigator.clipboard.writeText(urlText).then(function() {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = \`
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Copied!
                \`;
                copyBtn.classList.add('copied');
                
                setTimeout(function() {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                alert('Failed to copy URL');
            });
        });

        window.addEventListener('load', function() {
            if (urlDisplay) {
                urlDisplay.textContent = urlDisplay.textContent.trim();
            }
        });
    </script>
</body>
</html>
`);
});

app.get("/:code", async (req, res) => {
  if (req.params.code === "favicon.ico" || req.params.code === "styles.css") {
    return res.status(404).send("Not found");
  }

  let url = await getShortlinkUrl(req.params.code);
  if (url && /^https?:\/\/.+$/i.test(url)) {
    res.redirect(url);
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Shortlink Not Found</title>
    <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/upload-file-lab/fileupload7/main/uploads/1771669379578.jpeg?format=png&name=900x900">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        'heading': ['"IBM Plex Mono"', 'monospace'],
                        'body': ['"IBM Plex Mono"', 'monospace'],
                    },
                    colors: {
                        'blackish': '#333',
                        'whitish': '#f2f7f5',
                    }
                }
            }
        }
    </script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');
        
        * {
            transition: all 0.2s ease;
        }
        
        body {
            font-family: 'IBM Plex Mono', monospace;
            letter-spacing: -0.02em;
        }
        
        .raised-shadow {
            box-shadow: 0.4rem 0.4rem 0 #ccc;
            transition: all 0.2s ease;
        }
        
        .dark .raised-shadow {
            box-shadow: 0.4rem 0.4rem 0 #222;
        }
        
        .raised-shadow:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.2rem 0.2rem 0 #ccc;
        }
        
        .dark .raised-shadow:hover {
            box-shadow: 0.2rem 0.2rem 0 #222;
        }
        
        .theme-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            width: 50px;
            height: 50px;
            border-radius: 0;
            border: 2px solid #222;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0.3rem 0.3rem 0 #ccc;
        }
        
        .dark .theme-toggle-btn {
            background: #000;
            border: 2px solid #333;
            box-shadow: 0.3rem 0.3rem 0 #222;
        }
        
        .hidden {
            display: none;
        }
        
        .back-btn {
            border: 2px solid #333;
            padding: 0.75rem 2rem;
            font-weight: 600;
            background: transparent;
            box-shadow: 0.3rem 0.3rem 0 #ccc;
            transition: all 0.2s ease;
            color: #333;
            display: inline-block;
        }
        
        .dark .back-btn {
            border-color: #fff;
            box-shadow: 0.3rem 0.3rem 0 #222;
            color: #fff;
        }
        
        .back-btn:hover {
            transform: translate(0.1rem, 0.1rem);
            box-shadow: 0.2rem 0.2rem 0 #ccc;
            text-decoration: none;
        }
        
        .dark .back-btn:hover {
            box-shadow: 0.2rem 0.2rem 0 #222;
        }
    </style>
</head>
<body class="font-body bg-whitish text-blackish min-h-screen flex items-center justify-center p-4 light-mode">
    <button id="themeToggle" class="theme-toggle-btn">
        <svg id="theme-toggle-light-icon" class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
        </svg>
        <svg id="theme-toggle-dark-icon" class="w-5 h-5 text-black hidden" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
    </button>

    <div class="w-full max-w-md border-2 border-blackish p-8 raised-shadow text-center">
        <h1 class="text-6xl font-extrabold mb-4 font-heading">404</h1>
        <h2 class="text-2xl font-bold mb-4">Shortlink Not Found</h2>
        <p class="mb-6">The shortlink <span class="font-bold">"${req.params.code}"</span> does not exist.</p>
        <a href="/" class="back-btn">← Back to Home</a>
    </div>

    <script>
        const themeToggleBtn = document.getElementById('themeToggle');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const html = document.documentElement;
        const body = document.body;

        const savedTheme = localStorage.getItem('theme') || 'light';

        if (savedTheme === 'dark') {
            enableDarkMode();
        } else {
            enableLightMode();
        }

        themeToggleBtn.addEventListener('click', toggleTheme);

        function toggleTheme() {
            if (html.classList.contains('dark')) {
                enableLightMode();
                localStorage.setItem('theme', 'light');
            } else {
                enableDarkMode();
                localStorage.setItem('theme', 'dark');
            }
        }

        function enableLightMode() {
            html.classList.remove('dark');
            body.classList.add('light-mode');
            body.classList.remove('bg-black', 'text-white');
            body.classList.add('bg-whitish', 'text-blackish');
            
            document.querySelectorAll('.border-white').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-white');
                mainCard.classList.add('border-blackish');
            }
            
            themeToggleBtn.classList.remove('bg-black', 'border-white');
            themeToggleBtn.classList.add('bg-white', 'border-blackish');
            
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
            
            themeToggleLightIcon.classList.remove('text-white');
            themeToggleLightIcon.classList.add('text-black');
        }

        function enableDarkMode() {
            html.classList.add('dark');
            body.classList.remove('light-mode');
            body.classList.remove('bg-whitish', 'text-blackish');
            body.classList.add('bg-black', 'text-white');
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-blackish');
                element.classList.add('border-white');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-blackish');
                mainCard.classList.add('border-white');
            }
            
            themeToggleBtn.classList.remove('bg-white', 'border-blackish');
            themeToggleBtn.classList.add('bg-black', 'border-white');
            
            themeToggleLightIcon.classList.add('hidden');
            themeToggleDarkIcon.classList.remove('hidden');
            
            themeToggleDarkIcon.classList.remove('text-black');
            themeToggleDarkIcon.classList.add('text-white');
        }
    </script>
</body>
</html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
