'use-strict'
const {ipcRenderer} = require('electron');
ipcRenderer.on('csat-loaded', (event, message) => {
  var container = document.getElementById("requests-table-eutelsat");
  container.innerHTML=JSON.stringify(message);
});

ipcRenderer.on('ab-loaded', (event, message) => {
  console.log("message");
  var container = document.getElementById("requests-table-ab");
  container.innerHTML=JSON.stringify(message);
});

ipcRenderer.send('ab-request', 'ping');
