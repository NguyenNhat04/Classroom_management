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

//Hàm thêm sinh viên vào lớp học
async function fAddMembersToClass(req, res) {
  var membersVNUEmails;
  //kiểm tra dữ liệu có hợp lệ không
  try {
    membersVNUEmails = JSON.parse(req.body.members);
  } catch (e) {
    res.status(400);
    res.json({
      status: "Error",
      message: "Loi ",
    });
  }

  //lấy danh sách sinh viên hiện có
  var curMembers = req.classInstance.class_members;
  var set = new Set(); // lưu trữ
  for (i = 0; i < curMembers.length; i++) {
    set.add(curMembers[i].toHexString());
    console.log(curMembers[i].toHexString());
  }
  //tìm kiếm trong mongodb lấy danh sách người dùng có email nằm trong membersVNUEmails
  let instances = await global.DBConnection.User.find({
    email: { $in: membersVNUEmails },
  });

  var check = {}; // biến theo dõi trạng thái
  var added = []; // biến lưu trữ danh sách sinh viên đã được thêm vào lớp (dạng array)

  for (i of membersVNUEmails) {
    check[i] = false;
  }
  //kiểm tra email và thêm vào danh sách
  for (instances of instances) {
    check[instances.email] = true;
    var oldLength = set.size;
    set.add(instances._id.toHexString());
    var newLength = set.size;
  }
  if (oldLength == newLength) {
    check[instances.email] = false;
  }
  //cập nhật danh sách
  req.classInstance.class_members = [];

  for (instance of set) {
    req.classInstance.class_members.push(new ObjectId(instance));
  }
  await req.classInstance.save();

  var notFound = [];
  for ([key, value] of Object.entries(check)) {
    if (!value)
      notFound.push({
        email: key,
        error: "Email không tồn tại trong hệ thống hoặc đã được thêm rồi",
      });
    else added.push({ email: key });
  }
  await req.classInstance.populate("class_members");
  res.status(200);
  res.json(
    Configs.RES_FORM("Success", {
      members: req.classInstance.class_members,
      registered: added,
      failed: notFound,
    })
  );
}

module.exports = {
  fCreateClass,
  fAddMembersToClass,
};
