'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = {
    openDatabase,
    closeDatabase
};

let url = null;
let client = null;
let database = null;

async function openDatabase(mongodb_url) {

    if (url && url === mongodb_url && database) {
        return database;
    }
    if (!client) {
        await closeDatabase();
    }

    try {
        url = mongodb_url;
        client = await MongoClient.connect(url, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
        });
        database = client.db();
        return database;
    } catch(err) {
        console.error(err);
    }
    return null;
}

async function closeDatabase() {

    if (!client) {
        database = null;
        return;
    }
    try {
        await client.close();
        url = null;
        client = null;
        database = null;
    } catch (err) {
        console.error(err);
    }
}
