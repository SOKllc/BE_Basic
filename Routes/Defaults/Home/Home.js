const currentPage = "Home";

const { MSSQLConnection } = require("../../../Connections/MSSQL/Connection");

const express = require("express");
const router = express.Router();

let SRVRes = { WelcomeMessage: `Welcome to ${currentPage}...` };

router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      MSSQLConnection.close();
      SRVRes = {
        ...SRVRes,
        ConnectionStatus: true,
        ConnectionMessage: "MSSQL is Connected...",
      };
      res.send(SRVRes);
    })
    .catch((err) => {
      MSSQLConnection.close();
      SRVRes = {
        ...SRVRes,
        ConnectionStatus: false,
        ConnectionMessage: "MSSQL is not Connected...",
        ConnectionData: {
          Code: err.code,
          Name: err.name,
          Message: err.message,
        },
      };
      res.send(SRVRes);
    });
});

module.exports = router;
