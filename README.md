
This project is a three tier application having presentation, business logic and data layers. We used AngularJS for user interface and Node.js for business logic (accessing data) and multiple NoSQL databases for data storage. Our goal is to have a common user interface and an interoperable middle layer to access various NoSQL databases for performing simple CRUD operation. In the process, we were able to learn multiple NoSQL databases. We believe this work will be useful to others who are in need to explore NoSQL databases in a short period of time and hence we share our work here.



The following NoSQL databases are supported currently.

### Local
- MarkLogic 8
- Couchbase 4.5
- Redis 3.2.8
- MongoDB 3.4.1

### Cloud
- Microsoft Azure DocumentDB

## Setup

Install the NoSQL Database from the above supported databases

##### MarkLogic - [https://docs.marklogic.com/guide/installation](https://docs.marklogic.com/guide/installation)

##### Couchbase - [https://developer.couchbase.com/documentation/server/current/getting-started/installing.html](https://developer.couchbase.com/documentation/server/current/getting-started/installing.html)

##### DocumentDB - Register at [https://portal.azure.com/#](https://portal.azure.com/#)

##### Redis - [https://redis.io/download](https://redis.io/download) - Install and Start the Server

##### MongoDB - [https://www.mongodb.com/download-center#community](https://www.mongodb.com/download-center#community) 



## Database Configuration

##### MarkLogic
Requires configuration if there is a need for custom rest server and custom database.

##### Couchbase  
- Create a Primary Index to use N1QL.
- Navigate to [http://127.0.0.1:8091/ui/index.html#/query/workbench](http://127.0.0.1:8091/ui/index.html#/query/workbench) and execute the query on default bucket
 CREATE PRIMARY INDEX ON \`default\` USING GSI;

##### DocumentDB
- After logging into the portal
- Click on NoSQL Database on the left menu
- Create account following this url - https://docs.microsoft.com/en-us/azure/documentdb/documentdb-create-account
- Enter ID(unique account string), Select DocumentDB, Free Trial, Create new for resource group(enter a name), and location as desired.
- Click on Create

##### Redis
No custom configuration is required

##### MongoDB
No custom configuration is required

## Application Configuration

##### MarkLogic
_env/marklogic-env.js_ has the following details. Update if different configuration is required

	database: "Documents",
	host: "localhost",
	port: 8000,
	user: "admin",
	password: "admin",
	authType: "DIGEST"

##### Couchbase
_env/couchbase-env.js_ has the following details. Change the hostname or bucket name as required

	cluster: "couchbase://localhost",
	bucket: "default"

##### DocumentDB 
Update _env/documentdb-env.js_ with the details configured on Azure. Details of the URI and Primary key can be found from keys page.

	_config.host_ = process.env.HOST || "<URI>";
	_config.authKey_ = process.env.AUTH_KEY || "<PRIMARY KEY>";

 ![Alt text](https://github.com/anodenosql/ang-node-nosql/blob/master/readme/keys.png?raw=true "Keys")

	_config.databaseId_ = "documentdb456"; - Any database id can be specified, this will be created from the code
	_config.collectionId_ = "tasks"; Any Collection id can be specified, this will created for the above databaseId from the code if it is not created already.

 Once the database and collection are created, they can be found here

![Alt text](https://github.com/anodenosql/ang-node-nosql/blob/master/readme/documentscollections.png?raw=true "Databases and Collections")
 
##### Redis
_env/redis-env.js_ has the following details. Update if different configuration is required

	host: "localhost",     
	port: 6379

##### MongoDB
_env/mongodb-env.js has the following details. Update if different configuration
is required

	host: "mongodb://localhost",     
	port: 27017,
	database: "myproject"

## Compile/Install

- Run "npm install" on ang-node-nosql/
- Run "bower install" on ang-node-nosql/
- Run "npm install" on ang-node-nosql/client/

If there are changes to client, compile using "npm start" on ang-node-nosql/client/

## Run

- To use MarkLogic as backend NoSQL database use the following command
	
	_node server --env MarkLogic_

- To use Couchbase as backend NoSQL database use the following command

	_node server --env Couchbase_

- To use DocumentDB as backend NoSQL database use the following command

	_node server --env DocumentDB_

- To use Redis as backend NoSQL database use the following command

	_node server --env Redis_
	
- To use MongoDB as backend NoSQL database use the following command

	_node server --env MongoDB_

## References
##### MarkLogic
 - NodeJS API [http://developer.marklogic.com/learn/node-client-api](http://developer.marklogic.com/learn/node-client-api)

##### Couchbase
 - NodeJS - [https://developer.couchbase.com/documentation/server/current/sdk/nodejs/start-using-sdk.html](https://developer.couchbase.com/documentation/server/current/sdk/nodejs/start-using-sdk.html)

##### DocumentDB 
 - NodeJS API - [https://azure.github.io/azure-documentdb-node/index.html]()

##### Redis 
 - NodeJS API - [http://redis.js.org/](http://redis.js.org/)
 - Async API - [http://caolan.github.io/async/](http://caolan.github.io/async/)

##### MongoDB
 - MongoDB NodeJS API - [https://mongodb.github.io/node-mongodb-native/](https://mongodb.github.io/node-mongodb-native/)
 