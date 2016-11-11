const Vote = skygear.Record.extend('vote');

// Poll Logic
function castVote (e) {
  var choice = $(e.target).data("choice");
  const voter = new skygear.Reference(
    "user/" + skygear.currentUser.id
  );
  const vote = new Vote({
    choice: choice,
    voter: voter
  });
  skygear.publicDB.save(vote).then(function(){
    reloadChart();
    skygear.pubsub.publish('ping',{action:"vote"});
  });
}

// Show poll Logic
function loadChartData () {
  return new Promise(function(resolve, reject) {
    var results = {};

    const query = new skygear.Query(Vote);
    query.overallCount = true;
    query.limit = 9999;
    skygear.publicDB.query(query).then((votes) => {
      console.log(votes)
      if (votes.length > 0) {
        console.log('%d votes matching query.', votes.overallCount);
        votes.reduce(function(previousValue, currentValue, currentIndex, array) {
          var choice = currentValue.choice;
          if (choice in results) {
            results[choice] += 1;
          } else {
            results[choice] = 0;
          }
          return results;
        });
      }

      resolve(results);
    }, (error) => {
      console.error(error);
      reject(Error(error));
    });
  });
}

function reloadChart () {
  console.log("reload Chart")
  loadChartData().then(function(results){

    // fix order
    const ordered = {};
    Object.keys(results).sort().forEach(function(key) {
      ordered[key] = results[key];
    });

    console.log(Object.keys(ordered), Object.values(ordered));
    updateData(Object.keys(ordered), Object.values(ordered));
  });
}


var barChartData = {}

function updateData (labels, pollData) {
  barChartData.datasets[0].data = pollData;
  barChartData.labels = labels;
  window.pollBar.update();
}

function displayChart() {
  var color = Chart.helpers.color;
  barChartData = {
      labels: [],
      datasets: [{
          label: 'Vote numbers',
          backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
          borderColor: window.chartColors.red,
          borderWidth: 0,
          data: []
      }]
  };
  window.onload = function() {
      var ctx = document.getElementById("canvas").getContext("2d");
      window.pollBar = new Chart(ctx, {
          type: 'bar',
          data: barChartData,
          options: {
              responsive: true,
              legend: {
                  position: 'top',
              },
              title: {
                  display: true,
                  text: 'Polling Result'
              },
               scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    }
                }]
            }
          }
      });
  };
}

displayChart(['burger', 'chasiu', 'noodles', 'pizza'],[0,0,0,0]);


voteButton.on("click", castVote);
reloadChart();