const currentPage = "Home";

const {
  MSSQLConnection,
  MSSQLRequest,
} = require("../../../Connections/MSSQL/Connection");

const express = require("express");
const router = express.Router();

let SRVRes = {
  WelcomeMessage: `Welcome to ${currentPage} page...`,
  Error: false,
};

const getColumnInformation = (column) => {
  return {
    name: column.COLUMN_NAME,
    other: "blabla",
  };
};

const getTableColumns = (table) => {
  return new Promise((res, rej) => {
    let tableName = table.TABLE_NAME;
    let sqlString = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`;
    MSSQLRequest.query(sqlString)
      .then(async (result) => {
        let columnsInformations = await Promise.all(
          result.recordset.map(async (column) => {
            return {
              [column.COLUMN_NAME]: await getColumnInformation(column),
            };
          })
        );
        res(columnsInformations);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

const getTablesInformations = () => {
  return new Promise((res, rej) => {
    let sqlString = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'`;
    MSSQLRequest.query(sqlString)
      .then(async (result) => {
        let tablesInformations = await Promise.all(
          result.recordset.map(async (table) => {
            return {
              [table.TABLE_NAME]: await getTableColumns(table),
            };
          })
        );
        res(tablesInformations);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(async () => {
      SRVRes = {
        ...SRVRes,
        ConnectionStatus: true,
        ConnectionMessage: "MSSQL is Connected...",
        ConnectionData: await getTablesInformations(),
      };
      console.log(SRVRes);
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
});

module.exports = router;
