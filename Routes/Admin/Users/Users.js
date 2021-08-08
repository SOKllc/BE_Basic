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
            Error: false,
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
        Connection: {
          Code: err.code,
          Name: err.name,
          Message: err.message,
        },
      };
      res.send(SRVRes);
    });
});

router.get("/:ID", (req, res, next) => {
  MSSQLConnection.connect()
    .then(() => {
      sqlString = `SELECT * FROM [${currentPage}] WHERE [${currentPage}].ID = ${req.params.ID}`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            Error: false,
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
        Connection: {
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
      let filedsNames = [];
      let fieldsValues = [];
      fields.map((field) => {
        filedsNames.push("[" + field + "]");
        fieldsValues.push("'" + recordset[field] + "'");
      });
      filedsNames = filedsNames.join(", ");
      fieldsValues = fieldsValues.join(", ");
      let sqlString = `INSERT INTO [${currentPage}] (${filedsNames}) VALUES (${fieldsValues})`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            Error: false,
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
        Connection: {
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
      let reqID = req.params.ID;
      let recordset = req.body;
      let fields = Object.keys(recordset);
      let fieldsEditString = [];
      fields.map((field) => {
        fieldsEditString.push(`[${field}] = '${recordset[field]}'`);
      });
      fieldsEditString = fieldsEditString.join(", ");
      let conditionString = `[${currentPage}].ID = ${reqID}`;
      let sqlString = `UPDATE [${currentPage}] SET ${fieldsEditString} WHERE ${conditionString}`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            Error: false,
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
        Connection: {
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
      MSSQLRequest.query(sqlString)
        .then((result) => {
          MSSQLConnection.close();
          SRVRes = {
            ...SRVRes,
            Error: false,
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
        Connection: {
          Code: err.code,
          Name: err.name,
          Message: err.message,
        },
      };
      res.send(SRVRes);
    });
});

module.exports = router;
