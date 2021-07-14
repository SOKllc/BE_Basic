const currentPage = "Users";

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

// Get => get
router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      sqlString = `SELECT * FROM [${currentPage}]`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            ConnectionStatus: true,
            ConnectionMessage: "MSSQL is Connected...",
            ConnectionData: result,
          };
          res.send(SRVRes);
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

// Add => post
router.post("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      let recordset = req.body;
      let fields = Object.keys(recordset);
      let fieldsValues = fields.map((field) => {
        return recordset[field];
      });
      let sqlString = `INSERT INTO [${currentPage}] ([Name], [isAdmin]) VALUES ('${
        recordset.Name
      }', ${recordset.isAdmin ? 1 : 0})`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            ConnectionStatus: true,
            ConnectionMessage: "MSSQL is Connected...",
            ConnectionData: result,
          };
          res.send(SRVRes);
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

// Edit => put
router.put("/:ID", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      let recordset = req.body;
      let fields = Object.keys(recordset);
      let fieldsValues = fields.map((field) => {
        return recordset[field];
      });
      let reqID = recordset.ID;
      let sqlString = `UPDATE [${currentPage}] SET [Name] = '${
        recordset.Name
      }' , [Password] = '${recordset.Password}' , [Active] = ${
        recordset.Active ? 1 : 0
      } , [isAdmin] = ${
        recordset.isAdmin ? 1 : 0
      } WHERE [${currentPage}].ID = ${reqID}`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            ConnectionStatus: true,
            ConnectionMessage: "MSSQL is Connected...",
            ConnectionData: result,
          };
          res.send(SRVRes);
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

// Delete => delete
router.delete("/:ID", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      let reqID = req.params.ID;
      let sqlString = `DELETE FROM [${currentPage}] WHERE [${currentPage}].ID = ${reqID}`;
      console.log(sqlString);
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            ConnectionStatus: true,
            ConnectionMessage: "MSSQL is Connected...",
            ConnectionData: result,
          };
          res.send(SRVRes);
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
