<b>Due to a high volume of request for this script/solution I have made this repository to provide the code to all who need it. Some info on what is what and how to set things up is below.</b>

This repository stores a solution I developed from an existing solution that was broken in the latest version of Twine at the time. This solution is built for the use case it was needed for, which was to send and get data from a sheet filling up columns and returning a random selection of cells from the column desired. 

Now I don't actually use Twine or google sheet code personally, so my experience is limited, and this solution is not perfect. But hopefully this will help you get and send data well enough for your project. 

# Usage & Setup
## Send Script (Twine Harlowe)
In twine you'll need to setup a script to send the data to the sheet, this is found in the send folder of this repo as a .js file. In this file there are 2 lines to change for your project:

> var sendData = [harlowe.State.variables['word'], "Nature"];

This is the data that is sent to the sheet, in this case a string field called <b>word</b> that holds the data. The second string <b>"Nature"</b> defines the column the string should be placed in. 

> url:"<GOOGLE_SHEET_SCRIPT_DEPLOYMENT_URL_HERE>?"

Pretty obvious, but this is where you need to put the deployment URL from the google sheet script that you are using for the data to send.

When all done it should look something like this

![Harlowe Send Example](https://user-images.githubusercontent.com/33253710/156921424-c2abc335-d63a-42d0-94e9-407c41613672.png)


## Google Sheet Script
For the google sheet side of things you will need a sheet setup and you'll need to add the script in the google folder of this repo into an appscript for use. For reference of App Script setup & Deployment, see this: https://developers.google.com/apps-script/concepts/deployments.

The script is set for the solution I built it for, adding data and getting a random result. You don't need to change anything here other than the sheet name value near the top of the script, or you can just name the tab DATA to avoid issues. Make sure you deploy the script so it can be used in the twine scripts such as the one above. 

> var SHEET_NAME = "DATA";

Above is the line to edit if the name is different. 

If you just want the get and set with no random then you'll only need the AddWordToSheet() & GetValues() methods in theory (I haven't test this or used in since I made it in 2020 so no promises). 
<br><br>
## Get Script (Twine Harlowe)
The get script has a little bit more going on but is similar in setup to the send one. This setup is set to define the amount of strings to return and more. Here's what you'd need to change...

> url:"<GOOGLE_SHEET_SCRIPT_DEPLOYMENT_URL_HERE>/exec?column=GOOGLE_SHEET_COLUMN_TITLE_HERE&amount=1",

This line defines the sheet deployment, column to find & the amount of strings to return. replace:<br>
GOOGLE_SHEET_SCRIPT_DEPLOYMENT_URL_HERE - With the deployment URL<br>
GOOGLE_SHEET_COLUMN_TITLE_HERE - With the column name in the sheet to find<br>
amount=1 - With the amount you want to get. Set it high or to the desired amount if you are using the script as is. This was built for the solution I was making specifically.

> document.getElementById("<FIELD_NAME_HERE>").innerHTML = DisplayArray;

Here you need to place the field name with the field you wish to show. The example uses <b>"TestElement"</b> as its field to fill.

> id="TestElement">Loading

Here you just need to update the id to match whatever you changed it to from the last line edit. 
  
When done it should look something like this.
  
![Harlowe Get Example](https://user-images.githubusercontent.com/33253710/156921501-be3c136a-0682-47fd-a2a6-116d63e26f3a.png)


  
<br><br>
## Useful Links
Google Sheet App Script Setup: https://developers.google.com/apps-script/guides/sheets/macros

## F.A.Q
> Can I use this code in my project?

Of-course, all I ask is that you abide the licence on this repo and provide credit/attribution where necessary.

> Can you edit this for my game?

While it would be nice, I simply can't guarantee I'll have the time to do so as I have loads of other more active projects in my actual field of game development to work on instead of this. 

> I have a better solution; can I contribute it to this repo?

Of-course, submit a pull request or issue to this repo and I'll take a look at it when I get a moment to do so. 

> I need help setting this up!

If you still need help, I can provide some basic setup help getting the script working, but nothing more in-depth at this time. My email is on my profile should you need my help further.  

## Contribute
I'm happy to take and accept pull requests that clean up the existing logic and provide a better solution for more general usage. Unlike mine which was specifically built for the use-case of the client. Any whom I accept will get credited in this readme as contributors.  

## Author
- Jonathan Carter

## Credit
- Original source code which I edited/built on for this solution: https://johnastewart.org/coding/twine-game-data-to-google-sheets-via-javascript-version-2/
- Credit for some methods used are in the source code comments.

## Licence
MIT Licence
