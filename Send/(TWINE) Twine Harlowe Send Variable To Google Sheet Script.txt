<script src="jquery-3.3.1.min.js"></script>

<script>

var sendData = 
[harlowe.State.variables['word'], "Nature"];

$.ajax({
url:"<GOOGLE_SHEET_SCRIPT_DEPLOYMENT_URL_HERE>?",
method: "POST",
dataType: "json",
data: JSON.stringify(sendData)
}).done(function() {});

</script>