@SETLOCAL
@IF NOT DEFINED NODE_PATH (
  @SET "NODE_PATH=C:\Users\yuzhipeng\Documents\GitHub\boke\node_modules\.pnpm\node_modules"
) ELSE (
  @SET "NODE_PATH=%NODE_PATH%;C:\Users\yuzhipeng\Documents\GitHub\boke\node_modules\.pnpm\node_modules"
)
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\vite\bin\vite.js" %*
) ELSE (
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\vite\bin\vite.js" %*
)
