const currentPage = "Home";

const { MSSQLConnection } = require("../../../Connections/MSSQL/Connection");

const express = require("express");
const router = express.Router();

let SRVRes = {
  WelcomeMessage: `Welcome to ${currentPage} page...`,
};

router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      SRVRes = {
        ...SRVRes,
        Error: false,
        Connection: {
          Status: true,
          Message: "MSSQL is Connected...",
        },
      };
      MSSQLConnection.close();
      res.send(SRVRes);
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
});

module.exports = router;
