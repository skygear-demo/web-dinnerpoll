// Login logic
const user = skygear.currentUser;

const handler = skygear.onUserChanged(function (user) {
  if (user) {
    startAutoReload();
    console.log('user logged in or signed up');
  } else {
    stopAutoReload()
    console.log('user logged out or the access token expired');
  }
  updateAppView();
});

function checkSignupInfo(username, password, passwordConfirm) {
    if (username.length < 1) {
    swal({
      title: "Error!",
      text: "Please input a username",
      type: "error",
      confirmButtonText: "Okay"
    });
    return false;
  }
  if (password.length < 6) {
    swal({
      title: "Error!",
      text: "Password too short. Please make it 6 characters or more.",
      type: "error",
      confirmButtonText: "Okay"
    });
    return false;
  }
  if (password !== passwordConfirm) {
    swal({
      title: "Error!",
      text: "Hey, the password is incorrect!",
      type: "error",
      confirmButtonText: "Okay"
    });
    return false;
  }
  return true;
}

function login (username, password) {
  // TODO: implement login here

}

function signup (username, password, passwordConfirm) {
  if(checkSignupInfo(username, password, passwordConfirm)) {
    // TODO: implement signup here


  }
}

function logout () {
  // TODO: implement logout here
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

// Events subscription
loginLink.on("click", showLoginBox);
signupLink.on("click", showSignupBox);

loginSubmitBtn.on("click", function(e) {
  login(loginName.val(),loginPass.val());
})

signupSubmitBtn.on("click", function(e) {
  signup(signupName.val(),signupPass.val(),signupPassConfirm.val());
})

logoutButton.on("click", function(e) {
  logout();
})
