const currentPage = "Preferances";

const {
  MSSQLConnection,
  MSSQLRequest,
} = require("../../../Connections/MSSQL/Connection");

const express = require("express");
const router = express.Router();

let SRVRes = {
  WelcomeMessage: `Welcome in ${currentPage} page...`,
  Error: false,
};

router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      let sqlString = `SELECT * FROM [${currentPage}]`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            Connection: {
              Status: true,
              Message: "MSSQL is Connected...",
              Data: result.recordset,
            },
          };
          res.send(SRVRes);
        })
        .catch((err) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            Error: true,
            Connection: {
              Code: err.code,
              Name: err.name,
              Message: err.message
            },
          };
          res.send(SRVRes);
        });
    })
    .catch((err) => {
      MSSQLConnection.close();
      SRVRes = {
        ...SRVRes,
        Error: true,
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
