
This project is a three tier application(UI Layer -&gt; AngularJS2, Middle Layer -&gt; NodeJS, Backend - Various NoSQL Databases) which can run on different NoSQL databases. This framework provides an idea of getting started with a NoSQL database for performing simple CRUD operations.

This will give an idea on how the databases work with simple operations relatively.


The following NoSQL databases are supported currently.

### Local
- MarkLogic 8
- Couchbase 4.5
- Redis 3.2.8

### Cloud
- Microsoft Azure DocumentDB

## Setup

Install the NoSQL Database from the above supported databases

##### MarkLogic - [https://docs.marklogic.com/guide/installation](https://docs.marklogic.com/guide/installation)

##### Couchbase - [https://developer.couchbase.com/documentation/server/current/getting-started/installing.html](https://developer.couchbase.com/documentation/server/current/getting-started/installing.html)

##### DocumentDB - Register at [https://portal.azure.com/#](https://portal.azure.com/#)


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

## Application Configuration

##### MarkLogic
Update _env/marklogic-env.js_ with the following details. Update if different configuration is required

	database: "Documents",
	host: "localhost",
	port: 8000,
	user: "admin",
	password: "admin",
	authType: "DIGEST"

##### Couchbase
Update _env/couchbase-env.js_ with the following details. Change the hostname or bucket name as required

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
 

## Compile/Install

- Run "npm install" on ang-node-nosql/
- Run "bower install" on ang-node-nosql/
- Run "npm install" on ang-node-nosql/client/

If there are changes to client, compile using "npm start" on ang-node-nosql/client/

## Run

- To use MarkLogic as back end NoSQL database use the following command
	
	_node server --env MarkLogic_

- To use Couchbase as back end NoSQL database use the following command

	_node server --env Couchbase_

- To use DocumentDB as back end NoSQL database use the following command

	_node server --env DocumentDB_

## References
- DocumentDB NodeJS API
 - https://azure.github.io/azure-documentdb-node/index.html