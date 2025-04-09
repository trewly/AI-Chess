const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,  // Cho phép sử dụng require trong renderer process
            contextIsolation: false // Tắt isolation để cho phép việc này
        }
    });
    
    // Sửa đường dẫn tới index.html cho đúng
    mainWindow.loadFile(path.join(__dirname, 'index.html'));  // Đảm bảo 'src' không bị trùng

    //mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
