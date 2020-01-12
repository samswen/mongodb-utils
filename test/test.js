/* eslint-disable no-undef */
'use strict';

const { openDatabase, closeDatabase, getMongoClient} = require('../src');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const mongodb_url = 'mongodb://username:password@database.domain.com/database?tls=true';

describe('test openDatabase and closeDatabase', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const database = await openDatabase(mongodb_url);

        try {
            await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
            const result = await database.collection('test_collection').findOne({key: 'test value'});

            assert.isNotNull(result);
            expect(result.key).to.be.an('string');
            expect(result.key).equals('test value');
    
            await database.collection('test_collection').deleteMany({key: 'test value'});

        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        }
        await closeDatabase();
    });
});

describe('test getMongoClient with transaction', () => {

    it('verifies it should works with collection insert and get operation', async () => {

        const database = await openDatabase(mongodb_url);
        const session = getMongoClient().startSession();
        try {
            await session.withTransaction(async () => {
                await database.collection('test_collection').insertOne({started_at: Date.now(), key: 'test value'});
                const result = await database.collection('test_collection').findOne({key: 'test value'});

                assert.isNotNull(result);
                expect(result.key).to.be.an('string');
                expect(result.key).equals('test value');
        
                await database.collection('test_collection').deleteMany({key: 'test value'});
            }, {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            });
        } catch(err) {
            console.error(err);
            assert.fail(err.message);
        } finally {
            await session.endSession();
        }
        await closeDatabase();
    });
});

