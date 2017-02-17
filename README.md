# Web app: Polling for dinner
A web-based serverless polling app using [Skygear](https://skygear.io) as cloud database.

# External libraries
- Using Skygear as Backend
- Using [Chart.js](http://www.chartjs.org/)
- Using [Flat UI Free](http://designmodo.github.io/Flat-UI/)

# Guide

This guide will show you how to build this app using the simplest with HTML5 and Skygear JavaScript SDK.


To get a easier start, you can download 

## Installing JavaScript SDK
We will install Skygear JS SDK via CDN.

``` html
<script src="https://code.skygear.io/js/polyfill/latest/polyfill.min.js"></script>
<script src="https://code.skygear.io/js/skygear/latest/skygear.min.js"></script>
```

Setting up the endpoint

``` javascript 
  skygear.config({
    'endPoint': 'https://<appname>.skygeario.com/',
    'apiKey': '<APIKEY HERE>',
  }).then(() => {
    console.log('skygear container is now ready for making API calls.');
    updateAppView();
    if (skygear.currentUser) {
      startAutoReload();
    }
  }, (error) => {
    console.error(error);
  });

```

## Authenticate users

Document for [User Authentication Basics](https://docs.skygear.io/guides/auth/basics/js/)

### Create a signup page

[Sign up a user](https://docs.skygear.io/guides/auth/basics/js/)

### Create a login page

[Login a user](https://docs.skygear.io/guides/auth/basics/js/)

## Cast a vote
### Cast a vote and save the record in the cloud

You can consider casting a vote as a simple record saving task.
Here is the exact breakdown of the steps:

1. Create a Vote record
2. Save the record to the cloud database
3. Get the callback and update the layout

You can imagine that would be API endpoints and ajax request between your app and the server. Alternatively, we often use [Backbone.js](http://backbonejs.org/) to manage this kind of data model.

Using the Skygear CloudDB, you will be encapsulated from the underlying layer - no more worry about the requests and API endpoints. You just need to deal with the native objects.

You save the object. You query a list of objects.


## How can I retrieve the result?
### Query and display the poll result from cloud database

[Query from cloud database](https://docs.skygear.io/guides/cloud-db/queries/js/)

## Get the result in real-time!
### Get real-time polling result without refreshing

[Skygear Pubsub](https://docs.skygear.io/guides/pubsub/basics/js/)

Subscribing to an event
```
skygear.on('ping', (data) => {
  console.log(data);
});
```

Publishing an event
```
skygear.on('ping', (data) => {
  console.log(data);
});
```


# Resources

- [[Repo] https://github.com/skygear-demo/web-dinnerpoll](https://github.com/skygear-demo/web-dinnerpoll)
- [[Demo] https://skygear-demo.github.io/web-dinnerpoll](https://skygear-demo.github.io/web-dinnerpoll)
- [[Docs] https://docs.skygear.io](https://docs.skygear.io)

