require('dotenv').config()
const { Storage } = require('@google-cloud/storage');



const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'key.json'
}
);

const bucketName = process.env.BUCKET_NAME;
const filename = 'test.txt';

// These options will allow temporary uploading of the file with outgoing
// Content-Type: application/octet-stream header.

const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: 'application/octet-stream',
};

// Get a v4 signed URL for uploading file
const getUrl = async () => {
    try {
        const [url] = await storage
            .bucket(bucketName)
            .file(filename)
            .getSignedUrl(options);

        return url;

    } catch (error) {
        throw error;
    }
}

(start = async () => {
    try {
        const url = await getUrl();
        console.log('Generated PUT signed URL:');
        console.log(url);
        console.log('You can use this URL with any user agent, for example:');
        console.log(
            "curl -X PUT -H 'Content-Type: application/octet-stream' " +
            `--upload-file my-file '${url}'`
        );
    } catch (error) {
        console.log(error);
    }
})();
