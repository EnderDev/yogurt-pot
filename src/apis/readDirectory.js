const { readdir } = require("fs");
const { join, resolve } = require("path");

export function getContents(location) {

    readdir(location, (error, files) => {

        if (error) {

            let didYouMean = '';

            readdir(process.cwd(), (error, files) => {
                if(files.find(baseDirectory)) {
                    didYouMean = `\n\nDid you mean, '${files.find(baseDirectory)[0]}'?\n`
                }
            });

            new MessageSpawn({
                state: 'fatal',
                message: `Cannot find '${baseDirectory}' in '${process.cwd()}'.${didYouMean}`
            });

        } else {
            return files;
        }

    });

}

exports.module = getContents;

