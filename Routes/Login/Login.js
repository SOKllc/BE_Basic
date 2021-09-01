const currentPage = "Login";

const {
  MSSQLConnection,
  MSSQLRequest,
} = require("../../Connections/MSSQL/Connection");

const { GET_DATABASES, GET_DATABASE } = require("../../Controllers/Databases");
const {
  GET_USER_PREFERANCES,
} = require("../../Controllers/Users/Related/Preferances");
const {
  GET_USER_PRIVILIGES,
} = require("../../Controllers/Users/Related/Priviliges");

const express = require("express");
const router = express.Router();

let SRVRes = { WelcomeMessage: `Welcome to ${currentPage} page...` };

router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(async () => {
      SRVRes = {
        ...SRVRes,
        Error: false,
        Connection: {
          Status: true,
          Message: "MSSQL is Connected...",
          MainData: await GET_DATABASES(),
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

router.post("/", (req, res, next) => {
  let userName = req.body.Name;
  let userPassword = req.body.Password;
  let databaseName = req.body.DatabaseName;
  MSSQLConnection.connect()
    .then(() => {
      let sqlString = `USE ${databaseName} SELECT * FROM Users_View`;
      MSSQLRequest.query(sqlString)
        .then(async (result) => {
          let dataUsers = result.recordset;
          let checkUserName = dataUsers
            .map((user) => {
              return user.Name.trim();
            })
            .includes(userName);
          if (checkUserName) {
            let user = dataUsers.filter((user) => {
              return user.Name.trim() === userName;
            });
            user = user[0];
            if (user.Password.trim() === userPassword) {
              SRVRes = {
                ...SRVRes,
                Error: false,
                Connection: {
                  Status: true,
                  Message: "Success",
                  MainData: {
                    User: {
                      ID: user.ID,
                      Name: user.Name,
                      Guid: user.Guid,
                      Priviliges: await GET_USER_PRIVILIGES(
                        databaseName,
                        user.ID
                      ),
                      Preferances: await GET_USER_PREFERANCES(
                        databaseName,
                        user.ID
                      ),
                    },
                    Database: await GET_DATABASE(databaseName),
                  },
                },
              };
              res.send(SRVRes);
            } else {
              SRVRes = {
                ...SRVRes,
                Error: true,
                Connection: {
                  Status: true,
                  Message: "Invalid User Password",
                },
              };
              res.send(SRVRes);
            }
          } else {
            SRVRes = {
              ...SRVRes,
              Error: true,
              Connection: {
                Status: true,
                Message: "Invalid User Name",
              },
            };
            res.send(SRVRes);
          }
          MSSQLConnection.close();
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      MSSQLConnection.close();
      next(err);
    });
});

module.exports = router;
