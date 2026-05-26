# MediaPipe 表情辨識網頁應用

這是一個純前端的 MediaPipe 表情辨識範例，支援手機或桌面瀏覽器開啟相機，並根據偵測到的表情以語音回饋使用者。

## 功能
- 使用 `MediaPipe FaceMesh` 進行臉部標記偵測
- 辨識三種表情：微笑、驚訝、自然
- 使用瀏覽器 `SpeechSynthesis` 進行語音回饋
- 手機瀏覽器也可以開啟相機鏡頭

## 使用方式
1. 將這個資料夾放到本機或伺服器上。
2. 開啟 `index.html`。
3. 按下「啟用相機」，允許瀏覽器存取相機。
4. 當偵測到表情時，會顯示結果並播放語音。

> 注意：部分瀏覽器在 `file://` 模式下可能會限制相機存取，建議使用簡單本機伺服器啟動。
>
> 你可以使用以下方式啟動本機測試網站：
>
> - 雙擊 `start.bat`，使用 Python 啟動本機伺服器
> - 或雙擊 `start_node.bat`，使用 Node.js 啟動本機伺服器（如果已安裝 Node.js）
>
> 開啟後在瀏覽器輸入：`http://localhost:8000`
>
> 如果你想直接用命令啟動，也可以在 `新增資料夾 (2)` 目錄下執行：
> `py -m http.server 8000` 或 `node server.js`（如果已安裝 Node.js）
>
> ### 手機 / 電腦不用同一網路也能共用網址
> 1. 雙擊 `start_tunnel.bat`。
> 2. 等待命令列顯示公開網址，例如：`https://abcd1234.ngrok.io`。
> 3. 手機與電腦都直接輸入這個網址即可使用。
>
> `start_tunnel.bat` 會自動啟動本機伺服器並建立公開隧道，因此你不需要手動執行 `start.bat`。
>
> 如果你有安裝 Node.js，也可以在目錄下執行：
> `npm run tunnel`
>
> 這樣就能讓手機、電腦即使不在同一個 Wi-Fi，也能共用同一個網址測試。
>
> ### GitHub Pages 部署（網頁版）
> 1. 登入你的 GitHub 帳號，前往 GitHub 網頁版首頁。
> 2. 點選右上方「+」按鈕，選擇「New repository」。
> 3. 輸入「Repository name」，例如 `mediapipe-expression-app`，選擇 Public，然後按 Create repository。
> 4. 在新建立的 repository 頁面，點選「Add file」->「Upload files」。
> 5. 將 `index.html`、`style.css`、`script.js`、`README.md`、`build_docs.py`、`server.js`、`start.bat`、`start_tunnel.bat`、`package.json` 上傳。
> 6. 下方填寫 commit 訊息，按「Commit changes」。
> 7. 上傳後前往「Settings」->「Pages」。
> 8. 在「Build and deployment」中選擇「Deploy from a branch」。
> 9. 選擇 `gh-pages` 分支，按「Save」。
> 10. 等待 GitHub Pages 建置完成，頁面會顯示公開網址。
>
> 如果你想直接用網頁版上傳並部署，這是最簡單的流程。
>
> ### 手機連線方式
> 1. 先確定手機與電腦連在同一個 Wi-Fi 網路。
> 2. 在電腦上執行 `start.bat` 或 `start_node.bat`。
> 3. 在電腦的 PowerShell 或命令提示字元中找到本機 IP，例如 `192.168.1.100`。
> 4. 手機瀏覽器輸入：`http://192.168.1.100:8000`
>
> 如果不知道 IP，可以在 PowerShell 執行：`ipconfig`，找 `IPv4 位址`。
>
## GitHub Pages 部署
1. 在本機安裝 Git，並建立 GitHub 倉庫。
2. 將 `c:\Users\student\Downloads\新增資料夾 (2)` 資料夾初始化成 Git 倉庫：
   - `git init`
   - `git add .`
   - `git commit -m "Initial commit"`
   - `git branch -M main`
   - `git remote add origin https://github.com/<你的帳號>/<你的倉庫>.git`
   - `git push -u origin main`
3. 將專案推到 GitHub 後，GitHub Actions 會自動執行部署流程。
4. 等待 GitHub Action 完成，然後到 GitHub 倉庫「Settings > Pages」設定發布來源為 `gh-pages` 分支。
5. 之後你就會取得一個 GitHub Pages 網址，類似：
   - `https://<你的帳號>.github.io/<你的倉庫>/`

> 我已經幫你建立自動部署工作流程：`.github/workflows/deploy.yml`。
> 它會自動把靜態網站打包到 `docs/`，並發布到 `gh-pages` 分支。
