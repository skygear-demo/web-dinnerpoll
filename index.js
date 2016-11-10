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
function castVote (choice) {

}

// Show poll Logic
function loadChartData () {

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

function displayChart(pollData) {
  var color = Chart.helpers.color;
  var barChartData = {
      labels: ["Cha Siu", "Pizza Hut", "Noodles", "Burger"],
      datasets: [{
          label: 'Vote numbers',
          backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
          borderColor: window.chartColors.red,
          borderWidth: 0,
          data: pollData
      }]
  };
  window.onload = function() {
      var ctx = document.getElementById("canvas").getContext("2d");
      window.myBar = new Chart(ctx, {
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
              }
          }
      });
  };
}

displayChart([4,5,6,7]);

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