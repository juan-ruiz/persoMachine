'use strict';
const {BrowserWindow, app} = require('electron');


//Microsoft exchange communication initialization
const EWS = require('node-ews');
const username = 'ruizvilla';
const password = 'Password2014';
const host = 'https://mobi.purpledrm.com/';
const options = {};
const ews = new EWS(username, password, host, options);
const ewsFunction = 'FindItem';
var ewsArgs = {
    "attributes": {
    "Traversal": "Shallow"
  },
  "ItemShape": {
    "BaseShape": "IdOnly",
    "AdditionalProperties": {
      "FieldURI": {
        "attributes": {
          "FieldURI": "item:Subject"
        }
      }
    }
  },
  "ParentFolderIds": {
    "DistinguishedFolderId": {
      "attributes": {
        "Id": "inbox"
      }
    }
  },
  'tns:QueryString':'Subject:DemandePersoCSAT_201611'
};

//Adding the necessary header to the soap request

var ewsSoapHeader = {
  't:RequestServerVersion': {
    attributes: {
      Version: "Exchange2010"
    }
  }
};

//Window creation
let mainWindow;
app.on('ready', function() {
        mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    // Run a "find item" function to retrieve all CSAT perso requests
    ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
      .then(result => {
       mainWindow.webContents.send('csat-loaded',result);
      })
      .catch(err => {
       mainWindow.webContents.send('csat-loaded',err.message);
      });
});







//closes the app when the window is closed
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
