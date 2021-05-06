// TODO
// add "turn off"
// output type selection
// emotion statistics
let token ="";
let code = "";
let myAddress = "https://vigorous-torvalds-5f1600.netlify.app";

let cId = "6e8eb2dd76c604cfdb652edb33d111bd";
let org = "";

const instance = AccountsSDK.init({
  client_id: cId,
  response_type: "code",
  prompt: "consent",
  onIdentityFetched: (error, data) => {
    if (data) {
      console.log("User authorized!");
      console.log("License number: " + data.license);
      console.log(data);
      code = data.code;

      document.getElementById("livechat-login-button").style.display = "none";
      document.querySelector(".authorization").style.display = "none";//.innerHTML = "Authorized!";
      document.getElementById("livechat-authorization-done").style.display = "block";
      document.querySelector(".authorization-done").innerHTML =
        "Signed in as: " + data.entity_id;

      exchange_code();
    }
  }
});

const exchange_code = () => {
  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'https://kflabs.ml:1500/emobot/code',
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

    data.addRow(['joy', parseInt(stats.joy)]);
    data.addRow(['disgust', parseInt(stats.disgust)]);
    data.addRow(['fear', parseInt(stats.fear)]);
    data.addRow(['shame', parseInt(stats.shame)]);
    data.addRow(['anger', parseInt(stats.anger)]);
    data.addRow(['guilt', parseInt(stats.guilt)]);
    data.addRow(['sadness', parseInt(stats.sadness)]);
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

const incThr = () => {
      var x= document.getElementById("threshold-input");
      x.value = Math.min(parseFloat(x.value) + 0.1,1.0).toFixed(2);
}
const decThr = () => {
      var x= document.getElementById("threshold-input");
      x.value = Math.max(parseFloat(x.value) - 0.1,0.0).toFixed(2);
}

const save_settings = () => {
  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'https://kflabs.ml:1500/emobot/settings',
    data: {
      'org': org,
      'display_mode': document.getElementById("display_mode").value,
      'threshold': document.getElementById("threshold-input").value,
      'recipients' : document.getElementById("recipients").value
    }
  })
    .then((response) => {
      console.log(response);
      drawChart("All", response.data.stats.emo_sums, response.data.stats.messages_analyzed,
        response.data.stats.start_date)
      drawChart("Recent", response.data.statsRecent.emo_sums, response.data.statsRecent.messages_analyzed,
        response.data.statsRecent.start_date)
    }, (error) => {
      console.log(error);
    });
  ;
}

const reset_stats = () => {
  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'https://kflabs.ml:1500/emobot/reset_stats',
    data: {
      'org': org,
    }
  })
    .then((response) => {
      console.log(response);
      drawChart("All", response.data.stats.emo_sums, response.data.stats.messages_analyzed,
        response.data.stats.start_date)
      drawChart("Recent", response.data.statsRecent.emo_sums, response.data.statsRecent.messages_analyzed,
        response.data.statsRecent.start_date)
    }, (error) => {
      console.log(error);
    });
  ;
}

// not used
const list_archives = () => {
  axios({
    method: 'post',
    headers: {
      'Authorization': devToken,
      'Content-Type': 'application/json'
    },
    url: 'https://api.livechatinc.com/v3.2/agent/action/list_archives',
    data: {}
  })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  ;
}