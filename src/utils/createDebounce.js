const createDebounce = (time = 500) => {
  let id = 0;
  let timestamp = 0;
  return function(fn, thisArg) {
    if (id) {
      clearTimeout(id);
    } else {
      timestamp = Date.now();
    }
    id = setTimeout(async () => {
      fn = thisArg ? fn.bind(thisArg) : fn;
      await fn();
      id = 0;
      // console.log(`debuonce run after ${Date.now() - timestamp}ms.`);
    }, time);
  };
};

export default createDebounce;
