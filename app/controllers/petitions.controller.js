const userModel = require("../models/user.model");
const petitionsModel = require("../models/petitions.model");
const categoryModel = require("../models/category.model");
const fs = require('mz/fs');
const path = require('path');
const filepath = (path.join(__dirname, '../../storage/photos/'));


exports.addPet = async function (req, res) {
    try {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds() + '.'+ today.getMilliseconds()
        console.log(date)
        if (!(req.body.hasOwnProperty("title"))) {
            res.status(400).send()
        }
        let x_tok = req.headers['x-authorization'];
        let checkUnauth = await userModel.getIwithAuth(x_tok); // the id isnt given so this finds an id with the Auth
        if (!checkUnauth) {
            res.statusMessage = "Unauthorized";
            res.status(401).send()
        }
        let check_cat = await petitionsModel.checkCat(req.body.categoryId);
        console.log(check_cat)
        if (!check_cat) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return

        }
        let pre_a_id = await userModel.getIdwithAuth(x_tok);
        let a_id = pre_a_id[0]["user_id"];
        if (req.body.closingDate === null || req.body.closingDate === undefined) {
            const result = await petitionsModel.insertPetNo(req.body, a_id, date);
            console.log(result)
            res.status(201).send({"petitionId": result.insertId}); // comapre to register function
        }

        let closing_date = req.body.closingDate;
        var c_d = Date.parse(closing_date);
        var da = Date.parse(date);
        if (da <= c_d && check_cat ) {
            const result = await petitionsModel.insertPet(req.body, a_id, date);
            res.status(201).send({"petitionId": result.insertId}); // comapre to register function
        } else if (!check_cat || da >= c_d) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        }
    } catch (err) {
    console.log(err);
    res.statusMessage = "Internal Server Error";
    res.status(500).send();
    }
};

exports.Pet_with_id = async function (req, res) { // time of dates return funny

    const id = req.params.id;
    try {
        // need to check if user in database
        let pet_id_exist = await petitionsModel.checkPETID(id);
        if (pet_id_exist.length === 0) {
            res.statusMessage = "Not there";
            res.status(404).send();

        } else {
            let takenPetInfo = await petitionsModel.takePet(id);
            res.status(200).send(takenPetInfo[0]);
            return
            // my next steps are to link up a bunch of tables and get the other values


        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.deletePetition = async function (req, res) { // this needs some work


 // returns true if auther made that petiton needs to delete signatures
    try {
        const id = req.params.id; // id of pet
        let checkid = await petitionsModel.checkPETID(id)
        checkid = checkid.length > 0;
        console.log(checkid, "");
        if (!checkid) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }
        let x_tok = req.headers['x-authorization'];

        let x_exist = await userModel.x_tok_there(x_tok);
        if (x_exist.length === 0) {
            res.status(401).send()
        }


        let a_id = x_exist[0]["user_id"];
        let x_a_check = await petitionsModel.checkpetandid(id, a_id);

        if (x_a_check) { //also need to delete signatures!!
            let delete_signatures = await petitionsModel.deleteSignatures(id);
            let delete_petiton = await petitionsModel.deletePetition(id);
            res.statusMessage = "OK"
            res.status(200).send();
        } else if (!x_a_check) {
            res.status(403).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.addSign = async function (req, res) {



    try {

        const id = req.params.id;
        let checkid = await petitionsModel.checkPETID(id)
        checkid = checkid.length > 0;
        if (!checkid) {
            res.statusMessage = "Not Found";
            res.status(404).send();
            return
        };


        let x_tok = req.headers['x-authorization'];
        let x_exist = await userModel.x_tok_there(x_tok);
        if ((x_exist.length === 0)) {
            res.status(401).send();
            return
        };


        let a_id = x_exist[0]["user_id"];
        let alreadySigned = await petitionsModel.alreadySigned(id, a_id);
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds() + '.'+ today.getMilliseconds()
        let takenPetInfo = await petitionsModel.takeInfoOnPet(id);
        let closing = takenPetInfo[0]["closing_date"];
        if (closing === undefined || closing === null) {
            let signing_time = await petitionsModel.signing_time(a_id, id, date);
            res.statusMessage = "Created"
            res.status(201).send();
        }
        var c_d = Date.parse(closing);
        var da = Date.parse(date);





        if ((!alreadySigned) && da <= c_d) { // need to compare dates still
            let signing_time = await petitionsModel.signing_time(a_id, id, date);
            res.statusMessage = "Created"
            res.status(201).send();

        } else if (alreadySigned) {;
            res.status(403).send();

        } else if (da >= c_d) {
            res.status(403).send();
        }
        } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.delSign = async function (req, res) {



    try {
        const id = req.params.id;
        let checkid = await petitionsModel.checkPETID(id)
        checkid = checkid.length > 0;
        if (!checkid) {
            res.status(404).send();
        };

        let x_tok = req.headers['x-authorization'];
        let x_exist = await userModel.x_tok_there(x_tok);
        if (x_exist.length === 0 ) {
            res.status(401).send()
        };

        let a_id = x_exist[0]["user_id"];
        let petCreator = await petitionsModel.did_this_person_make_the_petition(id, a_id); // returns true if they did and they cant delete sign
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds() + '.'+ today.getMilliseconds()
        let takenPetInfo = await petitionsModel.takeInfoOnPet(id);
        let id_ont_pet = await petitionsModel.id_ont_pet(a_id, id); // returns true if they have signed it so can be deleted
        if (!id_ont_pet) {
            res.status(403).send()

        };
        let closing = takenPetInfo[0]["closing_date"];
        if (closing === undefined || closing === null) {
            let removeSign = await petitionsModel.removeSign(id, a_id);
            res.status(200).send()
        }

        var c_d = Date.parse(closing);
        var da = Date.parse(date);



        if ((!petCreator) && id_ont_pet && da <= c_d) {
            console.log("can delete");
            let removeSign = await petitionsModel.removeSign(id, a_id);
            res.status(200).send()

        } else if (!id_ont_pet || da > c_d ) {
            res.status(403).send();

        } else if (petCreator) {
            res.status(403).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.Category = async function (req, res ) {

    let getAlCat = await petitionsModel.getCat();

    try {

        res.statusMessage = "OK";
        res.status(200).send(getAlCat);

    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.patchPet = async function (req, res) {


    try {


        const id = req.params.id;
        let checkid = await petitionsModel.checkPETID(id)
        let checkids = checkid.length === 0;
        if (checkids) {
            res.status(404).send();
            return
        };

        let x_tok = req.headers['x-authorization'];
        let pre_a_id = await userModel.getIdwithAuth(x_tok);
        if (pre_a_id.length === 0) {
            res.status(401).send()
            return
        };



        let a_id = pre_a_id[0]["user_id"];
        /*now i need to compare this id got to the petiton id */
        let auth_made_pet = await petitionsModel.checkpetandid(id, a_id); /* status 401 */
        if (req.body.hasOwnProperty("categoryId")) {
            let check_cat = await petitionsModel.checkCat(req.body.categoryId);
            console.log(check_cat)
            if (!check_cat) {
                res.statusMessage = "Bad request";
                res.status(400).send()
                return
            }

        }

        if (auth_made_pet) {
            console.log("sweaty")
            let takenPetInfo = await petitionsModel.takeInfoOnPet(id);
            console.log("eroor")
            let closing = takenPetInfo[0]["closing_date"];
            console.log(closing, "hi")
            if (closing === null) {
                if (req.body.hasOwnProperty("title")) {
                    await petitionsModel.patchTit(req.body.title, id)
                }
                if (req.body.hasOwnProperty("description")) {
                    await petitionsModel.patchDes(req.body.description, id)
                }
                if (req.body.hasOwnProperty("categoryId")) {
                    await petitionsModel.patchCat(req.body.categoryId, id)
                }
                if (req.body.hasOwnProperty("closingDate")) {
                    await petitionsModel.patchCD(req.body.closingDate, id)
                }
                res.status(200).send();
                return
            }


            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds() + '.'+ today.getMilliseconds()
            var c_d = Date.parse(closing);
            var da = Date.parse(date);
            console.log(da, c_d)

            if (da <= c_d) {
                if (req.body.hasOwnProperty("title")) {
                    await petitionsModel.patchTit(req.body.title, id)
                }
                if (req.body.hasOwnProperty("description")) {
                    await petitionsModel.patchDes(req.body.description, id)
                }
                if (req.body.hasOwnProperty("categoryId")) {
                    await petitionsModel.patchCat(req.body.categoryId, id)
                }
                if (req.body.hasOwnProperty("closingDate")) {
                    await petitionsModel.patchCD(req.body.closingDate, id)
                }
                res.status(200).send();
                return


            } else if (c_d < da){
                res.status(403).send();
            } else {
                res.status(401).send()
            }

        } else if (!auth_made_pet) {;
            res.status(403).send();

        } else {
            res.status(402).send()
        }

    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.getSign = async function (req, res) {


    try {

        const id = req.params.id;
        let checkId = await petitionsModel.checkPETID(id);
        checkId = checkId.length > 0;
        console.log(checkId)

        if (checkId) {
            let getSigns = await petitionsModel.getSignatures(id)
            res.status(200).send(getSigns)
        } else if (!checkId) {
            res.statusMessage = "Not found";
            res.status(404).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.getPetParam = async function (req, res) { // this one isnt done

    try {


        let start = req.query.startIndex;
        let catid = req.query.categoryId;
        let q_val = req.query.q;
        let sortBy_v = req.query.sortBy;
        let count_v = req.query.count;
        let authorId_v = req.query.authorId;
        if ( start < 0 && count_v < 0 ) {
            start = 0;
            count_v = 0;
        }

        let return_vale = await petitionsModel.getAllPetitions(start, count_v, sortBy_v, catid, authorId_v, q_val)
        res.status(200).send(return_vale)

    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }

};

exports.putPhoto = async function (req, res) {

    try {
        let x_tok = req.headers['x-authorization'];

        let pre_a_id = await userModel.getIdwithAuth(x_tok);
        console.log(pre_a_id)
        if (pre_a_id.length === 0) {
            res.status(401).send()
        }
        let a_id = pre_a_id[0]["user_id"];
        const id = req.params.id;
        let pet_id_exist = await petitionsModel.checkPETID(id);
        if (pet_id_exist.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }
        let auth_made_pet = await petitionsModel.checkpetandid(id, a_id);
        let content = req.headers["content-type"];
        if (content === undefined) {
            res.status(400).send()
        }
        let hasPhoto = await petitionsModel.checkPhoto(id);
        console.log(hasPhoto)
        let pngfile = `petetion_id(${id})__user_id(${a_id}).png`;
        let jpegfile = `petetion_id(${id})__user_id(${a_id}).jpeg`;
        let giffile = `petetion_id(${id})__user_id(${a_id}).gif`;
        if (auth_made_pet) {
            if (!hasPhoto){
                if (content === "image/png" ){
                    req.pipe(fs.createWriteStream(filepath + pngfile));
                    let insertPhoto = await petitionsModel.insertPho(pngfile, id);
                    res.statusMessage = "Created";
                    res.status(201).send();
                }
                if (content === "image/jpeg" || content === "image/jpg") {
                    req.pipe(fs.createWriteStream(filepath + jpegfile));
                    let insertPhoto = await petitionsModel.insertPho(jpegfile, id);
                    res.statusMessage = "Created";
                    res.status(201).send();
                }
                if (content === "image/gif" ) {
                    req.pipe(fs.createWriteStream(filepath + giffile));
                    let insertPhoto = await petitionsModel.insertPho(giffile, id);
                    res.statusMessage = "Created";
                    res.status(201).send();
                } else {
                    res.statusMessage = "Bad Request";
                    res.status(400).send()
                }

                } else if (hasPhoto) {
                if (content === "image/jpeg" || content === "image/jpg") {
                    req.pipe(fs.createWriteStream(filepath + jpegfile));
                    let insertPhoto = await petitionsModel.insertPho(jpegfile, id);
                    res.statusMessage = "OK";
                    res.status(200).send();
                }
                if (content === "image/png") {
                    req.pipe(fs.createWriteStream(filepath + pngfile));
                    let insertPhoto = await petitionsModel.insertPho(pngfile, id);
                    res.statusMessage = "OK";
                    res.status(200).send();
                }
                if (content === "image/gif") {
                    req.pipe(fs.createWriteStream(filepath + giffile));
                    let insertPhoto = await petitionsModel.insertPho(giffile, id);
                    res.statusMessage = "OK";
                    res.status(200).send();
                } else {
                    res.statusMessage = "Bad Request";
                    res.status(400).send()
                }
            }
        } else if (!auth_made_pet) {
            res.statusMessage = "Unauthorized"
            res.status(400).send()
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};

exports.getPetPhoto = async function (req, res) {

    try {

        const id = req.params.id;
        let checkid = await petitionsModel.checkPETID(id)
        checkid = checkid.length > 0;
        if (!checkid) {
            res.statusMessage = "Not Found";
            res.status(404).send();
            return
        }
        let get_photo = await petitionsModel.getPPhoto(id);
        let photoName = get_photo[0]["photo_filename"]
        if (photoName === null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            let imageDets = await fs.readFile(filepath + photoName);
            let MimeType = await userModel.getMime(photoName);
            if (MimeType === null) {
                res.statusMessage = "Not Found";
                res.status(404).send();
            }
            res.statusMessage = "OK";
            res.status(200).contentType(MimeType).send(imageDets);
        }

    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send;
    }
};
