const connectionSettings = {
  server: process.env.MSSQLDB_SRV,
  authentication: {
    type: process.env.MSSQLDB_TYP,
    options: {
      userName: process.env.MSSQLDB_USR,
      password: process.env.MSSQLDB_PWD,
    },
  },
  options: {
    database: process.env.MSSQLDB_NAM,
    validateBulkLoadParametes: false,
    encrypt: false,
  },
};

module.exports = connectionSettings;
