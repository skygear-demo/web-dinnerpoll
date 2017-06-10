var autoReloadChart;

 function startAutoReload() {
  console.log("auto reload");
  autoReloadChart = setInterval(function(){reloadChart()}, 3000);
}

function stopAutoReload() {
  console.log("stoped auto reload");
  clearTimeout(autoReloadChart);
}

//Using pubsub (comment line 3-11, uncomment the following lines to enable pubsub auto reload)

// function startAutoReload() {
//   console.log("auto reload");
//   skygear.on('voted', (data) => {
//     console.log(data)
//   });
// }

// function stopAutoReload() {
//   console.log("stoped auto reload");
//   skygear.off('voted');
// }
