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
  return GetValues(e);
}

 
function doPost(e)
{
 return AddWordToSheet(e);
}
 



// Gets the values in Column 2, Row 1 and returns them in a JSON string to be used in engine
function GetValues(e)
{
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
  
    // Needed to get data
    var colToRead = 0;
    var headersss = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
    
    for (var i = 0; i < headersss.length; i++)
    {
        if (headersss[i] == e.parameter.column)
        {
          colToRead = i+1;
          break;
        }
      
    }
  
  
  
    var numRows = sheet.getLastRow();
    var readData = sheet.getRange(2, colToRead, numRows).getValues();
    var rowLimit = 0;
  
    // finds the first free row, from the top as going from the bottom is wayyyyy to slow...
    for (var i = 0; i < readData.length; i++)
    {
        if (readData[i][0] == "")
        {
            rowLimit = i;
        }
    }
  
  
  
    // Array that holds all the words you wish to get - removes blanks & no responses that it gets at the same time
    var Array = sheet.getRange(2, colToRead, rowLimit).getValues();
    var ClearedArray = [];
    var DupsArray = [];
  
    for (var i = 0; i < Array.length; i++)
    {
        if (Array[i] != "")
        {
            if (Array[i] != "no response")
            {
                ClearedArray.push(Array[i]);
            }
        }
    }
  

  
    // Checks for duplicate words (not perfect, as it can't check for capitals right now - been hard enough getting it to work in the first place, 0 debugging tools make this really hard for what it is!!!!)
    // Sadly this bit was not my work, google was my friend here as every version of an array duplicate check i knew of just would not work with this language, thankfully this did, credit below
    // Soruce: https://stackoverflow.com/questions/16747798/delete-duplicate-elements-from-an-array
    // Credit: Denys Séguret, 2013
    var m = {}, newarr = []
    
    for (var i = 0; i < ClearedArray.length; i++) 
    {
        var v = ClearedArray[i];
        
        if (!m[v]) 
        {
            newarr.push(v);
            m[v]=true;
        }
    }
  
    DupsArray = newarr;
  
  
  
  
    var RandNumbersArray = [];  
  
    // getting random numbers - but no repeats!
    // Once again not mine, but adapted for this project
    // Source: https://stackoverflow.com/questions/8378870/generating-unique-random-numbers-integers-between-0-and-x
    // Credit: Rob W & user11748261, 2020
  
    var limit = DupsArray.length,
    amountcheck = e.parameter.amount,
    unique_random_numbers = [];

  
    while (unique_random_numbers.length < limit) 
    {
        var random_number = Math.floor(Math.random()*DupsArray.length-1) + 1;
      
        if (random_number != DupsArray.length)
        {
            if (unique_random_numbers.indexOf(random_number) == -1) 
            { 
                unique_random_numbers.push( random_number );
            }
        }
    }
  
    RandNumbersArray = unique_random_numbers;

  
  
    //Randomising the resulting elements to be sent back to Twine for use (also limits to the number you request in the params you send to this script)
    var FinalArray = [];

    for (var i = 0; i < e.parameter.amount; i++) 
    { 
        if (RandNumbersArray[i] == null)
        {
           FinalArray.push("");
        }
        else
        {
           FinalArray.push(DupsArray[RandNumbersArray[i]]);
        }
    }

    
    return ContentService
    .createTextOutput(JSON.stringify(FinalArray))
    .setMimeType(ContentService.MimeType.JSON);
}






// A little function that gets the number of rows inn the sheet
// https://www.portent.com/blog/analytics/google-app-script-1.htm
function FindRows(colToCheck2) 
{    
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    var numRows2 = sheet.getLastRow();
    var readData2 = sheet.getRange(2, colToCheck2, numRows2).getValues();

    // finds the first free row, from the top as going from the bottom is wayyyyy to slow...
    for (var i = 0; i < readData2.length; i++)
    {
        if (readData2[i][0] == "")
        {
            return i+1;
        }
    }
}




// Gets the defined number of array values and returns them
function ChooseRandom(Input, NumberToCheck)
{
  var RtnArray = [];
  var MaxNumber = FindRows(2);
  
    if (Input.length > 0)
    {
        var NumberofWords = NumberToCheck;

        if (Input.length < NumberofWords)
        {
            for (var i = 0; i < Input.length; i++)
            {
                var value = "";
    
                // stops if the new value is already in the new array
                //while (RtnArray.indexOf(value) != -1)
                //{
                    value = Input[GetRandomIntValue(MaxNumber)]; 
                //}
        
                RtnArray.push(value);
            }
        }
    }
    else
    {
        RtnArray.push("Error Code 1: No values found on file.");
    }
  
  return RtnArray;
}



// gets a random int value between 1 & the max number of rows
function GetRandomIntValue(Max)
{
  var Number = Math.floor((Math.random() * Max))
  return Number;
}





// Custom Alterations that allow the inputted data to be placed into any column defined by the user
// In Twine the following should be sent a word to the sheet - (word to input, column name) 
// This makes e[0] = the word the user added & e[1] the column that it shoudl be inserted into
function AddWordToSheet(e)
{
  // Stops data overriding by accident
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  
  try
  {
    // Sets where the input is written (this one just gets the sheet name)
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    
    //var postData = e.postData.contents; //my code uses postData instead
    
    var eData = e.postData.contents;
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