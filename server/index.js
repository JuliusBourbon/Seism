import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

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

const storage = multer.diskStorage({
    // Lokasi folder
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        // Format file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Endpoint Post Report
app.post('/api/reports', upload.single('image'), (req, res) => {
    const { user_id, user_name, title, type, description, lat, lon, location_name } = req.body;
    const upvotes = null;
    const downvotes = null;
    const status = null;
    const created_at = new Date();
    const updated_at = new Date();
    let image_url = null;

    if (req.file) {
        image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Query
    const sql = `INSERT INTO reports 
                 (user_id, user_name, title, type, description, lat, lon, location_name, image_url, upvotes, downvotes, status, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [user_id, user_name, title, type, description, lat, lon, location_name, image_url, upvotes, downvotes, status, created_at, updated_at];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Failed to create Report");
        }
        res.send("Report succesfully created");
    });
});

app.post('/api/auth/guest', (req, res) => {
    const { device_id } = req.body;

    if (!device_id) {
        return res.status(400).json({error: "Device Id not detected"})
    }

    const checkSql = 'Select * from users where user_identifier = ?';

    db.query(checkSql, [device_id], (err, results) => {
        if (err) return res.status(500).json({error: err.message});

        if (results.length > 0) {
            return res.json({
                message: "Device Id found",
                user: results[0]
            });
        } else {
            const insertSql = `insert into users (user_identifier, username, role)
                values (?, 'Anonymous', 'guest')`;
            
            db.query(insertSql, [device_id], (err, result) => {
                if (err) return res.status(500).json({error: err.message});

                const newUser = {
                    id: result.insertId,
                    user_identifier: device_id,
                    username: 'Anonymous',
                    role: 'guest'
                };

                return res.json({
                    message: "Device Id not found, Creating new User",
                    user: newUser
                })
            })
        }
    })
})

// Endpoint Get
app.get('/api/reports', (req, res) => {
    const sql = `SELECT 
            reports.*, 
            users.username AS reporter_name,
            users.user_identifier
            FROM reports 
            JOIN users ON reports.user_id = users.id
            ORDER BY reports.created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});