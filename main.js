'use strict';
const {BrowserWindow, app, ipcMain, dialog} = require('electron');


//Microsoft exchange communication initialization
const EWS = require('node-ews');
const username = 'ruizvilla';
const password = 'Password2014';
const host = 'https://mobi.purpledrm.com/';
const options = {};
const ews = new EWS(username, password, host, options);
var ewsFunction = 'FindItem';
var ewsArgs = {
    "attributes": {
    "Traversal": "Shallow"
  },
  "ItemShape": {
    "BaseShape": "AllProperties",
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
  'tns:QueryString':'Subject:DemandePersoCSAT_20161110'
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
        height: 1000,
        width: 1000
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    // Run a "find item" function to retrieve all CSAT perso requests
    // ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
    //   .then(result => {
    //    mainWindow.webContents.send('csat-loaded',result);
    //   })
    //   .catch(err => {
    //    mainWindow.webContents.send('csat-loaded',err.message);
    //   });




    ewsFunction = "GetItem";
    ewsArgs = {
      "ItemShape": {
        "BaseShape": "Default"
      },
      "ItemIds": {
        "ItemId": {
          "attributes": {
            "Id": "AAMkAGU2ZWZhNTI0LTkzNWUtNDMzNC04Mjg1LWNhNjdmNDc5OWZlOQBGAAAAAABYY+zNqedRRZ4lG2qQfiLRBwA4f71TcsztQpJHHCzQeJxmAAABBzY8AAAIiL7IZqljRo+D4KtcnrUEAAAFLIgEAAA=",
            "ChangeKey": "CQAAABYAAAAIiL7IZqljRo+D4KtcnrUEAAAFLXj7"
          }
        }
      }
    };
    ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
      .then(result => {
       mainWindow.webContents.send('csat-loaded',result);
      })
      .catch(err => {
       mainWindow.webContents.send('csat-loaded',err.message);
      });

    ipcMain.on("send-mail-canalsat", (event, arg) => {
      console.log(arg);  // prints "ticket number"

      console.log(dialog.showMessageBox(
            mainWindow,
            {
                type: 'question',
                buttons: ['Ok'],
                title: 'Confirm',
                message: 'Sending mail to customers'
            }));
      //setting the sendMail function
      ewsFunction = "CreateItem";
      ewsArgs = {
        "attributes" : {
          "MessageDisposition" : "SendAndSaveCopy"
        },
        "SavedItemFolderId" : {
          "DistinguishedFolderId" : {
            "attributes" : {
              "Id" : "sentitems"
            }
          }
        },
        "Items" : {
          "Message" : {
            "Subject" : "[Ticket 011234 - CANAL SATELLITE] [ORAS][BBX]Demande de personnalisation OTA-20161111",
            "Body" : "Bonjour, \n Votre demande perso a été prise en compte, vous povez trouver le numero de ticket en sujet, Cordialement",
            "ToRecipients" : {
              "Mailbox" : {
                "EmailAddress" : "j.RUIZVILLA.ext@viaccess-orca.com"
              }
            }
          }
        }
      };
      ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
        .then(result => {
         console.log("WE FUCKING DID IT");
         event.sender.send('canalsat-mail-sent',result);
        })
        .catch(err => {
         console.log("yo colombian ass can do better fam!");
         event.sender.send('canalsat-mail-sent',err.message);
        });

    });

    //Adding the necessary header to the soap request

});







//closes the app when the window is closed
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
