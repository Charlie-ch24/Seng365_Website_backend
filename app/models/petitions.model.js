const db = require('../../config/db');



// checks Catergory is valid and returns the catergory if it is
exports.checkIDisthere = async function (id) {
    console.log(id)
    console.log('Request to check if id  jez is in the database...');
    const conn = await db.getPool().getConnection();
    const query = 'select * from Category where category_id = ?';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows;
};



// neeeds some work query to add pet into data base
exports.insertPet = async function (pet, a_id, date) {

    console.log( `Request to insert pet into the database...` );
    const values = [pet.title, pet.description, a_id, pet.categoryId, date, pet.closingDate];
    const conn = await db.getPool().getConnection();
    const query = `insert into Petition (title, description, author_id, category_id, created_date, closing_date) values ( ?, ?, ?, ?, ?, ?)`; // needs to add created date too
    const [ result ] = await conn.query( query, values );
    conn.release();
    return result;


};


exports.insertPetNo = async function (pet, a_id, date) {

    const values = [pet.title, pet.description, a_id, pet.categoryId, date, pet.closingDate];
    const conn = await db.getPool().getConnection();
    const query = `insert into Petition (title, description, author_id, category_id, created_date) values ( ?, ?, ?, ?, ?)`; // needs to add created date too
    const [ result ] = await conn.query( query, values );
    conn.release();
    return result;


};

exports.getCat = async function () {
    const conn = await db.getPool().getConnection();
    const query = 'select category_id as categoryId, name from Category';
    const [results] = await conn.query(query );
    conn.release();
    return results;

};


exports.getSignatures = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select Signature.signatory_id as signatoryId, User.name, User.city, User.country, Signature.signed_date from Signature JOIN User on User.user_id = Signature.signatory_id where petition_id = ? ORDER BY Signature.signed_date';
    const [results] = await conn.query(query, [id] );
    conn.release();
    return results;

};



exports.checkPETID = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Petition where petition_id = ?';
    const [rows] = await conn.query(query,  id );
    conn.release();
    return rows;
};


exports.takeInfoOnPet = async function (id) {
    console.log("lets get it all");
    const conn = await db.getPool().getConnection();
    const query = 'select petition_id, title, description, author_id, category_id, created_date, closing_date from Petition p where petition_id = ? ';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows;

};


exports.takePet = async function (id) {
    console.log("lets get it all");
    const conn = await db.getPool().getConnection();
    const query = 'SELECT ' +
        'p.petition_id as petitionId, p.title as title, c.name as category, u.name as authorName,' +
        'count(*) as signatureCount, p.description as description, p.author_id as authorId, u.city as authorCity, u.country as authorCountry, p.created_date as createdDate, '+
        'p.closing_date as closingDate ' +
        'from Petition p ' +
            'left join User u ' +
                'On p.author_id = u.user_id ' +
            'left join Category c ' +
                'on p.category_id = c.category_id '+
            'left join Signature s ' +
                'on p.petition_id = s.petition_id ' +
        'where p.petition_id = ?';

    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows;

};


/*returns true if auther made this */
exports.checkpetandid = async function (id, a_id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Petition where petition_id = ? and author_id = ?';
    const [rows] = await conn.query(query, [ id, a_id ]  );
    conn.release();
    return rows.length > 0;

};

exports.deletePetition = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'DELETE from Petition where petition_id = ?';
    const [rows] = await conn.query(query, [ id ]  )
    conn.release();
    return rows



};

exports.alreadySigned = async function (id, a_id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Signature where petition_id = ? and signatory_id = ?';
    const [rows] = await conn.query(query, [ id, a_id ]  );
    conn.release();
    return rows.length > 0;



};

exports.signing_time = async  function (a_id, id, date) {

    const conn = await db.getPool().getConnection();
    const values = [id, a_id, date];
    const query = 'insert into Signature (signatory_id, petition_id, signed_date) values (?, ?, ?)';
    const [rows] = await conn.query(query, [ a_id, id, date ]  );
    conn.release();
    return rows.length > 0;

};

exports.did_this_person_make_the_petition = async function (id, a_id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Petition where petition_id = ? and author_id = ?';
    const [rows] = await conn.query(query, [ id, a_id ]  );
    conn.release();
    return rows.length > 0;

};

exports.id_ont_pet = async function (a_id, id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Signature where signatory_id = ? and petition_id = ?';
    const [rows] = await conn.query(query, [ a_id, id ]  );
    console.log(rows)
    conn.release();
    return rows.length > 0;

};

exports.removeSign = async function (id, a_id) {
    console.log(id, a_id)
    const conn = await db.getPool().getConnection();
    const query = 'DELETE from Signature where petition_id = ? and signatory_id = ?';
    const [rows] = await conn.query(query, [ id, a_id ]  );
    conn.release();
    return rows.length > 0;


};

exports.notfoundcase = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Petition where petition_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    console.log("hi")
    return rows.length > 0;


};

exports.checkCat = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Category where category_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows.length > 0;


}

exports.patchTit = async function (title, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE Petition SET title = ? where petition_id = ? '
    const [result] = await  conn.query(query, [ title, id ]);
    conn.release();
    return result.length > 0;
};
exports.patchDes = async function (des, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE Petition SET description = ? where petition_id = ? ';
    const [result] = await  conn.query(query, [ des, id ]);
    conn.release();
    return result.length > 0;
};
exports.patchCat = async function (cat, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE Petition SET category_id = ? where petition_id = ? ';
    const [result] = await  conn.query(query, [ cat, id ]);
    conn.release();
    return result.length > 0;
};
exports.patchCD = async function (cD, id) {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE Petition SET closing_date = ? where petition_id = ? ';
    const [result] = await  conn.query(query, [ cD, id ]);
    conn.release();
    return result.length > 0;
};

exports.GetPetP = async function () {
    const conn = await db.getPool().getConnection();
    const query = 'select p.petition_id as petitionId, p.title title, c.name as category,u.name authorName, count(*) as signatureCount from Signature s ' +
        'LEFT JOIN Petition p on s.petition_id = p.petition_id LEFT JOIN User u On p.author_id = u.user_id LEFT JOIN Category c On p.category_id = c.category_id  ' +
        'where 1 = 1 group by s.petition_id';
    const [rows] = await conn.query(query );
    conn.release();
    return rows;


};

exports.checkPhoto = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from Petition where petition_id = ? and photo_filename is not NULL';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows.length > 0;

};

exports.insertPho = async function (photo, id) {
    const conn = await db.getPool().getConnection();
    const query = 'update Petition set photo_filename = ? where petition_id = ? ';
    const [rows] = await conn.query(query, [ photo, id ]  );
    conn.release();
    return rows.length > 0;

};

exports.getPPhoto = async function (id) {
    const conn = await db.getPool().getConnection();
    const query = 'select photo_filename from Petition where petition_id = ?';
    const [rows] = await conn.query(query, [ id ]);
    conn.release();
    return rows;

};

exports.deleteSignatures = async function (id) {

    const conn = await db.getPool().getConnection();
    console.log(id)
    const query = 'Delete from Signature where petition_id = ?';
    const [rows] = await conn.query(query, id );
    conn.release();
    console.log("smell")
    return rows;


};

exports.getAllPetitions = async function (sI, count, sort_By, cat_Id, auth_Id, q) {


    const conn = await db.getPool().getConnection();
    let scores = [];


    let query = 'select p.petition_id as petitionId, title, c.name as category, u.name as authorName, ' +
        '(select count(s.signatory_id) from Signature s where s.petition_id = p.petition_id) as signatureCount ' +
        'from Petition p ' +
        'join Category c on p.category_id = c.category_id ' +
        'join User u on u.user_id = p.author_id ' +
        'join Signature s on s.signatory_id = u.user_id ' +
        'where true ';

    if (typeof cat_Id !== 'undefined') {
        query += 'and c.category_id = ? ';
        scores.push(cat_Id);
    }

    if (typeof auth_Id !== 'undefined') {
        query += 'and p.author_id = ? ';
        scores.push(auth_Id);
    }

    if (typeof q !== 'undefined') {
        query += 'and title like ? ';
        scores.push("%" + q + "%");
    }

    query += 'group by p.petition_id ';

    //SortBy options
    switch (sort_By) {

        case 'ALPHABETICAL_ASC':
            query += 'order by title asc ';
            break;
        case 'SIGNATURES_DESC':
            query += 'order by signatureCount desc ';
            break;
        case 'ALPHABETICAL_DESC':
            query += 'order by title desc ';
            break;
        case 'SIGNATURES_ASC':
            query += 'order by signatureCount asc ';
            break;

        default:
            query += 'order by signatureCount desc ';
            break;
    }

    if (typeof sI === 'undefined') sI = 0;
    if (typeof count === 'undefined') count = 123456789012345678;

    query += 'limit ?, ? ;';
    scores.push(parseInt(sI));
    scores.push(parseInt(count));
    const [result] = await conn.query(query, scores);
    conn.release();
    return result;
};