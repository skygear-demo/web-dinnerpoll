const Vote = skygear.Record.extend('vote');

// Poll Logic
function castVote (e) {
  var choice = $(e.target).data("choice");
  const vote = new Vote({
    choice: choice
  });
  skygear.publicDB.save(vote).then(function(){
    reloadChart();
  });
}

// Show poll Logic
function loadChartData () {
  return new Promise(function(resolve, reject) {
    var results = {};

    const query = new skygear.Query(Vote);
    query.overallCount = true;
    skygear.publicDB.query(query).then((votes) => {
      console.log('%d records matching query.', votes.overallCount);
      console.log(votes);

      votes.reduce(function(previousValue, currentValue, currentIndex, array) {
        var choice = currentValue.choice;
        if (choice in results) {
          results[choice] += 1;
        } else {
          results[choice] = 0;
        }
        return results;
      });

      resolve(results);
    }, (error) => {
      console.error(error);
      reject(Error(error));
    });
  });
}

// function subscribeVoteChange() {
//   const Vote = skygear.Record.extend('vote');
//   const query = new skygear.Query(Vote);

//   var subscription = skygear.Subscription('all votes');
//   subscription.query = query;
//   skygear.publicDB.saveSubscription(subscription);
//   const listener = skygear.addNotificationListener((notification) => {
//     if (notification.subscriptionID === 'all votes') {
//       consloe.log("changing");
//     }
//   });
// }
// subscribeVoteChange();

function reloadChart () {
  loadChartData().then(function(results){
    // console.log(Object.keys(results), Object.values(results));
    updateData(Object.keys(results), Object.values(results));
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