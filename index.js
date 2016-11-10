var loginViewEl = $("#login-view");
var dashboardViewEl = $("#dashboard-view");
var logoutButtonEl = $("#dashboard-view");

var loginSubmitBtn = $(".login-button");
var loginName = $("#login-name");
var loginPass = $("#login-pass");

var signupSubmitBtn = $(".signup-button");
var signupName = $("#signup-name");
var signupPass = $("#signup-pass");
var signupPassConfirm = $("#signup-pass-confirm");

var loginBox = $("#login-box");
var signupBox = $("#signup-box");

var loginLink = $(".login-switch");
var signupLink = $(".signup-switch");

var logoutButton = $(".logout-button")


var voteButton = $(".vote-button");

// Include Skygear 
  skygear.config({
    'endPoint': 'https://dinnerpoll.skygeario.com/', // trailing slash is required
    'apiKey': 'ae9bb687d6b743b9803f96e8b3e4d970',
  }).then(() => {
    console.log('skygear container is now ready for making API calls.');
    updateAppView();
  }, (error) => {
    console.error(error);
  });


const Vote = skygear.Record.extend('vote');

// Login logic
const user = skygear.currentUser;

const handler = skygear.onUserChanged(function (user) {
  if (user) {
    console.log('user logged in or signed up');
  } else {
    console.log('user logged out or the access token expired');
  }
  updateAppView();
});


function login (username, password) {
  skygear.loginWithUsername(username, password).then((user) => {
    console.log(user); // user object
  }, (error) => {
    console.error(error);
    swal({
      title: "Error!",
      text: "Hey, "+error.error.message,
      type: "error",
      confirmButtonText: "Okay"
    });
  })
}

function signup (username, password, passwordConfirm) {
  if (username.length < 1) {
    swal({
      title: "Error!",
      text: "Please input a username",
      type: "error",
      confirmButtonText: "Okay"
    });
    return;
  }
  if (password.length < 6) {
    swal({
      title: "Error!",
      text: "Password too short. Please make it 6 characters or more.",
      type: "error",
      confirmButtonText: "Okay"
    });
    return;
  }
  if (password !== passwordConfirm) {
    swal({
      title: "Error!",
      text: "Hey, the password is incorrect!",
      type: "error",
      confirmButtonText: "Okay"
    });
    return;
  }

  skygear.signupWithUsername(username, password).then((user) => {
    console.log(user); // user object
    swal({
      title: "Welcome",
      text: "Thanks for signing up!",
      type: "success",
      confirmButtonText: "Next"
    });

  }, (error) => {
    swal({
      title: "Error!",
      text: "Hey, "+error.error.message,
      type: "error",
      confirmButtonText: "Okay"
    });
  });
}

function logout () {
  skygear.logout().then(() => {
    console.log('logout successfully');
  }, (error) => {
    console.error(error);
  });
}

// User Profile
function getUserProfile () {
  const query = new skygear.Query(skygear.UserRecord);
  query.equalTo('_id', skygear.currentUser.id);
  skygear.publicDB.query(query).then((records) => {
    const profile = records[0];
    console.log(profile);
  }, (error) => {
    console.error(error);
  });

}

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

// Views update

function updateAppView() {
  if(skygear.currentUser != null) {
    // logged in
      loginViewEl.hide();
      dashboardViewEl.show();

  } else {
    // not logged in
      loginViewEl.show();
      dashboardViewEl.hide();
  }
}

function showLoginBox() {
  signupBox.hide();
  loginBox.show();
}

function showSignupBox() {
  signupBox.show();
  loginBox.hide();
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

function reloadChart () {
  loadChartData().then(function(results){
    // console.log(Object.keys(results), Object.values(results));
    updateData(Object.keys(results), Object.values(results));
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
displayChart(['burger', 'chasiu', 'noodles', 'pizza'],[0,0,0,0]);
reloadChart();

// Events subscription
loginLink.on("click", showLoginBox);
signupLink.on("click", showSignupBox);

loginSubmitBtn.on("click", function() {
  login(loginName.val(),loginPass.val());
})

signupSubmitBtn.on("click", function() {
  signup(signupName.val(),signupPass.val(),signupPassConfirm.val());
})

logoutButton.on("click", function() {
  logout();
})

voteButton.on("click", castVote);
