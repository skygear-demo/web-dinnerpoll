var autoReloadChart;

// function startAutoReload() {
//   console.log("auto reload");
//   autoReloadChart = setInterval(function(){reloadChart()}, 3000);
// }

// function stopAutoReload() {
//   console.log("stoped auto reload");
//   clearTimeout(autoReloadChart);
// }

// Using pubsub
function startAutoReload() {
  console.log("auto reload");
  skygear.on('ping', (data) => {
    reloadChart()
  });
}

function stopAutoReload() {
  console.log("stoped auto reload");
  skygear.off('ping');
}

