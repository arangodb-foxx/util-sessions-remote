/*global exports */
'use strict';
class SessionNotFound extends Error {
  constructor(sid) {
    super();
    this.name = this.constructor.name;
    this.message = `Session with session id ${sid} not found.`;
    Error.captureStackTrace(this, this.constructor);
  }
}

exports.SessionNotFound = SessionNotFound;
