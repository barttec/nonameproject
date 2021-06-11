function step(tframe) {
  if(tframe === undefined) {
    tframe = 1;
  } else {
    tframe++;
  }
  console.log('work');
  client.postMessage({
    msg: "WORK",
  });
  setTimeout(function(){step(tframe)},200);
}
step()