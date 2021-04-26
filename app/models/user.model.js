const db = require('../../config/db');

exports.checkEmailExist = async function (email) {
    console.log('Request to check if email is in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where email = ?';
    const [rows] = await conn.query(query, [ email ]);
    conn.release();
    return rows.length > 0;
};

exports.checkLogin = async function (email, password) {
    console.log('Request to check if email is in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where email = ? and password = ?';
    const [rows] = await conn.query(query, [ email, password ]);
    conn.release();
    return rows.length > 0;
};

exports.x_tok_there = async function (x_tok) {
    const conn = await db.getPool().getConnection();
    const query = 'select user_id from User where auth_token = ?'
    const [rows] = await conn.query(query, [ x_tok ]);
    conn.release();
    return rows;

};



exports.insertUser = async function (user) {
    console.log( `Request to insert ${user} into the database...` );
    const conn = await db.getPool().getConnection();
    let countryAndCityCol = "";
    let countryAndCityVal = "";


    const values = [user.name, user.password, user.email];
    if ( user.hasOwnProperty("country")  ) {
        values.push(user.country);
        countryAndCityCol += ", country" ;
        countryAndCityVal += ", ?";
    }
    if ( user.hasOwnProperty("city") ) {
        values.push(user.city);
        countryAndCityCol += ", city";
        countryAndCityVal += ", ?";

    }
    const query = `insert into User (name, password, email${countryAndCityCol}) values ( ?, ?, ?${countryAndCityVal} )`;
    const [ result ] = await conn.query( query, values );
    conn.release();
    return result;
};



exports.insertAuth = async function (auth_token, user_id) {

    console.log("Request to Insert auth");
    const conn = await db.getPool().getConnection();
    const query = `update User set auth_token = ? where user_id = ? `;
    const [rows] = await conn.query(query, [auth_token, user_id]  );
    conn.release();
    return rows.length > 0;


};

exports.removeAuth = async function (auth_token) {
    console.log("Time to log out!");
    const conn = await db.getPool().getConnection();
    const query = `update User set auth_token = NULL where auth_token = ?`;
    const [rows] = await conn.query(query, [auth_token]  );
    conn.release();
    return rows.length > 0;

};






exports.checkEmailAndPassword = async function ( email, password ) {

    console.log('Request to check if email and password is in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select user_id from User where email = ? and password = ?';
    const [rows] = await conn.query(query, [ email, password ]);
    conn.release();
    return rows


};




exports.checkIDisthere = async function (id) {
    console.log('Request to check if id is in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where user_id = ?';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows;
};

exports.takeInfo = async function (id) {
    console.log("lets get it all");
    const conn = await db.getPool().getConnection();
    const query = 'select name, email, country, city from User where user_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows;

};

exports.takeInfos = async function (id) {
    console.log("lets get it all");
    const conn = await db.getPool().getConnection();
    const query = 'select name, country, city from User where user_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows;

};



// uses id token to return auth
exports.getAuthToke = async function (id) {
    console.log('Request to check if auth token matches in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select auth_token from User where user_id = ?';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows;
};
// uses auth token to return id
exports.getIdwithAuth = async function (auth){

    const conn = await db.getPool().getConnection();
    const query = 'select user_id from User where auth_token = ?';
    const [rows] = await conn.query(query, [ auth ]);
    conn.release();
    return rows;

}
exports.getIwithAuth = async function (auth){

    const conn = await db.getPool().getConnection();
    const query = 'select user_id from User where auth_token = ?';
    const [rows] = await conn.query(query, [ auth ]);
    conn.release();
    return rows.length > 0;

}


exports.checkAuthToke = async function (id, auth_toke_value) {
    console.log('Request to check if auth token matches in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where user_id = ? and auth_token = ?';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows;
};


//for petetions get id
exports.getDetails = async function (id) {
    console.log("lets get it all");
    const conn = await db.getPool().getConnection();
    const query = 'select name, country, city from User where user_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows;

};



exports.checkPassword = async function (id, password) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where user_id = ? and password = ?';
    const [rows] = await conn.query(query, [ id, password ]  );
    conn.release();
    return rows.length > 0;


};
exports.patchCountry = async function (country, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE User SET country = ? where user_id = ? ';
    const [result] = await  conn.query(query, [ country, id ]);
    conn.release();
    return result.length > 0;
};

exports.patchCity = async function (city, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE User SET city = ? where user_id = ? ';
    const [result] = await  conn.query(query, [ city, id ]);
    conn.release();
    return result.length > 0;
};

exports.patchPass = async function (pass, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE User SET password = ? where user_id = ? ';
    const [result] = await  conn.query(query, [ pass, id ]);
    conn.release();
    return result.length > 0;
};

exports.patchName = async function (name, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE User SET name = ? where user_id = ? ';
    const [result] = await  conn.query(query, [ name, id ]);
    conn.release();
    return result.length > 0;
};

exports.patchEmail = async function (email, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE User SET email = ? where user_id = ? ';
    const [result] = await  conn.query(query, [ email, id ]);
    conn.release();
    return result.length > 0;
};

exports.checkPhoto = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where user_id = ? and photo_filename is not NULL';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows.length > 0;

};

exports.insertUserPho = async function (photo, id) {
    const conn = await db.getPool().getConnection();
    const query = 'update User set photo_filename = ? where user_id = ? ';
    const [rows] = await conn.query(query, [ photo, id ]  );
    conn.release();
    return rows.length > 0;

};

exports.getPhoto = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select photo_filename from User where user_id = ?';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows;

};

exports.delPhoto = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'Update User set photo_filename = NULL where user_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows.length > 0;


};

exports.getMime = async function (file) {
    const mimetype = file.split('.').pop()

    if (mimetype === 'gif') {
        return 'image/gif'
    } else if (mimetype === 'png') {
        return 'image/png'
    } else if (mimetype === 'jpeg' || mimetype === 'jpg' ) {
        return 'image/jpeg'
    } else {
        return null;

    }

};

exports.checkphodb = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from User where user_id = ? and photo_filename is not null';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows.length > 0;

};