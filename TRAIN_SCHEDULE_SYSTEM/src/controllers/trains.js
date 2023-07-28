const getNext12HourTrains = async (req, res) => {
    try {
        const trains = await trainService.getNext12HourTrains();
        res.status(200).send(trains);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = {
    getNext12HourTrains,
}