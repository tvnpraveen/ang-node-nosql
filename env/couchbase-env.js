var env =  {
  cluster: "couchbase://localhost", // Couchbase cluster host
  bucket: "default"     // The default bucket
}



module.exports = {
  connection: env       // Export the connection
}