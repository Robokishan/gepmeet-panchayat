import debug from 'debug';
import getCallerFile from './get-caller-file';
import path from 'path';
const APP_NAME = 'gepmeet-tanduri';

class Logger {
  private _debug;
  private _info;
  private _warn;
  private _error;
  constructor() {
    const {
      DEBUG_FILENAME_PREFIX = 'app',
      DEBUG_FILENAME_START = '0',
      DEBUG_FILENAME_LENGTH = '100'
    } = process.env;
    const start = parseInt(DEBUG_FILENAME_START, 10);
    const length = parseInt(DEBUG_FILENAME_LENGTH, 10);
    const filename = getCallerFile();
    let pathNames = filename
      .replace(process.cwd() + path.sep, '')
      .split(path.sep);
    if (pathNames.length > start) {
      pathNames = pathNames.splice(
        start,
        Math.min(pathNames.length - start, length)
      );
    }
    pathNames.unshift(DEBUG_FILENAME_PREFIX);
    const namespace = pathNames.join(':');

    this._debug = debug(`${APP_NAME}:${namespace}`);
    this._info = debug(`${APP_NAME}:INFO:${namespace}`);
    this._warn = debug(`${APP_NAME}:WARN:${namespace}`);
    this._error = debug(`${APP_NAME}:ERROR:${namespace}`);

    /* eslint-disable no-console */
    this._debug.log = console.info.bind(console);
    this._info.log = console.info.bind(console);
    this._warn.log = console.warn.bind(console);
    this._error.log = console.error.bind(console);
    /* eslint-enable no-console */
  }

  get debug() {
    return this._debug;
  }

  get info() {
    return this._info;
  }

  get warn() {
    return this._warn;
  }

  get error() {
    return this._error;
  }
}

export default Logger;
