import ReactDOM from 'react-dom';

export function batchedUpdates(fn: () => void) {
  ReactDOM.unstable_batchedUpdates(fn);
}
