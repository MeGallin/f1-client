F1 API Endpoints Summary
The API service is built around the Ergast F1 API and provides the following endpoint groups:

Seasons
getAllSeasons() - Get all F1 seasons
getSeason(year) - Get information for a specific season
getCurrentSeason() - Get current season information
Races
getAllRaces(year) - Get all races for a specific season
getRace(year, round) - Get specific race by round number
getCurrentRace() - Get the most recent race
getNextRace() - Get information about the upcoming race
Drivers
getAllDrivers() - Get all drivers
getDriversByYear(year) - Get drivers for a specific season
getDriver(driverId) - Get specific driver information
getDriverByYear(year, driverId) - Get driver information for a specific season
Constructors
getAllConstructors() - Get all constructors
getConstructorsByYear(year) - Get constructors for a specific season
getConstructor(constructorId) - Get specific constructor information
getConstructorByYear(year, constructorId) - Get constructor information for a specific season
Results
getResultsBySeason(year) - Get race results for a specific season
getRaceResults(year, round) - Get race results for a specific race
getQualifyingResults(year, round) - Get qualifying results for a specific race
Standings
getDriverStandings(year) - Get driver standings for a specific season
getConstructorStandings(year) - Get constructor standings for a specific season
getCurrentDriverStandings() - Get current driver standings
getCurrentConstructorStandings() - Get current constructor standings
Circuits
getAllCircuits() - Get all circuits
getCircuitsByYear(year) - Get circuits for a specific season
getCircuit(circuitId) - Get specific circuit information
Lap Times
getLapTimes(year, round) - Get lap times for a specific race
getDriverLapTimes(year, round, driverId) - Get lap times for a specific driver in a race
getSpecificLap(year, round, lap) - Get specific lap time for a race
Pit Stops
getPitStops(year, round) - Get pit stops for a specific race
getDriverPitStops(year, round, driverId) - Get pit stops for a specific driver in a race
Status
getAllStatusCodes() - Get all status codes
Sprint
getSprintResults(year, round) - Get sprint results for a specific race
All these methods accept an optional useCache parameter (default: true) to control whether responses should be cached.
