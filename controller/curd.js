
const mongoose = require("mongoose");
const model = require("../models/curd");
const validator = require("../validation/validator");
const jwt = require("jsonwebtoken");


const createUser = async (req, res) => {
  try {
    // Request body verifying
    let requestBody = req.body;
  

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameter, please provide author Detaills",
      });
    }

    //Extract body params
    const { fname, lname, title, email, password, age, id } =
      requestBody;

    // Validation started & detecting here the falsy values .
    if (!validator.isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "First name is required" });
    }
    if (!validator.isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Last name is required" });
    }
    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    }

    if (!validator.isValidTitle(title)) {
      return res.status(400).send({
        status: false,
        message: `Title should be among Mr, Mrs and Miss`,
      });
    }
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }

    //Email validation whether it is entered perfectly or not.
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res
        .status(400)
        .send({
          status: false,
          message: `Email should be a valid email address`,
        });
      return;
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: `Password is required` });
    }

    if (!validator.isValid(age)) {
      return res
        .status(400)
        .send({ status: false, message: `age is required` });
    }

    if (!validator.isValid(id)) {
      return res
        .status(400)
        .send({ status: false, message: `id is required` });
    }


    const isEmailAlredyUsed = await model.findOne({ email: email });
    if (isEmailAlredyUsed) {
      return res.status(400).send({
        status: false,
        message: `${email} email address is already registered`,
      });
    }
    //validation Ends

    const newAuthor = await model.create(requestBody);
    return res.status(201).send({
      status: true,
      message: `Author created successfully`,
      data: newAuthor,
    });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

const loginUser = async function (req, res) {

  try {
      let requestBody = req.body;

      //Extract Params
      let { email, password } = requestBody

      if (!validator.isValidRequestBody(requestBody)) {
        return res.status(400).send({
          status: false,
          message: "Invalid request parameter, please provide author Detaills",
        });
      }
      //Validation start
      if (!validator.isValid(email)) {
          return res.status(400).send({ status: false, message: "Please enter an email address." })
      }

      if (!validator.isValid(password)) {
          return res.status(400).send({ status: false, message: "Please enter Password." })
      }

      let user = await model.findOne({ email });

      if (!user)
          return res.status(400).send({ status: false, message: "Login failed! Email  is incorrect." });
    

      let userId = user._id
      // create token
      let token = jwt.sign(
          {
              userId: user._id.toString(),
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
          },
          'prakash123'
      );

  
     res.status(200).send({ status: true, message: 'Success', userId: { userId, token,email,password}});

  } catch (err) {
      res.status(500).send({ message: "Server not responding", error: err.message });
  }
};

const reSetpassword  = async (req, res) => {

  try {
    let userId = req.params.userId;

    let requestBody = req.body.password;

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameter, please provide author Detaills",
      });
    }

    if (!validator.vaildObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid userId" });
    }

    
    const reSetpassword = await model.findOneAndUpdate(
      { _id: userId },
      requestBody,
      { new: true,  }
    );

    
    return res
      .status(200)
      .send({
        status: true,
        message: " My password was reset",
        data: reSetpassword,
      });

  } catch (err) {
    res
      .status(500)
      .send({ message: "Server not responding", error: err.message });
  }
};



const getData = async function (req, res) {
  
  try {

    let filterQuery = {};
    let queryParams = req.query;
    const { userId,fname,lname } = queryParams;

    if (!validator.isValidString(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId id is required" });
    }
    if (!validator.vaildObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid userId" });
    }

    if (!validator.isValidString(fname)) {
      return res.status(400).send({
        status: false,
        message: "fname cannot be empty while fetching.",
      });
    }

    if (!validator.isValidString(lname)) {
      return res.status(400).send({
        status: false,
        message: "lname cannot be empty while fetching.",
      });
    }
    

    if (validator.isValidRequestBody(queryParams)) {
      const { userId,fname,lname } = queryParams;
      if (validator.isValid(userId) && validator.vaildObjectId(userId)) {
        filterQuery["userId"] = userId;
      }
      if (validator.isValid(fname)) {
        filterQuery["fname"] = fname.trim();
      }
      if (validator.isValid(lname)) {
        filterQuery["lname"] = lname.trim();
      }
    }  
    const fillterData = await model.find(filterQuery);
  

    if (Array.isArray(fillterData) && fillterData.length === 0) {
      return res.status(404).send({ status: false, message: "fillter data found" });
    }

    res.status(200).send({ status: true, message: "All Fillterdata list", data: fillterData });

  } catch (err) {
    res
      .status(500)
      .send({ message: "Server not responding", error: err.message });
  }
  
};




const updateDetails = async (req, res) => {

  try {
    let userId = req.params.userId;
    let requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameter, please provide author Detaills",
      });
    }

    if (!validator.vaildObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid userId" });
    }

    const updateUser = await model.findOneAndUpdate(
      { _id: userId },
      requestBody,
      { new: true,  }
    );

    return res
      .status(200)
      .send({
        status: true,
        message: " udated User  Details",
        data: updateUser,
      });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Server not responding", error: err.message });
  }
};


module.exports = { createUser, loginUser, updateDetails , reSetpassword,getData};
