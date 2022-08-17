module.exports = {
    user : 'sa',
    password : 'qwertyQ1234',
    server : '192.168.1.39',
    database : 'auth_with_profile',
    port : 1433,
    pool : {
        max : 10,
        min : 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,  
        trustServerCertificate: true
  }
}