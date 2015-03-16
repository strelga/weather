#What it is about
This is the service that retrieves weather data from different public APIs, caches it and returns to user as a JSON.

Currently can be used only for testing.

# Structure
## Stub services
Automatically creates stub API services on startup. Currently their API is the same, because trey are created at one place as instances of one express server. Their main settings are specified in `config/parameters.js`.

The stub server is described in `api_stub` folder.

## External API services
The interaction with external services (including stubs described above) is situated in `lib/apis` folder.

* In `adapters.js` file you can find objects containing functions, casting the external API fields to the internal ones.
* In `requests.js` file there are functions that are responsible for making requests to APIs.

If you want to add a new API, you must add it to `adapters.js`, `requests.js` and to `config/parameters.js`.

## Interaction with Redis
The folder `lib/redis` contains scripts of the data model layer of interaction with Redis. There are also lua scripts there.

## Buisnes logic
Sits in the root of `lib` folder.

# Algorithms and parallelism
See the [wiki article](https://github.com/strelga/weather/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D1%8B-%D0%BA%D0%B5%D1%88%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F) (In Russian)
