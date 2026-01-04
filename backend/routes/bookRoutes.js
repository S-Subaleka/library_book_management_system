const express = require("express");
const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Book route working");
});

module.exports = router;

