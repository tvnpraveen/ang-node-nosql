var env =  {
  database: "Documents", // Each connection can specify its own database
  host: "localhost",     // The host against which queries will be run
  port: 8000,            // By default port 8000 accepts Client API requests
  user: "admin",        // Our newly-created user with at least the rest-writer role
  password: "admin",  // writer's password
  authType: "DIGEST"     // The default auth
}



module.exports = {
  connection: env       // Export the development connection
}