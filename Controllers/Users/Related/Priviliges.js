const currentPage = "Priviliges";

const {
  MSSQLConnection,
  MSSQLRequest,
} = require("../../../Connections/MSSQL/Connection");

let SRVRes = {
  WelcomeMessage: `Welcome in ${currentPage} page...`,
};

exports.GET_USER_PRIVILIGES = (databaseName, userID) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM [${currentPage}] WHERE [User_ID] = ${userID}`;
    MSSQLRequest.query(sqlString)
      .then((res) => resolve(res.recordset[0]))
      .catch((err) => reject(err));
  });
};

exports.GET_ALL_PRIVILIGES = (databaseName) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${currentPage}`;
    MSSQLRequest.query(sqlString)
      .then((res) => resolve(res.recordset))
      .catch((err) => reject(err));
  });
};

exports.PARAM = (req, res, next, ID) => {
  let databaseName = req.headers.databasename;
  MSSQLConnection.connect()
    .then(async () => {
      SRVRes = {
        ...SRVRes,
        Error: false,
        Connection: {
          Status: true,
          Message: "MSSQL is Connected...",
          MainData: await this.GET_USER_PRIVILIGES(databaseName, ID),
        },
      };
      MSSQLConnection.close();
      next();
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};

exports.GET_ALL = (req, res, next) => {
  let databaseName = req.headers.databasename;
  MSSQLConnection.connect()
    .then(async () => {
      SRVRes = {
        ...SRVRes,
        Error: false,
        Connection: {
          Status: true,
          Message: "MSSQL is Connected...",
          MainData: await this.GET_ALL_PRIVILIGES(databaseName),
        },
      };
      MSSQLConnection.close();
      res.send(SRVRes);
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
};

exports.GET_BYID = (req, res, next) => {
  res.send(SRVRes);
};
