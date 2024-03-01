const Artist = require("../../models/artist.model");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

module.exports.index = async (req,res)=>{
    
    const records = await Artist.find();
    // console.log(typeof(records[0].id_albums))
    // for(item in records){
    //     console.log(typeof(item.id_albums))
    //     if(typeof(item.id_albums) == "string"){
    //         records[item].id_albums = [item.id_albums]
    //     }
    // }
    res.render("admin/pages/artist/index",{
        pageTitle: "Artist",
        records: records
    });
}
module.exports.create = async (req,res) => {

    
    const records = await Artist.find();

    res.render("admin/pages/artist/create",{
        pageTitle: "Add Artist",
        records: records
    });
}

module.exports.createPost = async(req,res) =>{

    console.log(req.body)
    
    try{ 
        await Artist.create(req.body);
        req.flash("success", "OK");
        res.redirect(`${systemConfig.prefixAdmin}/artist`);
    }
    catch(error){
        req.flash("error","Not OK");
        res.redirect("back");
    }
}

// module.exports.edit = async (req,res) => {

//     const records = await ProductCategory.find({deleted: false});
//     const newRecords = createTreeHelper.create(records);
//     let find = {
//         deleted: false,
//         _id: req.params.id
//     };
//     const data = await ProductCategory.findOne(find);

//     res.render("admin/pages/product-category/edit",{
//         pageTitle: "Tạo danh mục",
//         records: newRecords,
//         data:data
//     });
// }

// module.exports.editPatch = async (req,res) => {
//     const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date()
//     };
//     try{
//         req.body.positon = parseInt(req.body.positon);

//         await ProductCategory.updateOne({_id: req.params.id},{
//             ...req.body,
//             $push:{updatedBy:updatedBy}
//         });
//         req.flash("success","Cập nhật thành công");
//         res.redirect(`${systemConfig.prefixAdmin}/products-category`);
//     }
//     catch(error){
//         req.flash("error","Cập nhật thất bại");
//         res.redirect("back");
//     }
// }

module.exports.deleteItem = async (req, res) =>{
    try{
        await Artist.deleteOne({_id : req.params.id});
        req.flash("success","Delete Successfully");
    }
    catch(error){
        console.log(error);
        req.flash("error","Delete Unsuccessfully");
    }   
    res.redirect("back");
}

// module.exports.changeStatus = async (req, res) => {
//     const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date()
//     };
//     try{
//         const status = req.params.status;
//         const id = req.params.id;
//         await ProductCategory.updateOne({_id:id},{
//             status: status,
//             $push:{updatedBy:updatedBy}
//         });
//         req.flash("success","Cập nhật trạng thái thành công");
//     }
//     catch(error){
//         req.flash("error","Cập nhật trạng thái không thành công");
//     }
//     res.redirect("back");
// }
