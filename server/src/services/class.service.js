const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

async function fCreateClass(req, res) {
  let senderVNUId = req.senderVNUId;
  //kiểm tra role
  if (req.senderInstance.role !== "teacher") {
    res.status(404);
    res.json({
      status: "Error",
      message: "Permission Denied, role = teacher moi co quyen tao lop",
    });
  } else {
    try {
      let newClass = new global.DBConnection.Class({
        class_id: uuidv4(),
        class_name: req.body.class_name,
        class_teacher: new ObjectId(req.senderInstance._id),
      });
      await newClass.save();
      res.status(200);
      res.json({
        status: "Success",
        message: "Tao lop thanh cong",
      });
    } catch (e) {
      res.status(400);
      res.json({
        status: "Error",
        message: "Xay ra loi trong viec tao lop",
      });
    }
  }
}

module.exports = {
  fCreateClass,
};
