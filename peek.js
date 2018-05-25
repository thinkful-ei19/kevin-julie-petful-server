function peek(queue) {
    if (queue.first === null) {
      return 'No Data';
    }
    
    return queue.first.value;
}

module.exports = peek;