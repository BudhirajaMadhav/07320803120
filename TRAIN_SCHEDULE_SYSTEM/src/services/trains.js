/*
  // get next 12 hour trains by calling the api, http://20.244.56.144/train/trains
  it's result is:

  "trainName": "Chennai Exp" ,
"trainNumber
"2344" ,
"departureTime" :
"Hours " :
21,
"Minutes" :
"Seconds" :
" seatsAvai1ab1e" :
"sleeper" :
"AC": 1
price" •
"sleeper" •
"AC" :
5
35,
0
3,
2,
"delayedBy": 15
"trainName'
: "Hyderabad Exp" ,
"trainNumber
": "2341" ,
"departure Time" :
"Hours " :
23,
"Minutes " :
"Seconds " :
" seatsAvai1ab1e" :
" sleeper" :
"AC": 7
price"
" sleeper" :
"AC" :
1854
"delayedBy": 5
55,
6,
554 ,

it should have auth token in header, if token is expired, then refresh


 */

const axios = require('axios');
const dotenv = require('dotenv');

const getAllTrains = async () => {
    try {
        const response = await axios.get(dotenv.config().parsed.TRAIN_API_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const sortTrains = trains => {
    /*
    
    Trains departing in the next 30 minutes should be ignored.
    Trains should be displayed in the ascending order of price, descending order of tickets and descending order of departure time(after considering delays in minutes)
    Trains that fulfil the allowed time window after delays should also be included in the API response
    
    */

    const now = new Date();
    const nowInMinutes = now.getHours() * 60 + now.getMinutes();
    const nowInMilliseconds = nowInMinutes * 60 * 1000;

    const allowedTimeWindowInMilliseconds = 12 * 60 * 60 * 1000;

    const trainsAfter30Minutes = trains.filter(train => {
        const departureTime = new Date(train.departureTime);
        const departureTimeInMinutes = departureTime.getHours() * 60 + departureTime.getMinutes() + train.delayedBy;
        const departureTimeInMilliseconds = departureTimeInMinutes * 60 * 1000;
        return departureTimeInMilliseconds - nowInMilliseconds > 30 * 60 * 1000;
    });

    const trainsAfterAllowedTimeWindow = trainsAfter30Minutes.filter(train => {
        const departureTime = new Date(train.departureTime);
        const departureTimeInMinutes = departureTime.getHours() * 60 + departureTime.getMinutes() + train.delayedBy;
        const departureTimeInMilliseconds = departureTimeInMinutes * 60 * 1000;
        return departureTimeInMilliseconds - nowInMilliseconds < allowedTimeWindowInMilliseconds;
    });

    const trainsSorted = trainsAfterAllowedTimeWindow.sort((a, b) => {
        if (a.price !== b.price) {
            return a.price - b.price;
        } 
        if (a.seatsAvailable.sleeper + a.seatsAvailable.AC !== b.seatsAvailable.sleeper + b.seatsAvailable.AC) {
            return b.seatsAvailable.sleeper + b.seatsAvailable.AC - a.seatsAvailable.sleeper + a.seatsAvailable.AC;
        }
        const aDepartureTime = new Date(a.departureTime);
        const bDepartureTime = new Date(b.departureTime);
        const aDepartureTimeInMinutes = aDepartureTime.getHours() * 60 + aDepartureTime.getMinutes() + a.delayedBy;
        const bDepartureTimeInMinutes = bDepartureTime.getHours() * 60 + bDepartureTime.getMinutes() + b.delayedBy;
        return aDepartureTimeInMinutes - bDepartureTimeInMinutes;
    });

    return trainsSorted;

}

const getNext12HourTrains = async (req, res) => {
    try {
        const trains = await getAllTrains();
        res.status(200).send(trains);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}