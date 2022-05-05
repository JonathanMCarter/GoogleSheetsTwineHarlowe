/*
     Copyright (c) Jonathan Carter
     E: jonathan@carter.games
     W: https://jonathan.carter.games/

     Twine harlowe google sheet saving and loading of single cells script
     GET - returns the word or words up until the desired amount, or as many as there are if not enough
     POST - adds the inputted word from twine to the sheet this script is linked to on the sheet defined below
*/
// Make sure this is the sheet you wish to write to... (default is 'DATA')
var SHEET_NAME = "DATA";

// Used to access the sheet to return data later on
var SCRIPT_PROP = PropertiesService.getScriptProperties();
 


// Calls the Custom Get Function & returns its return value
function doGet(e) 
{
  return getValues(e);
}

 
function doPost(e)
{
 return addWordToSheet(e);
}
 



// Gets the values in the range defined and returns them...
function getValues(e)
{
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);

    var rangeRaw = e.parameter.range;

    var rangeSplit = rangeRaw.toString().split(':');
    var reg = new RegExp("[A-Z]");

    var startColumn = letterToColumn(reg.exec(rangeSplit[0]).toString());
    var endColumn = letterToColumn(reg.exec(rangeSplit[1]).toString());
    var startRow = rangeSplit[0][1];
    var endRow = rangeSplit[1][1];
  
    // Needed to get data
    var data = sheet.getRange(startRow, startColumn, endRow - startRow + 1, endColumn - startColumn + 1).getValues();
    data = clearNullsFromArray(data); // Removes blanks & no responses that it gets at the same time...

    return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// Credit
// https://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
function letterToColumn(letter)
{
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }

  return column;
}



// Clears any null or blank cells from the result as best as it can...
function clearNullsFromArray(data)
{
    var filteredData = [];
  
    for (var i = 0; i < data.length; i++)
    {
        if (data[i] != "" && data[i] != null)
        {
          filteredData.push(data[i]);
        }
    }

    return filteredData;
}


// Custom Alterations that allow the inputted data to be placed into any column defined by the user
// In Twine the following should be sent a word to the sheet - (word to input, column name) 
// This makes e[0] = the word the user added & e[1] the column that it shoudl be inserted into
function addWordToSheet(e)
{
  // Stops data overriding by accident
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  
  try
  {
    // Sets where the input is written (this one just gets the sheet name)
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    var data = e.postData.contents;
    var data = JSON.parse(eData); //parse the postData from JSON
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var dataToInsert = []; 
    
    var colToAddTo = 2;
    
    // Tries to find the column the user has inputted, this will fail if the user fails to define a column it should defalt to the next free column
    for (i in headers)
    {
        if (data[1].length > 0)
        {
            if (headers[i] == data[1])
            {
                colToAddTo = i;
                break;
            }     
        }
        else
        {
            // should get the last column if  the user failed to pass in a value for the column
            colToAddTo = sheet.getLastColumn();
            break;
        }
    }
   
    
    
    // Adds the timestamp column value assuming there is a column before the column that has been found
    if (headers[colToAddTo-1] == "Timestamp")
    {
        dataToInsert.push(new Date());
    } 
    
    
    
    // Finds the last row in the column we plan to add the data to
    var lastRow = 0;
    var numRowsss = sheet.getLastRow();
    var readData = sheet.getRange(2, colToAddTo, numRowsss).getValues();


    // finds the first free row, from the top as going from the bottom is wayyyyy to slow...
    
    for (i = 0; i < readData.length; i++)
    {
        if (readData[i][0] == "")
        {
            lastRow = i+2;
            break;
        }
    }

    
    // adds the data that was inputted in twine to be added
    dataToInsert.push(data[0]);


    // Sends the data to the sheet...
    sheet.getRange(lastRow, colToAddTo, 1, dataToInsert.length).setValues([dataToInsert]);
    
    
    // return json success results
    return ContentService
           .createTextOutput(JSON.stringify({ "GetValue" : sheet.getRange(1, 1, 1, 1).getValue()}))
          .setMimeType(ContentService.MimeType.JSON);
  }
  catch(e)
  {
    // if error return this (not sure if its returning an error or what I ask it too)
    return ContentService
          .createTextOutput(JSON.stringify({"resuggglt":"It Broken, this error", "errgggor": sheet.getRange(1, 1, 1, 1).getValue()}))
          //.createTextOutput(JSON.stringify({"resuggglt":"It Broken, this error", "errgggor": e}))
          .setMimeType(ContentService.MimeType.JSON);
  }
  finally 
  { //release lock
    lock.releaseLock();
  }
  
}





function setup() 
{
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}