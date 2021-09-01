const sqlQueries = require("../Connections/MSSQL/SQLQueries");
const { MSSQLRequest } = require("../Connections/MSSQL/Connection");

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
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.COLUMNS} WHERE [object_id]= '${tableID}'`;
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

getTableName = (tableID) => {
  return new Promise((resolve, reject) => {
    let sqlString = `SELECT [name] FROM ${sqlQueries.TABLES} WHERE [object_id] = '${tableID}'`;
    MSSQLRequest.query(sqlString)
      .then((res) => {
        resolve(res.recordset[0].name);
      })
      .catch((err) => reject(err));
  });
};

getRelations = (databaseName, tableID) => {
  return new Promise((resolve, reject) => {
    let sqlString = `USE ${databaseName} SELECT * FROM ${sqlQueries.RELATIONS} WHERE [referenced_object_id] = '${tableID}'`;
    MSSQLRequest.query(sqlString)
      .then(async (res) => {
        let relations = await Promise.all(
          res.recordset.map(async (relation) => {
            return {
              childName: await getTableName(relation.parent_object_id),
              ID: relation.object_id,
              Name: relation.name,
              ParentID: relation.referenced_object_id,
              ChildID: relation.parent_object_id,
              ChildColumnID: relation.key_index_id,
              CreateDate: relation.create_date,
              ModifyDate: relation.modify_date,
              isDisabled: relation.is_disabled,
              origin: { ...relation },
            };
          })
        );
        relations = relations.reduce(
          (acc, { ["childName"]: x, ...rest }) => ((acc[x] = rest), acc),
          {}
        );
        resolve(relations);
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
              CreateDate: table.create_date,
              ModifyDate: table.modify_date,
              Columns: await getColumns(databaseName, tableID),
              Relations: await getRelations(databaseName, tableID),
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

exports.GET_DATABASES = () => {
  return new Promise((resolve, reject) => {
    let sqlString = `SELECT * FROM ${sqlQueries.DATABASES}`;
    MSSQLRequest.query(sqlString)
      .then(async (res) => {
        let databases = res.recordset;
        databases = await Promise.all(
          databases.map(async (database) => {
            return {
              databaseName: database.name,
              ID: database.database_id,
              Name: database.name,
              CreateDate: database.create_date,
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

exports.GET_DATABASE = async (databaseName) => {
  return {
    Tables: await getTables(databaseName),
  };
};
