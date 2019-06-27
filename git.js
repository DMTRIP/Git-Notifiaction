const request = require('request');


function GithubApi () {
    this.getCommitMassege = ( repoUrl ) => new Promise((resolve, reject) => {
        const url = `https://api.github.com/repos/DMTRIP/phonebook/commits?client_id=796391a0b2d47394dbbf&client_secret=f9d5019a949e1e545cd049e0817e03b20fa55c56`;

        const options = {
            method: 'GET',
            headers: {'user-agent': 'node.js', 'Authorization': '4bb28aab3916d85141b6d851fbdf19cdb7ed0c6b'}
        };

        request(url, options, (err, res, body) => {
            // парсим нашы даные в массив обьектов (комитов)
            const data = Array.from(JSON.parse(body));
            if(res.caseless.dict.status === '200 OK') {
                resolve(data);
            } else {
                reject('status is not 200');
            }
        });

    });

};

module.exports = {
    api : GithubApi,
};
