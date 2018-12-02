function fixEmails(emailArr){
    const fixedEmails = emailArr.map(ele => {
        return ele.replace(/\./g, '\\uff0e');
    });

    return fixedEmails;
}

function returnOrigEmails(emailArr) {
    return emailArr.map(ele => {
        return ele.replace(/\\uff0e/g, '.');
    });
}

function billSplitObjs(splitBetweenArr, billAmount){

    const splitAmount = (billAmount / (splitBetweenArr.length + 1));
    return splitBetweenArr.map(ele => {
        const tempObj = {};
        tempObj[ele] = splitAmount;
        return tempObj;
    });
}

function sumDebt(friendsObj){
    const friends = Object.keys(friendsObj);
    friends.forEach(friend => {
        friendsObj[friend] = friendsObj[friend].reduce((accumulator, currentValue) =>
            accumulator + currentValue
        );
    });
    return friendsObj;
}

module.exports = {
    fixEmails: fixEmails,
    returnOrigEmails: returnOrigEmails,
    billSplitObjs: billSplitObjs,
    sumDebt: sumDebt
};