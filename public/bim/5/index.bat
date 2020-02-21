@echo off

set PATH=%APPDATA%\npm;C:\Program Files\nodejs;%PATH%

setlocal enabledelayedexpansion
pushd "C:\Program Files\nodejs"

rem Figure out the node version.
set print_version=.\node.exe -p -e "process.versions.node + ' (' + process.arch + ')'"
for /F "usebackq delims=" %%v in (`%print_version%`) do set version=%%v

rem Print message.
if exist npm.cmd (
  echo Your environment has been set up for using Node.js !version! and npm.
) else (
  echo Your environment has been set up for using Node.js !version!.
)

popd
endlocal

cd
start http://localhost:8080/index.html
http-server .

rem pause
