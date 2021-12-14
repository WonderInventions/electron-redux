// We use this variable to store a stack trace of where the middleware
// is first initialized, to assist in debugging if someone accidentally enables
// it twice. This can easily be caused by importing files that are shared between
// the main and renderer processes.
let previouslyInitialized;
const preventDoubleInitialization = () => {
  if (previouslyInitialized) {
    console.error(new Error('electron-redux has already been attached to a store'));
    console.error(previouslyInitialized);
  } // We are intentionally not actually throwing the error here, we just
  // want to capture the call stack.


  previouslyInitialized = new Error('Previously attached to a store');
};

export { preventDoubleInitialization as p };
