function getProfileById(req, res) {
    if (req.params.profileId == "me") {
        var final = req.senderInstance;
        res.status(200);
        res.json(Configs.RES_FORM("Success",final))
        return;
    } 
    global.DBConnection.User.findOne({"vnu_id": req.params.profileId}).lean().exec((err, instance) => {
        if (err) {
            res.status(400)
            res.json(Configs.RES_FORM("Internal Error", err.toString()))
        }
        if (instance) {
            res.status(200);
            res.json(instance)
        } else {
            res.status(404);
            res.json( "User not found")

        }
    })
}