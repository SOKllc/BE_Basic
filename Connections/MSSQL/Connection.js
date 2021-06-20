const MSSQL = require("mssql");
const ConnectionSettings = require("./Settings");

const MSSQLConnection = new MSSQL.ConnectionPool(ConnectionSettings);
const MSSQLRequest = new MSSQL.Request(MSSQLConnection);

module.exports = { MSSQLConnection, MSSQLRequest };
