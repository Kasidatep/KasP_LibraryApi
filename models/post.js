const db = require('../config/db');

const getPosts = async () => {
    try {
        const connection = await db.getConnection();

        const [rows, fields] = await connection.execute('SELECT * FROM posts');

        connection.release();

        return rows;
    } catch (error) {
        throw new Error('Error fetching posts');
    }
}

const getPostsUser = async () => {

    try {
        const connection = await db.getConnection();
        const [rows, fields] = await connection.execute(`
          SELECT p.*, u.*, p.id as pid, u.id as uid
          FROM posts p
          JOIN users u ON p.userId = u.id
        `);
        connection.release();

        const formattedPosts = rows.map((row) => ({
            id: row.pid,
            title: row.title,
            description: row.description,
            img: row.img,
            visible: row.visible,
            postDate: row.postDate,
            userId: row.userId,
            user: {
              id: row.uid,
              username: row.username,
              name: row.name,
              email: row.email,
              phone: row.phone,
              type: row.type,
              password: row.password,
              image: row.image,
            },
          }));

        return formattedPosts;
      } catch (error) {
        throw new Error('Error fetching posts');
      }
    
    
}




module.exports = {
    getPosts, getPostsUser,
};