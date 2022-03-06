<script src="jquery-3.3.1.min.js"></script>

<script>

$.ajax({
url:"<GOOGLE_SHEET_SCRIPT_DEPLOYMENT_URL_HERE>?column=GOOGLE_SHEET_COLUMN_TITLE_HERE&amount=1",
method: "GET",
dataType: "json"
}).done(function(data) 
{
// Initilise Variables
var DataArray, DisplayArray;
// Sets the DataArray to what was returned from the google sheet
DataArray = data;
// Sets the default value of the DisplayArray to nothing...
DisplayArray = "";
// For Each element in the DataArray, add a <br> (a break/new line) to the string
for (i in DataArray) 
{
	DisplayArray += DataArray[i] + "<br>";
}
// Sends the final DisplayArray to the HTML code that is above this script 
document.getElementById("TestElement").innerHTML = DisplayArray;
});
</script>