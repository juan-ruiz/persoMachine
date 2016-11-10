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

document.getElementById("send-perso-canalsat").addEventListener("click", function(){

});

document.getElementById("send-mail-canalsat").addEventListener("click", function(){
  let ticketNumCanalsat=document.getElementById("ticket-number-canalsat");
  ipcRenderer.send("send-mail-canalsat",ticketNumCanalsat.value);
  ticketNumCanalsat.disabled = true;
});

ipcRenderer.on('canalsat-mail-sent', (event, message) => {
  let ticketNumCanalsat=document.getElementById("ticket-number-canalsat");
  ticketNumCanalsat.disabled = false;
});
