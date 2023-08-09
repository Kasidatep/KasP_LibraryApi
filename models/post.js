const db = require('../config/db');
const convertDate = require('../plugin/convertDate')

const getPosts = async () => {
    try {
        const connection = await db.getConnection();

        const [rows, fields] = await connection.execute('SELECT * FROM posts');

        connection.release();

        return rows;
    } catch (error) {
        throw new Error('Error fetching posts')
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
        const connection = await db.getConnection()
        const [rows] = await connection.execute(`
        SELECT p.*, u.*, p.id as pid, u.id as uid
        FROM posts p
        JOIN users u ON p.userId = u.id
        WHERE p.id LIKE ?
      `, [postid])
        connection.release()

        const formattedPostPromise = rows.map(formatPostRow)
        const formattedPosts = await Promise.all(formattedPostPromise)
        return formattedPosts
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message)
    }
}

const createPost = async (newPost) => {
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
            convertDate.convertToMySQLDatetime(newPost.postDate),
        ]
        const [result] = await connection.query(query, values)
        connection.release()

        if (result.affectedRows === 1) {
            return { message: 'Post created successfully', postId: result.insertId }
        } else {
            throw new Error('Failed to create post');
        }
    } catch (error) {
        return { message: 'Error creating post', error: error.message }
    }
}

const updatePost = async (updatedPost, id) => {
    try {
        const connection = await db.getConnection();

        const query = `
            UPDATE posts
            SET title = ?, description = ?, img = ?, visible = ?, userId = ?, postDate = ?
            WHERE id = ?
        `

        const values = [
            updatedPost.title,
            updatedPost.description,
            updatedPost.img,
            updatedPost.visible,
            updatedPost.userId,
            convertDate.convertToMySQLDatetime(updatedPost.postDate),
            id
        ]

        const result = await connection.query(query, values)
        connection.release()

        if (result.affectedRows === 0) {
            return { message: 'No matching post found for update', postId: id }
        }

        return { message: 'Post updated successfully', postId: id }
    } catch (error) {
        console.error(error)
        return { message: 'Post could not be updated.', error: error.message }
    }
}


const deletePostsById = async (postId) => {
    try {
        const connection = await db.getConnection()

        const query = `
            DELETE FROM posts
            WHERE id = ?
        `

        const [result] = await connection.execute(query, [postId])
        connection.release();

        if (result.affectedRows === 0) {
            return { message: 'No matching post found for deletion', postId }
        }

        return { message: 'Post deleted successfully', postId }
    } catch (error) {
        throw new Error('Error deleting post: ' + error.message)
    }
}


module.exports = {
    getPosts, getPostsUser, getPostsById, createPost, updatePost, deletePostsById,
}
