var config = {};

config.host = process.env.HOST || "https://example.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "asdfalkdsflaksdflkajsdlkfasldaiEWEASDFASDFWEWEWEWEWEWEWEWEWEWE==";
config.databaseId = "documentdb456";
config.collectionId = "tasks";


config.getOrCreateDatabase = function (client, databaseId, callback) {
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id= @id',
            parameters: [{
                name: '@id',
                value: databaseId
            }]
        };

        client.queryDatabases(querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                if (results.length === 0) {
                    var databaseSpec = {
                        id: databaseId
                    };

                    client.createDatabase(databaseSpec, function (err, created) {
                        callback(null, created);
                    });

                } else {
                    callback(null, results[0]);
                }
            }
        });
    }

config.getOrCreateCollection = function(dbClient, database, collectionId, callback){

		var querySpec = {
	            query: 'SELECT * FROM root r WHERE r.id=@id',
	            parameters: [{
	                name: '@id',
	                value: collectionId
	            }]
	        };             

		dbClient.queryCollections(database._self, querySpec).toArray(function (err, results) {
		    if (err) {
		        callback(err);

		    } else {
		    	if (results.length === 0) {
		            var collectionSpec = {
		                id: collectionId
		            };

		            dbClient.createCollection(database._self, collectionSpec, function (err, created) {
		                callback(null, created);
		            });

			    } else {        
			        callback(null, results[0]);
			    }
		    }
		});


	}









module.exports = config;