const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

const targetLanguage = process.env.TARGET_LANGUAGE;
const sourceLanguage = process.env.SOURCE_LANGUAGE;
const sourceText = process.env.COMMIT_MESSAGE;

translate(sourceText, sourceLanguage, targetLanguage).then(result => {
    githubProcess(result);
});

async function translate(sourceText, sourceLanguage, targetLanguage) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLanguage}|${targetLanguage}`;

    const response = await fetch(apiUrl);
    const jsonData = await response.json();
    return jsonData.responseData.translatedText;
}

async function githubProcess(text) {
    try {
        const username = process.env.USERNAME;
        const email = process.env.EMAIL;
        const branchName = 'gh-pages';
        const dir = './_posts';
        const filePath = dir + '/' + getNow() + '-Document' + getNow(true) + '.md'

        await exec.exec(`git fetch`);

        await exec.exec(`git config --global user.email ${email}`);

        await exec.exec(`git config --global user.name ${username}`);

        await exec.exec(`git checkout ${branchName}`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        if (!fs.existsSync(filePath)) {
            fs.appendFile(filePath, buildHeader(), function (err) {
                if (err) throw err;
            });
        }

        fs.appendFile(filePath, buildText(username, text, getNow(false, true)), function (err) {
            if (err) throw err;
        });

        await exec.exec(`cat ${filePath}`);
        await exec.exec(`git add ${filePath}`);

        const commitMessage = 'Add new content to documentation';
        await exec.exec(`git commit -m "${commitMessage}"`);

        await exec.exec(`git push origin ${branchName}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

function getNow(withoutFormatting = false, returnTimestamp = false) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    if (withoutFormatting) {
        return yyyy + mm + dd;
    }

    if (returnTimestamp) {
        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();

        return `${yyyy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`;
    }

    return yyyy + '-' + mm + '-' + dd;
}

function buildText(username, text, timestamp) {
    return `- ${timestamp} | ${username}: ${text} \n`;
}

function buildHeader() {
    let str = `---
        layout: default
        title: Document${getNow(true)}
        date: ${getNow()}
        categories: jekyll update
    ---
    `;

    str = str.split('\n')
        .map(line => line.trim())
        .join('\n');

    return str;
}