const currentPage = "Users";

const {
  MSSQLConnection,
  MSSQLRequest,
} = require("../../Connections/MSSQL/Connection");

let SRVRes = {
  WelcomeMessage: `Welcome in ${currentPage} page...`,
};

const priviligesController = require("./Related/Priviliges");
const preferancesController = require("./Related/Preferances");

exports.PARAM = (req, res, next, ID) => {
  let databaseName = req.headers.databasename;
  MSSQLConnection.connect()
    .then(() => {
      let sqlString = `USE [${databaseName}] SELECT * FROM [${currentPage}] WHERE [ID] = ${ID}`;
      MSSQLRequest.query(sqlString)
        .then(async (result) => {
          req.ID = ID;
          SRVRes = {
            ...SRVRes,
            Error: false,
            Connection: {
              status: true,
              Message: "MSSQL is Connected...",
              MainData: result.recordset,
              RelatedData: {
                Priviliges: await priviligesController.GET_USER_PRIVILIGES(
                  databaseName,
                  ID
                ),
                Preferances: await preferancesController.GET_USER_PREFERANCES(
                  databaseName,
                  ID
                ),
              },
            },
          };
          MSSQLConnection.close();
          next();
        })
        .catch((err) => {
          MSSQLConnection.close();
          next(err);
        });
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};

exports.GET_ALL = (req, res, next) => {
  // let databaseName = req.headers.databasename;
  let databaseName = "SOKllc";
  MSSQLConnection.connect()
    .then(() => {
      let sqlString = `USE [${databaseName}] SELECT * FROM [${currentPage}]`;
      MSSQLRequest.query(sqlString)
        .then(async (result) => {
          SRVRes = {
            ...SRVRes,
            Error: false,
            Connection: {
              Status: true,
              Message: "MSSQL is Connected...",
              MainData: result.recordset,
              RelatedData: {
                Priviliges: await priviligesController.GET_ALL_PRIVILIGES(
                  databaseName
                ),
                Preferances: await preferancesController.GET_ALL_PREFERANCES(
                  databaseName
                ),
              },
            },
          };
          MSSQLConnection.close();
          res.send(SRVRes);
        })
        .catch((err) => {
          MSSQLConnection.close();
          next(err);
        });
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};

exports.GET_BYID = (req, res, next) => {
  res.send(SRVRes);
};

exports.POST = (req, res, next) => {
  let databaseName = req.headers.databasename;
  MSSQLConnection.connect()
    .then(() => {
      let recordset = req.body;
      let fields = Object.keys(recordset);
      let fieldsName = [];
      let fieldsValues = [];
      fields.map((field) => {
        fieldsName.push("[" + field + "]");
        fieldsValues.push("'" + recordset[field] + "'");
      });
      fieldsName = fieldsName.join(", ");
      fieldsValues = fieldsValues.join(", ");
      let sqlString = `USE [${databaseName}] INSERT INTO [${currentPage}] (${fieldsName}) VALUES (${fieldsValues})`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          SRVRes = {
            ...SRVRes,
            Error: false,
            Connection: {
              Status: true,
              Message: "MSSQL is Connected...",
              MainData: result.recordset,
              RelatedData: {},
            },
          };
          MSSQLConnection.close();
          res.send(SRVRes);
        })
        .catch((err) => {
          MSSQLConnection.close;
          next(err);
        });
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};

exports.PUT = (req, res, next) => {
  let databaseName = req.headers.databasename;
  MSSQLConnection.connect()
    .then(() => {
      let reqID = req.ID;
      let recordset = req.body;
      let fields = Object.keys(recordset);
      let fieldsEditString = [];
      fields.map((field) => {
        fieldsEditString.push(`[${field}] = '${recordset[field]}'`);
      });
      fieldsEditString = fieldsEditString.join(", ");
      let conditionString = `[${currentPage}].ID = ${reqID}`;
      let sqlString = `USE [${databaseName}] UPDATE [${currentPage}] SET ${fieldsEditString} WHERE ${conditionString}`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          SRVRes = {
            ...SRVRes,
            Error: false,
            Connection: {
              Status: true,
              Message: "MSSQL is Connected...",
              MainData: result.recordset,
              RelatedData: {},
            },
          };
          MSSQLConnection.close();
          res.send(SRVRes);
        })
        .catch((err) => {
          MSSQLConnection.close();
          next(err);
        });
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};

exports.DELETE = (req, res, next) => {
  let databaseName = req.headers.databasename;
  MSSQLConnection.connect()
    .then(() => {
      let sqlString = `USE [${databaseName}] DELETE FROM [${currentPage}] WHERE [${currentPage}].ID = ${reqID}`;
      MSSQLRequest.query(sqlString)
        .then((result) => {
          SRVRes = {
            ...SRVRes,
            Error: false,
            Connection: {
              Status: true,
              Message: "MSSQL is Connected...",
              MainData: result.recordset,
              RelatedData: {},
            },
          };
          MSSQLConnection.close();
          res.send(SRVRes);
        })
        .catch((err) => {
          MSSQLConnection.close();
          next(err);
        });
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};
