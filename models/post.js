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

const formatPostRow = async (row) => {
    return {
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
    }
}

const getPostsUser = async () => {
    try {
        const connection = await db.getConnection()
        const [rows] = await connection.execute(`
        SELECT p.*, u.*, p.id as pid, u.id as uid
        FROM posts p
        JOIN users u ON p.userId = u.id
      `)
        connection.release()
        
        const formattedPostsPromises = rows.map(formatPostRow)
        const formattedPosts = await Promise.all(formattedPostsPromises)
        return formattedPosts
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message)
    }
}


const getPostsById = async (postid) => {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.execute(`
        SELECT p.*, u.*, p.id as pid, u.id as uid
        FROM posts p
        JOIN users u ON p.userId = u.id
        WHERE p.id = ?
      `, [postid])
        connection.release()

        const formattedPostPromise = rows.map(formatPostRow)
        const formattedPosts = await Promise.all(formattedPostPromise)
        return formattedPosts
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message);
    }
}

const createPost = async(newPost) => {
    try {
        const connection = await db.getConnection()

        const query = `
          INSERT INTO posts (title, description, img, visible, userId, postDate)
          VALUES (?, ?, ?, ?, ?, ?)
        `

        const values = [
            newPost.title,
            newPost.description,
            newPost.img,
            newPost.visible,
            newPost.userId,
            newPost.postDate,
        ]

        const [result] = await connection.execute(query, values)
        connection.release()
        return { message: 'Post created successfully', postId: result.insertId }
    } catch(error) {
        throw new Error('Error creating post: ' + error.message)
    }
}


module.exports = {
    getPosts, getPostsUser, getPostsById, createPost,
}
