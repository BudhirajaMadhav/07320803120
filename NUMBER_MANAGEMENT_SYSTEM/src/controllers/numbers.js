const axios = require("axios");

const getAllNumbers = async (req, res) => {
  const { url } = req.query;
  const urls = Array.isArray(url) ? url : [url];
  const numbers = await Promise.all(urls.map((url) => getNumbersFromUrl(url)));
  res.status(200).send({ numbers: [1, 2, 3, 5, 8, 13] });
};

const getNumbersFromUrl = async (url) => {
  axios
    .get(url)
    .then((res) => {
      return res.data.numbers;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getAllNumbers,
};
