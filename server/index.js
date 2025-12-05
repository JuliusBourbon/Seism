import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});


// Endpoint
app.post('/api/reports', (req, res) => {
    const { user_id, user_name, title, type, description, lat, lon, location_name, image_url, upvotes, downvotes, status, created_at, updated_at, resolved_at } = req.body;

    // Query SQL Standard
    const sql = `INSERT INTO reports 
                 (user_id, user_name, title, type, description, lat, lon, location_name, image_url, upvotes, downvotes, status, created_at, updated_at, resolved_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [user_id, user_name, title, type, description, lat, lon, location_name, image_url, upvotes, downvotes, status, created_at, updated_at, resolved_at];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Failed to create Report");
        }
        res.send("Report succesfully created");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});