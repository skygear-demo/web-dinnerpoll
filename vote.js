const Vote = skygear.Record.extend('vote');
const LIMIT = 9999;


// Poll Logic
function castVote (e) {
  e.preventDefault();
  var choice = $(e.target).data("choice");
  const voter = new skygear.Reference(
    "user/" + skygear.auth.currentUser.id
  );

  const vote = new Vote({
    choice: choice
  });

  skygear.publicDB.save(vote).then(function(){
    reloadChart();
    skygear.pubsub.publish('voted',{choice:vote.choice});
  });
}

// Show poll Logic
function loadChartData () {
  return new Promise(function(resolve, reject) {
    var results = {};

    const query = new skygear.Query(Vote);
    query.overallCount = true;
    query.limit = LIMIT;
    skygear.publicDB.query(query).then(function(votes) {
      console.log(votes)
      console.log(votes.constructor)
      var v = Array.from(votes)
      if (votes.length > 0) {
        console.log('%d votes matching query.', votes.overallCount);
        votes.reduce(function(previousValue, currentValue, currentIndex, array) {
          var choice = currentValue.choice;
          if (choice in results) {
            results[choice] += 1;
          } else {
            results[choice] = 1;
          }
          return results;
        });
      }

      resolve(results);
    }, function(error) {
      console.error(error);
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
