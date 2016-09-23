// State: A class that encapsulates functionality of holding and reporting state.
export class State {

  message: string;
  state: string;
  bootstrapContext: string;

  clear = () => {
    this.state = null;
    this.message = null;
  }

  setInfo = (message) => {
    this.state = 'info';
    this.bootstrapContext = 'info';
    this.message = message;
  }

  setError = (message) => {
    this.state = 'error';
    this.bootstrapContext = 'danger';
    this.message = message;
  }

  // Copy state from another state entity.
  copy = (that: State) => {
    this.state = that.state;
    this.bootstrapContext = that.bootstrapContext;
    this.message = that.message;
  }

}
