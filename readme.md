# mongodb-utils

an useful collection of utils for mongodb operations

## how to install

    npm install @samwen/mongodb-utils --save

## how to use

    const { openDatabase, closeDatabase} = require('@samwen/mongodb-utils');
    const mongodb_url = 'mongodb://username:password@database.domain.com/database?tls=true';
    
    const database = await openDatabase(mongodb_url);
    try {
        await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
    } catch(err) {
        console.error(err);
    }
    closeDatabase(database);

## note

in order to use mongodb_url in the specified format, you must create user under the database:

    mongo shell commands:
    use testdb
    db.createUser({
        user: "testDbUser",
        pwd: "......",
        roles: [ { role: "readWrite", db: "testdb" } ]
    })
