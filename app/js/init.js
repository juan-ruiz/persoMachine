var EWS = require('node-ews');

// exchange server connection info
var username = 'ruizvilla';
var password = 'Password2014';
var host = 'https://mobi.purpledrm.com/';

// disable ssl verification
var options = {
//  rejectUnauthorized: false,
//  strictSSL: false
};

// initialize node-ews
var ews = new EWS(username, password, host, options);

// Get Mails
var ewsFunction = 'FindItem';
var ewsArgs = {
    attributes: {
        Traversal: 'Shallow'
    },
    ItemShape: {
        BaseShape: 'IdOnly',
        AdditionalProperties: {
            FieldURI: {
                attributes: {
                    FieldURI: 'item:Subject'
                }
            }
        }
    },
    ParentFolderIds: {
        DistinguishedFolderId: {
            attributes: {
                Id: 'deleteditems'
            }
        }
    }
};

// query ews, print resulting JSON to console
ews.run(ewsFunction, ewsArgs)
  .then(result => {
    var container = document.getElementById("cont");
    container.innerHTML=JSON.stringify(result);
  })
  .catch(err => {
    var container = document.getElementById("cont");
    container.innerHTML=JSON.stringify(err.message);
  });
