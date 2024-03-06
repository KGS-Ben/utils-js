# utils-js

Common javascript utilities for KGS applications.

In order for npm to pull the latest version:

-   The package version must be updated with each new feature
-   A new tag on the repository must be created
-   The package must run `npm run build` with each change

# Installation

Use npm to install the package.

```bash
npm install @kgs-research/utils
```

# Usage

## axios-utils

### Create a custom axios instance

```js
const { AxiosDecorator } = require('@kgs-research/utils');
// Axios client with baseURL configured
const httpClient = new AxiosDecorator({ baseURL: 'http://sendText.com' })
    // Simplify the error logs
    .addErrorLogReducer()
    // Rate limit of 1000 requests per second
    .addRateLimiter({ maxRequests: 1000, perMilliseconds: 1000 })
    // Get the axios instance
    .getClient();
```

## passport

### Create a custom passport instance

```js
const { PassportDecorator } = require('@kgs-research/utils');
const passport = new PassportDecorator()
    .addSerializeUser()
    .addAccessTokenValidation(secret, getUser)
    .addUserLogin(authenticateUser, validateTwoFactor, sendTwoFactorEmail)
    .getPassport();
```

## express-middlewares

```js
const { expressMiddlewares } = require('@kgs-research/utils');
// POST /api/save
router.post(
    '/api/save',
    expressMiddlewares.validateBody(['keyToCheck1', 'keyToCheck2']),
    (req, res) => res.send('OK')
);

// GET /api/save?queryParam1=123&queryParam2=456
router.get(
    '/api/save',
    expressMiddlewares.validateQuery(['queryParam1', 'queryParam2']),
    (req, res) => res.send('OK')
);
```

## Generic functions

```js
// Sleeps process for N milliseconds
sleep(millis);

// Converts a time string like '17 min 30 sec' to seconds
convertTimeStringToSeconds(timeString);

// Gets a random value from an array
randomElement(array);

// Round to nearest decimal place, digits defaults to 2 if not specified.
roundToNearest(number, digits = 2);

// Delete all the provided files
deleteFiles(...filesToDelete);

// Decapitalize first character of a string
decapitalizeFirstLetter(str);

// Generates a random number [min, max]; (i.e min <= x <= max)
randomRange(min, max);
```

## Module exports

Functionality which can be accessed by modules importing this library is located in `index.ts`.
