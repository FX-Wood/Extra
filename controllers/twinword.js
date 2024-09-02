const express = require("express");
const db = require("../db/models");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
const axios = require("axios");

router.use(isLoggedIn);

router.get("/:word", async (req, res) => {
  try {
    const response = await axios.get(
      `https://wordsapiv1.p.rapidapi.com/words/${req.params.word}/definitions`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
        },
      },
    );

    if (response.status === 200) {
      res.send(response.data);
    } else if (response.status === 404) {
      res.status(404).send("word not found");
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).send("word not found");
    } else {
      res.status(500).send("An error occurred");
    }
  }
});

module.exports = router;

