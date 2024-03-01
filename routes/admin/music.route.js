const express = require("express");
const router = express.Router();
const multer = require("multer");
var path = require('path')
// const productValidate = require("../../validates/admin/product-validate");
const controller = require("../../controllers/admin/music.controller");
// const uploadCloud = require("../../middlewares/admin/uploadCloud");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage});
router.get("/", controller.index);
router.delete("/delete/:id",controller.deleteItem);
router.get("/create", controller.create);
router.post("/create",upload.fields([{ name: 'imagecover', maxCount: 1 }, { name: 'link', maxCount: 1 }]),controller.createMusic);
router.get("/edit/:id",controller.edit);
router.patch("/edit/:id",upload.fields([{ name: 'imagecover', maxCount: 1 }, { name: 'link', maxCount: 1 }]),controller.editMusic);
module.exports = router;