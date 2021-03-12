class ExecuteQueue {
  constructor() {
    this._queue = [];
    this._executing = false;
  }

  push(priority, func, thisArg) {
    this._queue.push({
      priority,
      timestamp: Date.now(),
      func: func.bind(thisArg)
    });
    // wait for multiple pushes
    // and then trigger the first execution
    setTimeout(() => this._execute(), 0);
  }

  // used for external asynchronous signal to trigger the next execution
  async next() {
    this._executing = false;
    await this._execute();
  }

  // execute the function, and then wait for the asynchronous signal
  // it won't execute while waiting
  async _execute() {
    if (this._executing || !this._queue.length) {
      return;
    } else {
      this._executing = true;
    }

    // execute the function with highest priority
    this._sortQueue();
    const entry = this._queue.pop();
    await entry.func();
  }

  // sort the queue with priority
  // if priority is the same
  // ensure that the earlier function is executed before the later one
  _sortQueue() {
    this._queue.sort((a, b) => {
      if (a.priority === b.priority) {
        return b.timestamp - a.timestamp;
      } else {
        return a.priority - b.priority;
      }
    });
  }
}

export default ExecuteQueue;