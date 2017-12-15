// Login logic
const user = skygear.currentUser;

const handler = skygear.auth.onUserChanged(function (user) {
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
  skygear.auth.loginWithUsername(username, password).then(function(user) {
    console.log(user); // user object
  }, function(error){
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
  if(checkSignupInfo(username, password, passwordConfirm)) {
    skygear.auth.signupWithUsername(username, password).then(function(user) {
      console.log(user); // user object
      swal({
        title: "Welcome",
        text: "Thanks for signing up!",
        type: "success",
        confirmButtonText: "Next"
      });

    }, function(error) {
      swal({
        title: "Error!",
        text: "Hey, "+error.error.message,
        type: "error",
        confirmButtonText: "Okay"
      });
    });
  }
}

function logout () {
  skygear.auth.logout().then(function() {
    console.log('logout successfully');
  }, function(error)  {
    console.error(error);
  });
}

// User Profile
function getUserProfile () {
  const query = new skygear.Query(skygear.UserRecord);
  query.equalTo('_id', skygear.auth.currentUser.id);
  skygear.publicDB.query(query).then(function(records) {
    const profile = records[0];
    console.log(profile);
  }, function(error) {
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
