<div id="tab">Loading...</div>

<script>
function getData() {
  $.ajax({
    url: "<GOOGLE SHEET APP SCRIPT DEPLOYMENT WEB CODE URL HERE>?range=<RANGEA>:<RANGEB>",
    method: "GET",
    dataType: "json"
  }).done(function(data) {
    createTable('tab', data, 'auto');
  });
}

function createTable(tab, data, width) {
  var tar = document.getElementById(tab);
  var table = document.createElement('TABLE');

  table.border = '1';

  var tbdy = document.createElement('TBODY');

  table.appendChild(tbdy);


  for (var j = 0; j < data.length; j++) {
    var tr = document.createElement('TR');
    tbdy.appendChild(tr);

    for (var k = 0; k < data[j].length; k++) {
      var td = document.createElement('TD');
      td.width = width;
      
      if (j == 0)
      	td.innerHTML = data[j][k].bold();
      else
          td.innerHTML = data[j][k];
          
      tr.appendChild(td);
    }
  }

tar.innerHTML = "";
  tar.appendChild(table);
}

getData();
</script>