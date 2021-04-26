const user = require('../controllers/user.controller');



module.exports = function (app) {

    app.route(app.rootUrl + '/users/register')
        .post(user.register)

    app.route(app.rootUrl + '/users/login')
        .post(user.loginToken)

    app.route(app.rootUrl + '/users/:id')
        .get(user.getInfo)

    app.route(app.rootUrl + '/users/logout')
        .post(user.logoutToken)

    app.route(app.rootUrl + '/users/:id')
        .patch(user.patchInfo)

    app.route(app.rootUrl + '/users/:id/photo')
        .put(user.userPhoto)
        .delete(user.photoDel)
        .get(user.getPhoto)



};









