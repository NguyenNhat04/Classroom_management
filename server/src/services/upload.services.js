const csv = require("csvtojson/v2");
const { User } = require("../models/User");
const { Subject } = require("../models/Subject");
const { register } = require("../auth-middleware/register");
const { fAddSubject } = require("../subject-middleware/subject");

async function processUpload(req, role) {
    let success = [];
    let fail = [];
    const jsonArray = await csv().fromFile(req.fileUploadPath);

    for (let data of jsonArray) {
        data.role = role;
        try {
            let user = new User(data);
            await user.save();
            success.push(data);
        } catch (error) {
            data.error = error.message;
            fail.push(data);
        }
    }

    return { success, fail };
}

async function processSubjects(req) {
    let success = [];
    let fail = [];
    const jsonArray = await csv().fromFile(req.fileUploadPath);

    for (let data of jsonArray) {
        try {
            let subject = new Subject(data);
            await subject.save();
            success.push(data);
        } catch (error) {
            data.error = error.message;
            fail.push(data);
        }
    }

    return { success, fail };
}

module.exports = { processUpload, processSubjects };