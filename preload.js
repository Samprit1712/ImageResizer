const os = require('os')
const Toastify = require('toastify-js')
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('process', {
	homeDir: os.homedir()
})

contextBridge.exposeInMainWorld('toastify', {
	success: (message) => Toastify({
		text: message,
		duration: 3000,
		style: {
			background: 'green',
			color: '#fff',
			textAlign: 'center'
		}
	}).showToast(),
	error: (message) => Toastify({
		text: message,
		duration: 3000,
		style: {
			background: 'red',
			color: '#fff',
			textAlign: 'center'
		}
	}).showToast()
})

contextBridge.exposeInMainWorld('ipcRenderer', {
	send: (channel, data) => ipcRenderer.send(channel, data),
	on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
})