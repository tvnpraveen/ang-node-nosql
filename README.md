
This project is a three tier application having presentation, business logic and data layers. We used AngularJS for user interface and Node.js for business logic (accessing data) and multiple NoSQL databases for data storage. Our goal is to have a common user interface and an interoperable middle layer to access various NoSQL databases for performing simple CRUD operation. In the process, we were able to learn multiple NoSQL databases. We believe this work will be useful to others who are in need to explore NoSQL databases in a short period of time and hence we share our work here.



The following NoSQL databases are supported currently.

### Local
- MarkLogic 8
- Couchbase 4.5
- Redis 3.2.8
- MongoDB 3.4.1


### Cloud
- Microsoft Azure DocumentDB
- Google Cloud Datastore
- Amazon DynamoDB

## Setup

Install/Register a NoSQL Database

##### MarkLogic - [Install, Start and Configure the MarkLogic server](https://docs.marklogic.com/guide/installation/procedures#id_28962)

##### Couchbase - [Install and Start the server](https://developer.couchbase.com/documentation/server/current/getting-started/installing.html)

##### DocumentDB 
 - [Create an account - Free Trial(30 days/ $200 Credit)](https://portal.azure.com/#)

##### Redis - [Install and Start the server](https://redis.io/download)

##### MongoDB - [Download](https://www.mongodb.com/download-center#community) 

##### Datastore
- [Create a Google Cloud account - Free Trial(60 days/ $300 Credit)](https://console.cloud.google.com/freetrial)
- [Create a Project](
  https://console.cloud.google.com/iam-admin/projects)
- [Enable Datastore Google APIs](https://console.cloud.google.com/flows/enableapi?apiid=datastore.googleapis.com)

##### DynamoDB
- [Create a AWS account](https://aws.amazon.com)


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

##### Datastore
- [Create a service account](https://console.cloud.google.com/iam-admin/serviceaccounts/project)
 - Account Name : sample name
 - Select a Role : Datastore > Datastore Owner
 - Furnish a new private key : Select and keytype: JSON
 - Click on Create button. This will download the .json key file 
- Copy the downloaded json file to the project as _/env/datastore.json_ 

##### DynamoDB
- [Create a AWS account](https://aws.amazon.com)
- Create access key
	- Select Services -> IAM -> Users -> Add user
		- Enter user name
		- Select Access type for Programmatic access
		- Create user and no need to specify persmissions and skip to complete page
			-  Download the .csv file
			-  Open the .csv file
			-  Copy the access key ID and secret access key to a file and the name the file as "credentials" as shown below
			_ ___________________________
			
				aws_access_key_id = AKIAJJT7TPHFA4ALMAX
				aws_secret_access_key = O2z3Q/cEJSe8cmxf9uFIhK0yPC4McDSjiqgjdXDL
			- Select Close

	- Select Services -> IAM -> Users 
		- Select the user link that you created and for which downloaded the access key file
		- Select Permissions
			- Select Add inline policy link
				- Select Policy Generator and  click Select 
					- Select/enter the following values
						- Effect : Allow
						- AWS Service : AWS DynamoDB
						- Actitons : All Actions(*)
						- ARN : *
						- Select Add Statement
						- Select Apply Policy

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

##### Datastore
Update _env/datastore-env.js_ with the projectId from Google Cloud Console. 

	projectId: "sample-id",     
  	kind : "Tasks"

##### DynamoDB
Update _env/dynamodb-env.js with the endpoint information if you are using locally installed DynamoDB

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

- To use Google Cloud Datastore as backend NoSQL database use the following command

	_node server --env Datastore_

- To use Amazon DynamoDB as backend NoSQL database use the following command

     _node server --env DynamoDB

## References
##### MarkLogic
 - [NodeJS API](http://developer.marklogic.com/learn/node-client-api)

##### Couchbase
 - [NodeJS API](https://developer.couchbase.com/documentation/server/current/sdk/nodejs/start-using-sdk.html)

##### Microsoft Azure DocumentDB
 - [Getting Started](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-nodejs-get-started) 
 - [NodeJS API](https://azure.github.io/azure-documentdb-node/index.html)

##### Redis 
 - [NodeJS API](http://redis.js.org/)
 - [Async API](http://caolan.github.io/async/)

##### MongoDB
 - [NodeJS API](https://mongodb.github.io/node-mongodb-native/)

##### Google Cloud Datastore
 - [Overview & Docs](https://cloud.google.com/datastore/docs/concepts/overview?hl=en_US)
 - [NodeJS API](https://cloud.google.com/datastore/docs/reference/libraries)

##### Amazon DynamoDB
 - [Overview & Docs](https://aws.amazon.com/documentation/dynamodb/)
 