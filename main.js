const imageResizer = require('resize-img')
const fs = require('fs')
const path = require('path')
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')

const isMac = process.platform === 'darwin'
const inDev = process.env.NODE_ENV !== 'production'
let window

const HomeView = './views/HomeView.html'
const HomeWindow = () => {
	window = new BrowserWindow({
		title: 'Image Resizer',
		width: inDev ? 1000 : 500,
		height: 600,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js')
		}
	})
	if (inDev) window.webContents.openDevTools()
	window.loadFile(HomeView)
}

const AboutView = './views/AboutView.html'
const AboutWindow = () => {
	const window = new BrowserWindow({
		title: 'About Image Resizer',
		width: 300,
		height: 300
	})
	window.loadFile(AboutView)
}

const menu = [
	...(isMac ? [{
		label: app.name,
		submenu: [{
			label: 'About',
			click: AboutWindow
		}]
	}] : []),
	{
		role: 'fileMenu'
	},
	...(isMac ? [] : [{
		label: 'Help',
		submenu: [{
			label: 'About',
			click: AboutWindow
		}]
	}])
]

const resizeImage = async ({ imgPath, imgWidth, imgHeight, outputPath }) => {
	try{
		const newPath = await imageResizer(fs.readFileSync(imgPath), {
			width: imgWidth,
			height: imgHeight
		})
		const fileName = path.basename(imgPath)
		if(!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)
		fs.writeFileSync(path.join(outputPath, fileName), newPath)
		window.webContents.send('image:done')
		shell.openPath(outputPath)
	} catch(e) {
		console.log(e)
	}
}

ipcMain.on('image:resize', (e, options) => {
	resizeImage(options)
})

app.whenReady().then(() => {
	HomeWindow()
	Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
	window.on('closed', () => window = null)
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) HomeWindow()
	})
})

app.on('window-all-closed', () => {
	if (!isMac) app.quit()
})
