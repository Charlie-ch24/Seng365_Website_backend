const userModel = require("../models/user.model");
const bcrypt = require("../../node_modules/bcryptjs");
const hash = require("../../node_modules/bcryptjs");
const path = require('path');
const filepath = (path.join(__dirname, '../../storage/photos/'));
const fs = require('mz/fs');

exports.register = async function (req, res) {
  try {
      console.log("send");
      let isEmailValid = req.body.hasOwnProperty("email");
      const isPasswordThere = req.body.hasOwnProperty("password") && req.body.password.length > 0;
      const isNameThere = req.body.hasOwnProperty("name");
      let password = req.body.password;
      let user_name = req.body.name;
      isEmailValid = isEmailValid && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email);
      isEmailValid = isEmailValid && !(await userModel.checkEmailExist(req.body.email));
      if (isEmailValid && isPasswordThere && isNameThere) {
          const result = await userModel.insertUser(req.body);
          res.status(201).send({"userId": result.insertId});
      } else {
          res.statusMessage = "email, password or name invalid";
          res.status(400).send();
      }
  } catch (err) {
      console.log(err);
      res.statusMessage = "Internal Server Error";
      res.status(500).send();
  }
};

exports.loginToken = async function( req, res ) /*checked */ {

    try {
        let email = req.body.email;
        let password = req.body.password;
        let password_value = req.body.password;
        let checkLogin = await userModel.checkLogin(email, password);
        if (checkLogin) {
            let new_user_id = await userModel.checkEmailAndPassword(req.body.email, req.body.password);
            let user_id = new_user_id[0]["user_id"];
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password_value, 10, function(err, hash) {
                    if (err)
                        reject(err)
                        resolve(hash)
                });
            });
            let auth_token = hashedPassword.substring(0,31)
            const inserting = await userModel.insertAuth(auth_token, user_id);
            res.status(200).send({"userId": user_id, "token": auth_token});

        } else if (!checkLogin) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.getInfo = async function( req, res ) /* checked */ {



    try {

        const id = req.params.id;
        let x_tok = req.headers['x-authorization'];
        let pre_a_id = await userModel.getIdwithAuth(x_tok);
        console.log(pre_a_id)
        let user_id_exist = await userModel.checkIDisthere(id);
        if (user_id_exist.length  === 0) {
            res.status(404).send();
        }
        if (pre_a_id.length === 0) {
            let takeninfo = await userModel.takeInfos(id);
            res.status(200).send(takeninfo[0]);
        }
        let a_id = pre_a_id[0]["user_id"];
        let ids = parseInt(a_id);
        let idb = parseInt(id);
        let idCheck = idb === ids;
        console.log(idCheck)

        // need to check if user in database

        if (idCheck){
            let takeninfo = await userModel.takeInfo(id);
            res.status(200).send(takeninfo[0]);

        } else if (!idCheck) {
            let takeninfo = await userModel.takeInfos(id);
            res.status(200).send(takeninfo[0]);
        }

    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.logoutToken = async function (req, res) {


    try {

        let auth = req.headers["x-authorization"];
        let pre_a_id = await userModel.getIdwithAuth(auth);
        if (pre_a_id.length > 0) {
            // remove from database
            let remove_auth = await userModel.removeAuth(auth);
            res.status(200).send();

        } else {
            res.status(401).send();
        }

        } catch (err) {
            console.log(err);
            res.statusMessage = "Internal Server Error";
            res.status(500).send();
        }
};

exports.patchInfo = async function (req, res) {

    const id = req.params.id;
    let x_tok = req.headers['x-authorization'];
    if (x_tok === undefined) {
        res.status(401).send()

    }
    let x_exist = await userModel.x_tok_there(x_tok);
    let a_id = x_exist[0]["user_id"];
    var float_a_id = parseFloat(a_id);
    var float_id = parseFloat(id);
    let idCheck = float_id === float_a_id;
    if (req.body.hasOwnProperty("email")) {
        let isEmailValid = req.body.hasOwnProperty("email");
        isEmailValid = isEmailValid && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email);
        isEmailValid = isEmailValid && !(await userModel.checkEmailExist(req.body.email));
        console.log(isEmailValid);
        var emailCheck = isEmailValid;
        console.log(emailCheck)
    } else {
        var emailCheck = true;
    }

    if (req.body.hasOwnProperty("password")) {
        var passwordCheckOne = true;
        if (req.body.hasOwnProperty("currentPassword")) {
            let checkPassword = await userModel.checkPassword(id, req.body.currentPassword);
            console.log(checkPassword, "1")
            var passwordCheckTwo = checkPassword
        } else {
            let checkPassword = await userModel.checkPassword(id, req.body.password);
            console.log(checkPassword, "2")
            var passwordCheckTwo = checkPassword;
        }

    } else {
        var passwordCheckOne = false
    }

    try {
        if (idCheck && emailCheck && passwordCheckOne && passwordCheckTwo) {
            console.log("working baby")
            if (req.body.hasOwnProperty("country")) {
                let patchTitle = await userModel.patchCountry(req.body.country, id)
            }
            ;
            if (req.body.hasOwnProperty("city")) {
                let patchTitle = await userModel.patchCity(req.body.city, id)
            }
            ;
            if (req.body.hasOwnProperty("password")) {
                let patchTitle = await userModel.patchPass(req.body.password, id)
            }
            ;
            if (req.body.hasOwnProperty("email")) {
                let patchTitle = await userModel.patchEmail(req.body.email, id)
            }
            ;
            if (req.body.hasOwnProperty("name")) {
                let patchTitle = await userModel.patchName(req.body.name, id)
            }
            ;
            res.statusMessage = "OK"
            res.status(200).send()


        } else if (!idCheck) {
            res.status(403).send()

        } else if (!passwordCheckOne || !emailCheck) {
            res.statusMessage = "Bad Request";
            res.status(400).send()

        } else if (!passwordCheckTwo) {
            res.status(403).send()
        }

    } catch (err) {
    console.log(err);
    res.statusMessage = "Internal Server Error";
    res.status(500).send();
    }


};

exports.userPhoto = async function (req, res) {  //put photo

    try {
        let x_tok = req.headers['x-authorization'];
        let pre_a_id = await userModel.getIdwithAuth(x_tok);
        if (pre_a_id === undefined) {
            res.status(401).send()

        }
        const id = req.params.id;
        let id_check = await userModel.checkIDisthere(id);

        if (id_check.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }

        let a_id = pre_a_id[0]["user_id"];
        let auth_made_pet = a_id == id;
        console.log(auth_made_pet)


        let content = req.headers["content-type"];
        if (content === undefined) {
            res.status(400).send()
        }
        let hasPhoto = await userModel.checkPhoto(id); // check user has photo
        let pngfile = `user_id(${a_id}).png`;
        let jpegfile = `user_id(${a_id}).jpeg`;
        let giffile = `user_id(${a_id}).gif`;
        if (auth_made_pet) {
            console.log("yep");
            if (!hasPhoto) {
                if (content === "image/png" ){
                    req.pipe(fs.createWriteStream(filepath + pngfile));
                    let insertPhoto = await userModel.insertUserPho(pngfile, id); // change to go into user
                    res.statusMessage = "Created";
                    res.status(201).send();
                }
                if (content === "image/jpeg" || content === "image/jpg") {
                    req.pipe(fs.createWriteStream(filepath + jpegfile));
                    let insertPhoto = await userModel.insertUserPho(jpegfile, id);
                    res.statusMessage = "Created";
                    res.status(201).send();
                }
                if (content === "image/gif" ) {
                    req.pipe(fs.createWriteStream(filepath + giffile));
                    let insertPhoto = await userModel.insertUserPho(giffile, id);
                    res.statusMessage = "Created";
                    res.status(201).send();
                } else {
                    res.statusMessage = "Bad Request";
                    res.status(400).send()
                }

            } else if (hasPhoto) {
                if (content === "image/jpeg" || content === "image/jpg") {
                    req.pipe(fs.createWriteStream(filepath + jpegfile));
                    let insertPhoto = await userModel.insertUserPho(jpegfile, id);
                    res.statusMessage = "OK";
                    res.status(200).send();
                }
                if (content === "image/png") {
                    req.pipe(fs.createWriteStream(filepath + pngfile));
                    let insertPhoto = await userModel.insertUserPho(pngfile, id);
                    res.statusMessage = "OK";
                    res.status(200).send();
                }
                if (content === "image/gif") {
                    req.pipe(fs.createWriteStream(filepath + giffile));
                    let insertPhoto = await userModel.insertUserPho(giffile, id);
                    res.statusMessage = "OK";
                    res.status(200).send();
                } else {
                    res.statusMessage = "Bad Request";
                    res.status(400).send()
                }
            }
        } else if (!auth_made_pet) {
            res.statusMessage = "Bad request";
            res.status(403).send()
        }



    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.photoDel = async function (req, res) {


    try {
        let x_tok = req.headers['x-authorization'];
        if (x_tok === undefined) {
            res.status(401).send()
        }
        let pre_a_id = await userModel.getIdwithAuth(x_tok);
        const id = req.params.id;
        let id_check = await userModel.checkIDisthere(id);

        if (id_check.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }

        let a_id = pre_a_id[0]["user_id"];
        let auth_made_pet = a_id == id;
        console.log(auth_made_pet)
        let hasPhoto = await userModel.checkPhoto(id); //checks that user has a photo
        console.log(hasPhoto, "has photo")


        if (auth_made_pet && hasPhoto) {

            let getPhot = await userModel.getPhoto(id)
            let photoName = getPhot[0]["photo_filename"]
            fs.unlink(filepath + `${photoName}`);
            let delePhoto = await userModel.delPhoto(id);
            res.statusMessage = "OK"
            res.status(200).send()

        } else if (!auth_made_pet) {
            res.status(403).send()
        } else if (!hasPhoto) {
            res.status(403).send()
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.getPhoto = async function (req, res) {


    try {

        const id = req.params.id;
        let id_check = await userModel.checkIDisthere(id); // returns true if the id given is in the database
        id_check = id_check.length > 0;
        if (!(id_check)) {
            res.statusMessage = "Not Found";
            res.status(404).send();
            return
        }
        let getPhot = await userModel.getPhoto(id)
        let photoName = getPhot[0]["photo_filename"]
        let check_photo_db = await userModel.checkphodb(id); // returns true if photo is in the data base
        if (!check_photo_db) {
            console.log("lll")
            res.statusMessage = "Not Found";
            res.status(404).send();

        } else if (check_photo_db){
            let imageDets = await fs.readFile(filepath + photoName );
            let MimeType = await userModel.getMime(photoName);
            if (MimeType === null) {
                res.statusMessage = "Not Found";
                res.status(404).send();
            }
            res.statusMessage = "OK";
            res.status(200).contentType(MimeType).send(imageDets)
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};









