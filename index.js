require('./dist/js/flat-ui.js');


// Include Skygear 
skygear.config({
  'endPoint': 'https://dinnerpoll.skygeario.com/', // trailing slash is required
  'apiKey': 'ae9bb687d6b743b9803f96e8b3e4d970',
}).then(() => {
  console.log('skygear container is now ready for making API calls.');
}, (error) => {
  console.error(error);
});

// Login logic

// Poll Logic

// Show poll Logic