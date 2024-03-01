const Music = require("../../models/music.model");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const options = {
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000 * 365 // 1 day
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://ptitwebmusicspring24.appspot.com"
});
const bucket = admin.storage().bucket();

module.exports.index = async (req, res) => {
    const totalItem = await Music.find().countDocuments();
    let paginationObject = paginationHelper(1, 4, req.query, totalItem);
    paginationObject.totalItem = totalItem;
    const musics = await Music.find()
        .skip(paginationObject.skip)
        .limit(paginationObject.limit);
    // const listMusic = Array.isArray(musics) ? musics : Array.from(musics);
    // console.log(listMusic)
    res.render("admin/pages/music/index", {
        pageTitle: "Music",
        listMusic: musics,
        // filterStatus: filterStatus,
        // keyword: searchObject.keyword,
        pagination: paginationObject
    });
}

// module.exports.changeStatus = async (req, res) => {
//     const id = req.params.id;
//     const status = req.params.status;
//     const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date()
//     };
//     try{
//         await Product.updateOne({ _id: id }, { 
//             status: status,
//             $push:{updatedBy: updatedBy}
//         });
//         req.flash("success", "Cập nhật sản phẩm thành công");
//     }
//     catch(error){
//         req.flash("error", "Cập nhật sản phẩm không thành công");
//     }
//     res.redirect("back");
// }

// module.exports.changeMulti = async (req, res) => {
//     const listID = req.body.ids.split(" ");
//     const type = req.body.type;
//     const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date()
//     };
//     switch (type) {
//         case "active":
//             await Product.updateMany({ _id: { $in: listID } }, { 
//                 status: "active",
//                 $push:{updatedBy:updatedBy}
//             });
//             req.flash("success", "Cập nhật sản phẩm thành công");
//             break;
//         case "inactive":
//             await Product.updateMany({ _id: { $in: listID } }, { 
//                 status: "inactive",
//                 $push:{updatedBy:updatedBy}
//             });
//             req.flash("success", "Cập nhật sản phẩm thành công");
//             break;
//         case "delete-all":
//             await Product.updateMany({ _id: { $in: listID } }, { 
//                 deleted: true, 
//                 deletedBy:{
//                     account_id: res.locals.user.id,
//                     deletedAt: new Date()
//                 } 
//             });
//             req.flash("success", "Xóa sản phẩm thành công");
//             break;
//         case "change-position":
//             for (const item of listID) {
//                 let [id, position] = item.split("-");
//                 position = parseInt(position);
//                 await Product.updateOne({ _id: id }, { 
//                     position: position,
//                     $push:{updatedBy:updatedBy} 
//                 });
//             }
//             req.flash("success", "Thay đổi vị trí sản phẩm thành công");
//             break;
//         default:
//             break;

//     }

//     res.redirect("back");
// }

module.exports.deleteItem = async (req, res) => {
    console.log("deleteItem ")
    const id = req.params.id;
    console.log(id)
    try{
        await Music.deleteOne({ _id: id});
        req.flash("success","Delete successfully");
    }
    catch(error){
        req.flash("error","Delete unsuccessfully");
    }
    res.redirect("back");
}

module.exports.create = async (req, res) => {

    res.render("admin/pages/music/create", {
        pageTitle: "Add Song"
    });
}

module.exports.createMusic = async (req, res) => {
    // Connect to firebase
    // console.log(typeof(res.files["imagecover"][0]));
    try {
        // Handle image upload
        const imageFile = req.files["imagecover"][0];
        console.log(imageFile);
        const imageFilePath = `images/${Date.now()}_${imageFile.originalname}`;
        await bucket.upload(imageFile.path, { destination: imageFilePath });
        let signedUrl = await bucket.file(imageFilePath).getSignedUrl(options);
        image_url = signedUrl[0]; 
        req.body.imagecover = image_url;
        // Handle song upload
        const songFile = req.files["link"][0];
        const songFilePath = `songs/${Date.now()}_${songFile.originalname}`;
        await bucket.upload(songFile.path, { destination: songFilePath });
        signedUrl = await bucket.file(songFilePath).getSignedUrl(options);
        song_url = signedUrl[0];
        req.body.link = song_url;

    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).send('Internal Server Error');
    }
    
    try {
        await Music.create(req.body);
        req.flash("success", "Song added");
        res.redirect(`${systemConfig.prefixAdmin}/music`);
    }
    catch (error) {
        req.flash("error", "Song not added");
        res.redirect("back");
    }
}

module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;
        const music = await Music.findOne({ _id: id});
        res.render("admin/pages/music/edit", {
            pageTitle: "Modify Song",
            music: music
        });
    }
    catch(error){
        req.send("error","Song not exist");
        res.redirect("back");
    }
}

module.exports.editMusic = async (req, res) => {
    // Connect to firebase
    console.log(typeof(req.files["imagecover"]));

    if(req.files["imagecover"] != null){
        try {
            // Handle image upload
            const imageFile = req.files["imagecover"][0];
            const imageFilePath = `images/${Date.now()}_${imageFile.originalname}`;
            await bucket.upload(imageFile.path, { destination: imageFilePath });
            let signedUrl = await bucket.file(imageFilePath).getSignedUrl(options);
            image_url = signedUrl[0]; 
            req.body.imagecover = image_url;
        }catch{
            console.error('Error uploading files:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    if(req.files["link"] != null){
        try{
            // Handle song upload
            const songFile = req.files["link"][0];
            const songFilePath = `songs/${Date.now()}_${songFile.originalname}`;
            await bucket.upload(songFile.path, { destination: songFilePath });
            signedUrl = await bucket.file(songFilePath).getSignedUrl(options);
            song_url = signedUrl[0];
            req.body.link = song_url;
        }catch (error) {
            console.error('Error uploading files:', error);
            res.status(500).send('Internal Server Error');
        }
    } 
    try{
        await Music.updateOne({ _id: req.params.id},{
            ...req.body,
        });
        req.flash("success", "Update successfully");
    }
    catch(error){
        req.flash("error", "Update unsuccessfully");
    }
    res.redirect(`${systemConfig.prefixAdmin}/music`);
}