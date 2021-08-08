const currentPage = "Home";

const sqlQueries = require("../../../Connections/MSSQL/SQLQueries");

const {
  MSSQLConnection,
  MSSQLRequest,
} = require("../../../Connections/MSSQL/Connection");

const express = require("express");
const router = express.Router();

let SRVRes = {
  WelcomeMessage: `Welcome to ${currentPage} page...`,
};

const getColumnInformation = (column) => {
  return new Promise((res, rej) => {
    let dataType = column.DATA_TYPE;
    let Config = { dataType: column.DATA_TYPE, isHTTPInput: true };
    let columnName = column.COLUMN_NAME;
    switch (dataType) {
      case "int":
        Config = { ...Config, inputType: "number", defaultValue: 0 };
        break;
      case "bit":
        Config = {
          ...Config,
          inputType: "checkbox",
          defaultValue: column.COLUMN_DEFAULT === "((1))" ? true : false,
        };
        break;
      case "nchar":
        Config = { ...Config, inputType: "text" };
        break;
      case "uniqueidentifier":
        Config = { ...Config, inputType: "hidden", isHTTPInput: false };
        break;
      case "image":
        Config = { ...Config, inputType: "text" };
        break;
      default:
        break;
    }
    if (columnName.includes("_ID")) {
      Config = {
        ...Config,
        related: true,
        inputType: "hidden",
        isHTTPInput: false,
      };
    } else if (columnName.includes("ID")) {
      Config = { ...Config, ID: true, isDisabled: true, isHTTPInput: false };
    } else if (columnName === "Password") {
      Config = { ...Config, inputType: "password" };
    }
    let columnInformation = {
      columnName: columnName,
      Name: columnName,
      Sort: column.ORDINAL_POSITION,
      Config: Config,
      Validation: {
        isRequired: column.IS_NULLABLE === "NO" ? true : false,
        maxLength: column.CHARACTER_MAXIMUM_LENGTH,
      },
    };
    res(columnInformation);
  });
};

const getTableColumns = (table) => {
  return new Promise((res, rej) => {
    let tableName = table.TABLE_NAME;
    let sqlString = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`;
    MSSQLRequest.query(sqlString)
      .then(async (result) => {
        let columnsInformations = await Promise.all(
          result.recordset.map(async (column) => {
            return await getColumnInformation(column);
          })
        );
        res(columnsInformations);
      })
      .catch((err) => rej(err));
  });
};

const getTablesInformations = () => {
  return new Promise((res, rej) => {
    let sqlString = `USE SOKllc SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'`;
    MSSQLRequest.query(sqlString)
      .then(async (result) => {
        let tablesInformations = await Promise.all(
          result.recordset.map(async (table) => {
            return {
              tableName: table.TABLE_NAME,
              columns: await getTableColumns(table),
            };
          })
        );
        tablesInformations = tablesInformations.reduce(
          (acc, { ["tableName"]: x, ...rest }) => ((acc[x] = rest), acc),
          {}
        );
        res(tablesInformations);
      })
      .catch((err) => rej(err));
  });
};

getInputType = (dataType) => {
  let inputType = "";
  switch (dataType) {
    case "int":
      return (inputType = "number");
    case "bit":
      return (inputType = "checkbox");
    case "nchar":
      return (inputType = "text");
    case "uniqueidentifier":
      return (inputType = "hidden");
    case "image":
      return (inputType = "text");
    default:
      return inputType;
  }
};

getColumns = (databaseName, tableID) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.COLUMNS} WHERE object_id = '${tableID}'`;
    MSSQLRequest.query(sqlString)
      .then(async (res) => {
        let types = await getTypes(databaseName);
        let defaultValues = await getDefaultValues(databaseName);
        let columns = await Promise.all(
          res.recordset.map(async (column, index) => {
            let columnID = column.column_id;
            let columnName = column.name;
            let columnDataTypeID = column.system_type_id;
            let columnDataType = types[columnDataTypeID].Name;
            let columnDefaultValueID = column.default_object_id;
            return {
              ID: columnID,
              Name: columnName,
              Sort: index + 1,
              Config: {
                dataTypeID: columnDataTypeID,
                dataType: columnDataType,
                inputType: getInputType(columnDataType),
                defaultValue:
                  defaultValues[columnDefaultValueID] === undefined
                    ? ""
                    : defaultValues[columnDefaultValueID].Value.replace(
                        /[()]/g,
                        ""
                      ),
                isID: column.is_identity,
                isRowGuidCol: column.is_rowguidcol,
                isPassword: columnName.includes("Password"),
                isDisabled:
                  column.is_identity ||
                  column.is_rowguidcol ||
                  columnName.includes("_ID")
                    ? true
                    : false,
                isHTTPInput:
                  column.is_identity ||
                  column.is_rowguidcol ||
                  columnName.includes("_ID")
                    ? false
                    : true,
                isSelect: columnName.includes("_ID"),
              },
              Validation: {
                isRequired: !column.is_nullable,
                maxLength: columnDataTypeID === 239 ? column.max_length : "",
              },
              origin: { ...column },
            };
          })
        );
        resolve(columns);
      })
      .catch((err) => reject(err));
  });
};

getTables = (databaseName) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.TABLES}`;
    MSSQLRequest.query(sqlString)
      .then(async (res) => {
        let tables = await Promise.all(
          res.recordset.map(async (table) => {
            let tableID = table.object_id;
            let tableName = table.name;
            return {
              tableName: tableName,
              ID: tableID,
              Name: tableName,
              createDate: table.create_date,
              modifyDate: table.modify_date,
              Columns: await getColumns(databaseName, tableID),
              origin: { ...table },
            };
          })
        );
        tables = tables.reduce(
          (acc, { ["tableName"]: x, ...rest }) => ((acc[x] = rest), acc),
          {}
        );
        resolve(tables);
      })
      .catch((err) => reject(err));
  });
};

getTypes = (databaseName) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.TYPES}`;
    MSSQLRequest.query(sqlString)
      .then((res) => {
        let types = res.recordset
          .map((type) => {
            return {
              typeID: type.user_type_id,
              ID: type.user_type_id,
              Name: type.name,
              origin: { ...type },
            };
          })
          .reduce(
            (acc, { ["typeID"]: x, ...rest }) => ((acc[x] = rest), acc),
            {}
          );
        resolve(types);
      })
      .catch((err) => reject(err));
  });
};

getDefaultValues = (databaseName) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.DEFAULTVALUE}`;
    MSSQLRequest.query(sqlString)
      .then((res) => {
        let defaltValues = res.recordset
          .map((defaultValue) => {
            return {
              defaultValueID: defaultValue.object_id,
              ID: defaultValue.object_id,
              Value: defaultValue.definition,
              origin: { ...defaultValue },
            };
          })
          .reduce(
            (acc, { ["defaultValueID"]: x, ...rest }) => ((acc[x] = rest), acc),
            {}
          );
        resolve(defaltValues);
      })
      .catch((err) => reject(err));
  });
};

getRelations = (databaseName) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.RELATIONS}`;
    MSSQLRequest.query(sqlString)
      .then((res) => {
        let relations = res.recordset
          .map((relation) => {
            return {
              relationID: relation.object_id,
              ID: relation.object_id,
              Name: relation.name,
              ParentID: relation.referenced_object_id,
              ChildID: relation.parent_object_id,
              childColumnID: relation.key_index_id,
              createDate: relation.create_date,
              modifyDate: relation.modify_date,
              isDisabled: relation.is_disabled,
              origin: { ...relation },
            };
          })
          .reduce(
            (acc, { ["relationID"]: x, ...rest }) => ((acc[x] = rest), acc),
            {}
          );
        resolve(relations);
      })
      .catch((err) => reject(err));
  });
};

getDatabases = () => {
  return new Promise((resolve, reject) => {
    let sqlString = `SELECT * FROM ${sqlQueries.DATABASES}`;
    MSSQLRequest.query(sqlString)
      .then(async (res) => {
        let data = res.recordset;
        let databases = await Promise.all(
          data.map(async (database) => {
            let databaseID = database.database_id;
            let databaseName = database.name;
            return {
              databaseName: databaseName,
              ID: databaseID,
              Name: databaseName,
              createDate: database.create_date,
              Tables:
                process.env.MSSQLDB_NAM === databaseName
                  ? await getTables(databaseName)
                  : {},
              Relations: await getRelations(databaseName),
              types: await getTypes(databaseName),
              defaultValues: await getDefaultValues(databaseName),
              origin: { ...database },
            };
          })
        );
        databases = databases.reduce(
          (acc, { ["databaseName"]: x, ...rest }) => ((acc[x] = rest), acc),
          {}
        );
        resolve(databases);
      })
      .catch((err) => reject(err));
  });
};

router.get("/", (req, res, next) => {
  MSSQLConnection.connect()
    .then(async () => {
      let databases = await getDatabases();
      SRVRes = {
        ...SRVRes,
        Error: false,
        Connection: {
          Status: true,
          Message: "MSSQL is Connected...",
          Data: databases[process.env.MSSQLDB_NAM],
        },
        databases: await getDatabases(),
      };
      res.send(SRVRes);
    })
    .catch((err) => {
      MSSQLConnection.close();
      SRVRes = {
        ...SRVRes,
        Error: true,
        Connection: { Code: err.code, Name: err.name, Message: err.message },
      };
      res.send(SRVRes);
    });
});

module.exports = router;
