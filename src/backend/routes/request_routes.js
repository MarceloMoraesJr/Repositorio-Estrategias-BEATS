const express = require("express");
const router = express.Router();
const request_controller = require("../controllers/request_controllers");

const middlewares = require('../middlewares');

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const dir = process.env.PATH_REQUEST_IMGS + `${req.request_inserted.protocol_number}`;

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        cb(null, dir);
    },
    filename: function (req, file, cb){
        cb(null, `${Date.now()}` + '_' + file.originalname);
    }
});

const multi_upload = multer({storage}).array('images', 10);




router.get('/requests/addition', middlewares.authorizeUser([0, 1]));

router.post('/requests/addition', middlewares.authorizeUser([0, 1]),
            request_controller.postAddRequestInsertDB,
            multi_upload,
            middlewares.assertBodyFields(['name', 'type', 'aliases', 'c', 'i', 'a', 'authn', 'authz', 'acc', 'nr']),
            middlewares.preprocessAddRequestForm, 
            request_controller.postAddRequestSaveJSON);

module.exports = router;