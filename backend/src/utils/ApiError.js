//apiEror class extends the features of Error class
class ApiError extends Error {
  //constructor helps to initialize the class when it run
  constructor(
    stausCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); //super can called the object from the constructor
    this.stausCode = stausCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      //This is a general way to captureStackTrace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
