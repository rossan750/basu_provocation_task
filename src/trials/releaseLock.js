const releaseLock = () => {
    return {
      type: 'call_function',
      async: true,
      func: (done) => {
        document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

        document.exitPointerLock();

        done()
      }
    }
}

export default releaseLock
