const db = require('../../config/db');


exports.getCatDetails = async function (id) {
    console.log("lets get it all");
    const conn = await db.getPool().getConnection();
    const query = 'select name from Category where category_id = ?';
    const [rows] = await conn.query(query, [ id ]  );
    conn.release();
    return rows;

};
