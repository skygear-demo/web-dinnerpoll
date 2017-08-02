// Include Skygear 
  skygear.config({
    'endPoint': 'https://dinnerpollpoly.staging.skygeario.com/',
    'apiKey': '129b9168991f433ea5f6cfa87d946714',
  }).then(function () {
    console.log('skygear container is now ready for making API calls.');
    updateAppView();
    if (skygear.currentUser) {
      startAutoReload();
    }

  }, function(error) {
    console.error(error);
  });


// Views
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


// Views Actions
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

function showLoginBox(e) {
  e.preventDefault();
  signupBox.hide();
  loginBox.show();
}

function showSignupBox(e) {
  e.preventDefault();
  signupBox.show();
  loginBox.hide();
}