# The Remote Sessions Storage

The sessions app provides a remote REST-based session storage JavaScript API that can be used in other Foxx apps.

[![Build status](https://img.shields.io/travis/arangodb/foxx-sessions-remote.svg)](https://travis-ci.org/arangodb/foxx-sessions-remote)

## Configuration

This app has the following configuration options:

* **sessionsRoot**: *string* (Default: `"/sessions"`)

  The base URL of the remote REST API that stores the sessions.


## JavaScript API: sessionStorage

This app exposes a session storage via a JavaScript API named *sessionStorage*.

**Examples**

First add this app to your dependencies:

```js
{
  ...
  "dependencies": {
    "sessions": "sessions-remote:^1.0.0"
  }
  ...
}
```

Once you've configured both apps correctly, you can use it like this:

```js
var Foxx = require('org/arangodb/foxx');
var controller = new Foxx.Controller(applicationContext);
var sessionStorage = applicationContext.dependencies.sessions.sessionStorage;

controller.activateSessions({
  sessionStorage: sessionStorage,
  cookie: true
});
```

### Exceptions

#### Session Not Found

Indicates a session could not be found by the remote REST-API.

`new sessionStorage.errors.SessionNotFound(sessionId)`

Thrown by the session storage's *delete* and *get* methods if passed a session ID that does not exist in the remote REST-API.

**Examples**

```js
try {
    sessionStorage.get(invalidSessionId);
} catch(err) {
    assertTrue(err instanceof sessionStorage.errors.SessionNotFound);
}
```

### The session object

Session objects are instances of a Foxx model with the following attributes:

* *sessionData*: volatile session data. This can be an arbitrary object that will be stored with the session in the remote REST-API. If you want to store session-specific (rather than user-specific) data in the remote REST-API, this is the right place for that
* *uid*: the sessions active user's ID or `undefined` (no active user)
* *userData*: the session's active user's *userData* attribute or an empty object
* *created*: timestamp the session was created at
* *lastAccess*: timestamp of the last time the session was fetched from the remote REST-API
* *lastUpdate*: timestamp of the last time the session was written to the remote REST-API

### Create a session

Creates and saves a new instance of the session model.

`sessionStorage.create(sessionData)`

**Parameter**

* *sessionData* (optional): an arbitrary object that will be stored as the sessions *sessionData* attribute when the model is saved to the remote REST-API.

**Examples**

```js
var session = sessionStorage.create(sessionData);
```

### Fetch an existing session

Fetch a session from the remote REST-API for a given ID.

`sessionStorage.get(sessionId)`

Attempts to load the session with the given session ID from the remote REST-API. If the session does not exist or has expired, a *SessionNotFound* exception will be thrown.

**Parameter**

* *sessionId*: a session ID.

**Examples**

```js
var session = sessionStorage.get(sessionId);
```

### Delete a session

There are two ways to delete a session from the remote REST-API:

* calling the session storage's *delete* method with a session ID directly
* telling a session to delete itself

#### Delete a session by its ID

Delete a session with a given ID.

`sessionStorage.delete(sessionId)`

Attempts to delete the session with the given session ID from the remote REST-API.

The method always returns `null`.

**Parameter**

* *sessionId*: a session ID.

**Examples**

```js
sessionStorage.delete(sessionId);
```

#### Tell a session to delete itself

Delete a session from the remote REST-API.

`session.delete()`

Attempts to delete the session from the remote REST-API.

The method always returns `true`.

**Examples**

```js
session.delete();
```

### Save a session

Save a session to the remote REST-API.

`session.save()`

If you made any changes to the session and are not using the sessions app via Foxx Sessions, you must call this method to commit the changes to the remote REST-API.

**Examples**

```js
session.set('sessionData', {});
session.save();
```

### Retrieve a session's ID

Get the session ID of a session.

`session.forClient()`

Returns the session's session ID that is accepted by `sessions.get`.

## License

This code is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0) by ArangoDB GmbH.
