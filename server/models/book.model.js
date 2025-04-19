// server/models/book.model.js
const db = require('../config/database');

exports.create = async (bookData) => {
  const { title, category, price, description, cover_image, seller_id } = bookData;
  
  const query = `
    INSERT INTO books (title, category, price, description, cover_image, seller_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, title, category, price, description, cover_image, upload_date
  `;
  
  try {
    const result = await db.query(query, [title, category, price, description, cover_image, seller_id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.findAll = async () => {
  const query = `
    SELECT b.*, u.username as seller_name 
    FROM books b
    JOIN users u ON b.seller_id = u.id
    ORDER BY b.upload_date DESC
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.findByUserId = async (userId) => {
  const query = `
    SELECT b.*, u.username as seller_name
    FROM books b
    JOIN users u ON b.seller_id = u.id
    WHERE b.seller_id = $1
    ORDER BY b.upload_date DESC
  `;
  
  try {
    const result = await db.query(query, [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};