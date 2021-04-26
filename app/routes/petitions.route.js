
const petition = require('../controllers/petitions.controller');

module.exports = function (app) {

    app.route(app.rootUrl + '/petitions')
        .get(petition.getPetParam)
        .post(petition.addPet)


    app.route(app.rootUrl + '/petitions/categories')
        .get(petition.Category);

    app.route(app.rootUrl + '/petitions/:id')
        .get(petition.Pet_with_id);

    app.route(app.rootUrl + '/petitions/:id')
        .delete(petition.deletePetition);

    app.route(app.rootUrl + '/petitions/:id/signatures')
        .post(petition.addSign)
        .get(petition.getSign);

    app.route(app.rootUrl + '/petitions/:id/signatures')
       .delete(petition.delSign);


    app.route(app.rootUrl + '/petitions/:id')
        .patch(petition.patchPet);


    app.route(app.rootUrl + '/petitions/:id/photo')
        .put(petition.putPhoto)
        .get(petition.getPetPhoto);


};




