/* eslint expr: 0, maxlen: 0, no-unused-expressions: 0 */
const chai = require('chai');
const expect = chai.expect;
const helper = require('../helper.js');

describe('helper', function () {
    describe('fixEmails', function () {
        it('Fixes emails by replacing dots by unicode char to store in DB', function () {
            const emails = ["bill@nyu.edu", "sam.dima@nyu.edu"];
            const out = helper.fixEmails(emails);
            const expected = ["bill@nyu\\uff0eedu", "sam\\uff0edima@nyu\\uff0eedu"];
            expect(out).to.deep.equal(expected);
        });
    });

    describe('returnOrigEmails', function () {
        it('Converts emails from DB to correct form', function () {
            const dbEmails = ["bill@nyu\\uff0eedu", "sam\\uff0edima@nyu\\uff0eedu"];
            const out = helper.returnOrigEmails(dbEmails);
            const expected = ["bill@nyu.edu", "sam.dima@nyu.edu"];
            
            expect(out).to.deep.equal(expected);
        });
    });

    describe('billSplitObjs', function () {
        it('Splits the bill amount and creates an object with friends as keys and their debt for the bill as value', function () {
            const splitBetweenArr = ["bill@nyu.edu", "sam.dima@nyu.edu"];
            const out = helper.billSplitObjs(splitBetweenArr, 60);
            const expected = [{ "bill@nyu.edu": 20 }, { "sam.dima@nyu.edu": 20}];
            expect(out).to.deep.equal(expected);
        });
    });

    describe('sumDebt', function () {
        it('Sums the debt of each friend ', function () {
            const friendsObj = {"bill": [5,10,15], "sam": [100,200]};
            const out = helper.sumDebt(friendsObj);
            const expected = {"bill": 30, "sam": 300};
            expect(out).to.deep.equal(expected);
        });
    });
});