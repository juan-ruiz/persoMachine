'use-strict'
const {ipcRenderer} = require('electron');

ipcRenderer.on('csat-loaded', (event, message) => {
  var container = document.getElementById("cont");
  container.innerHTML=JSON.stringify(message);
});
