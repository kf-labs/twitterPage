// TODO
// add "turn off"
// output type selection
// emotion statistics
let token ="";
let code = "";
let myAddress = "https://XXX.netlify.app";

let cId = "";
let org = "";

const exchange_code = () => {
  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'https://URL',
    data: {
      'grant_type': 'authorization_code',
      'code': code,
      'client_id': cId, // not used
      'client_secret': "", // filled on server
      'redirect_uri': myAddress // used for flexibility in deployment of frontend
    }
  })
    .then((response) => {
      console.log(response);
      org = response.data.org;
      document.getElementById("display_mode").value = response.data.display_mode;
      document.getElementById("threshold-input").value = response.data.threshold;
      document.getElementById("recipients").value = response.data.recipients;
      drawChart("All", response.data.stats.emo_sums, response.data.stats.messages_analyzed,
        response.data.stats.start_date)
      drawChart("Recent", response.data.statsRecent.emo_sums, response.data.statsRecent.messages_analyzed,
        response.data.statsRecent.start_date)
    }, (error) => {
      console.log(error);
    });
  ;
}

  google.charts.load("current", {packages:["corechart"]});
  //google.charts.setOnLoadCallback(drawChart);
  function drawChart(name, stats, total, startDate) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Emotion');
    data.addColumn('number', 'Count');
 //   {'joy': 0.9853166, 'disgust': 0.00091473624, 'fear': 6.750398e-05, 'shame': 0.00835823, 
 //'anger': 4.433252e-05, 'guilt': 0.005137451, 'sadness': 0.00016111718}

 /*
    data.addRow(['joy', parseInt(stats.joy)]);
    data.addRow(['disgust', parseInt(stats.disgust)]);
    data.addRow(['fear', parseInt(stats.fear)]);
    data.addRow(['shame', parseInt(stats.shame)]);
    data.addRow(['anger', parseInt(stats.anger)]);
    data.addRow(['guilt', parseInt(stats.guilt)]);
    data.addRow(['sadness', parseInt(stats.sadness)]);
    */
    console.log(stats.joy);
    data.addRow(['joy', parseFloat(stats.joy)]);
    data.addRow(['disgust', parseFloat(stats.disgust)]);
    data.addRow(['fear', parseFloat(stats.fear)]);
    data.addRow(['shame', parseFloat(stats.shame)]);
    data.addRow(['anger', parseFloat(stats.anger)]);
    data.addRow(['guilt', parseFloat(stats.guilt)]);
    data.addRow(['sadness', parseFloat(stats.sadness)]);
    /*arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ]);*/

    var emos = 
    (parseFloat(stats.joy) +
    parseFloat(stats.disgust) +
    parseFloat(stats.fear) +
    parseFloat(stats.shame) +
    parseFloat(stats.anger) +
    parseFloat(stats.guilt) +
    parseFloat(stats.sadness))  
    var tot = parseFloat(total);
    var emoPerc = (emos/tot * 100.0) || 0;

    var options = {
      title: name + ' emotions detected in ' + emoPerc.toFixed(2) + '% (' + parseInt(emos) + '/' + total + ') of client messages since ' + startDate,
      pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'+name));
    chart.draw(data, options);
  }

const emo_query_1 = () => {
  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'https://kflabs.ml:1500/twitter/emotion',
    data: {
      'display_mode': document.getElementById("display_mode").value,
      'threshold': 0.9,
      'text': document.getElementById("textInput").value
    }
  })
    .then((response) => {
      console.log(response);
      document.getElementById("textOutput").textContent = response.data;
      //emos = JSON.parse(response.data);
      //console.log(emos);
      //console.log(response.data.joy);
      //drawChart("All", response.data, 1, "ble")
      //drawChart("Recent", response.data, 1, "ble")
      //drawChart("Recent", response.data)
    }, (error) => {
      console.log(error);
    });
  ;
}
