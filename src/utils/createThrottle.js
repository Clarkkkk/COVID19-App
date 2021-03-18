function createThrottle(time = 1000) {
  let id = 0;
  let run;
  return function(fn, thisArg) {
    run = fn;
    if (!id) {
      id = setTimeout(() => {
        thisArg ? run.call(thisArg) : run();
        id = 0;
      }, time);
    }
  };
}
