
const express = require("express");
const router = express.Router();
const Controller = require("../controller/curd");




// All the Endpoints
router.post("/create" , Controller.createUser);

router.post("/Login" , Controller.loginUser);

router.get("/Fillter" , Controller.getData);

router.put("/resetPassword/:userId" , Controller.reSetpassword);

router.put("/updateUser/:userId" , Controller.updateDetails);




module.exports = router;