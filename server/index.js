import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

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

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/reports', upload.single('image'), (req, res) => {
    const { 
        user_id, user_name, title, type, description, 
        lat, lon, location_name, user_device_lat, user_device_lon 
    } = req.body;

    if (!user_id || user_id === 'null' || user_id === 'undefined') {
        return res.status(401).json({ error: "Anda wajib login untuk membuat laporan." });
    }

    if (!lat || !lon || !user_device_lat || !user_device_lon) {
        return res.status(400).json({ error: "Data lokasi tidak lengkap." });
    }

    const distance = calculateDistance(
        parseFloat(user_device_lat), parseFloat(user_device_lon),
        parseFloat(lat), parseFloat(lon)
    );

    if (distance > 5.0) {
        return res.status(403).json({ error: `Lokasi terlalu jauh (${distance.toFixed(1)} km). Maksimal 5 km.` });
    }

    const limitMinutes = 2; 

    const checkSql = "SELECT created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
    
    db.query(checkSql, [user_id], (err, results) => {
        if (err) {
            console.error("History Check Error:", err);
            return res.status(500).json({ error: "Gagal mengecek history" });
        }

        if (results.length > 0) {
            const lastReportTime = new Date(results[0].created_at);
            const now = new Date();
            const diffMs = now - lastReportTime;
            const diffMinutes = Math.floor(diffMs / 60000);

            if (diffMinutes < limitMinutes) {
                const sisaWaktu = limitMinutes - diffMinutes;
                return res.status(429).json({ 
                    error: `Terlalu cepat! Kamu harus menunggu ${sisaWaktu} menit lagi sebelum melapor kembali.` 
                });
            }
        }

        let finalImageUrl = null;
        if (req.file) {
            finalImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const insertSql = `
            INSERT INTO reports (user_id, user_name, title, type, description, lat, lon, location_name, image_url, upvotes, downvotes, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'pending', NOW(), NOW())
        `;
        
        const values = [
            user_id, 
            user_name,
            title,
            type,
            description,
            lat,
            lon,
            location_name,
            finalImageUrl
        ];

        db.query(insertSql, values, (err, result) => {
            if (err) {
                console.error("Insert Error:", err);
                return res.status(500).json({ error: "Gagal menyimpan laporan." });
            }

            res.status(201).json({
                message: "Laporan berhasil dikirim!",
                data: {
                    id: result.insertId,
                    status: 'pending',
                    type: type
                }
            });
        });
    });
});

app.get('/api/reports/:id/vote-status', (req, res) => {
    const reportId = req.params.id;
    const userId = req.query.user_id;

    if (!userId) return res.json({ voted: null });

    const sql = "SELECT vote_type FROM votes_detail WHERE report_id = ? AND user_id = ?";
    db.query(sql, [reportId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        
        if (results.length > 0) {
            res.json({ voted: results[0].vote_type });
        } else {
            res.json({ voted: null });
        }
    });
});

app.post('/api/reports/:id/vote', (req, res) => {
    const reportId = req.params.id;
    const { user_id, type } = req.body;

    if (!user_id) return res.status(401).json({ error: "User wajib login untuk melakukan voting." });

    db.query("SELECT status FROM reports WHERE id = ?", [reportId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });
        
        const currentStatus = results[0].status;
        
        if (currentStatus !== 'pending') {
            return res.status(400).json({ 
                error: `Voting ditutup. Status laporan sudah final: ${currentStatus}.` 
            });
        }
        
        const checkSql = "SELECT * FROM votes_detail WHERE report_id = ? AND user_id = ?";
        db.query(checkSql, [reportId, user_id], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
    
            let detailQuery = "";
            let detailParams = [];
            
            let upChange = 0;
            let downChange = 0;
    
            if (results.length === 0) {
                detailQuery = "INSERT INTO votes_detail (report_id, user_id, vote_type) VALUES (?, ?, ?)";
                detailParams = [reportId, user_id, type];
                
                if (type === 'up') upChange = 1;
                else downChange = 1;
    
            } else {
                const currentVote = results[0].vote_type;
    
                if (currentVote === type) {
                    detailQuery = "DELETE FROM votes_detail WHERE report_id = ? AND user_id = ?";
                    detailParams = [reportId, user_id];
    
                    if (type === 'up') upChange = -1;
                    else downChange = -1;
    
                } else {
                    detailQuery = "UPDATE votes_detail SET vote_type = ? WHERE report_id = ? AND user_id = ?";
                    detailParams = [type, reportId, user_id];
    
                    if (type === 'up') {
                        upChange = 1; 
                        downChange = -1; 
                    } else {
                        upChange = -1; 
                        downChange = 1;
                    }
                }
            }
    
            db.query(detailQuery, detailParams, (err) => {
                if (err) return res.status(500).json({ error: "Gagal update history vote" });
    
                const updateCountSql = `
                    UPDATE reports 
                    SET 
                        upvotes = GREATEST(0, upvotes + ?), 
                        downvotes = GREATEST(0, downvotes + ?)
                    WHERE id = ?
                `;
    
                db.query(updateCountSql, [upChange, downChange, reportId], (err) => {
                    if (err) return res.status(500).json({ error: "Gagal update angka vote" });
    
                    db.query("SELECT upvotes, downvotes FROM reports WHERE id = ?", [reportId], (err, reportData) => {
                        if (err || reportData.length === 0) return res.status(500).json({ error: "Gagal mengambil data report" });
    
                        const up = reportData[0].upvotes;
                        const down = reportData[0].downvotes;
    
                        let newStatus = 'pending';
    
                        if ((up - down) <= -10) {
                            newStatus = 'invalid';
                        }
                        else if ((up + down) > 10 && up >= (2 * down)) {
                            newStatus = 'valid';
                        }
    
                        db.query(
                            "UPDATE reports SET status = ?, updated_at = NOW() WHERE id = ?", 
                            [newStatus, reportId], 
                            (err) => {
                                if (err) return res.status(500).json({ error: "Gagal update status" });
    
                                res.json({ 
                                    message: "Vote sukses", 
                                    new_counts: { upvotes: up, downvotes: down },
                                    new_status: newStatus 
                                });
                            }
                        );
                    });
                });
            });
        });
    });
});

app.get('/api/reports', (req, res) => {
    const sql = `
        SELECT r.*, u.role AS reporter_role 
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE 
            (r.status = 'pending' AND r.created_at > NOW() - INTERVAL 48 HOUR)
            OR 
            (r.status = 'valid' AND r.updated_at > NOW() - INTERVAL 168 HOUR)
            OR
            (r.status = 'resolved' AND r.updated_at > NOW() - INTERVAL 24 HOUR)
            OR
            (r.status = 'invalid' AND r.updated_at > NOW() - INTERVAL 12 HOUR)
        ORDER BY r.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        
        res.json(results);
    });
});

app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Semua kolom wajib diisi!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'verified')`;

        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Username atau Email sudah terdaftar!" });
                }
                return res.status(500).json({ error: err.message });
            }

            res.json({ 
                message: "Registrasi berhasil! Silakan login.", 
                user: { id: result.insertId, username, email, role: 'verified' } 
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan server saat enkripsi password." });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username dan Password wajib diisi!" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Username tidak ditemukan" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Password salah!" });
        }

        res.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    });
});

app.delete('/api/reports/:id', (req, res) => {
    const reportId = req.params.id;
    const { user_id } = req.body; 

    if (!user_id) return res.status(401).json({ error: "Unauthorized" });

    const checkSql = "SELECT * FROM reports WHERE id = ?";
    db.query(checkSql, [reportId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });

        const report = results[0];

        if (report.user_id != user_id) {
            return res.status(403).json({ error: "Anda tidak berhak menghapus laporan ini." });
        }

        if (report.status !== 'pending') {
            return res.status(400).json({ error: "Laporan yang sudah Valid/Invalid tidak bisa dihapus." });
        }
        if ((report.upvotes + report.downvotes) > 5) {
            return res.status(400).json({ error: "Laporan sudah ramai ditanggapi, tidak dapat dihapus." });
        }

        db.query("DELETE FROM votes_detail WHERE report_id = ?", [reportId], (err) => {
            db.query("DELETE FROM reports WHERE id = ?", [reportId], (err) => {
                if (err) return res.status(500).json({ error: "Gagal menghapus laporan" });
                res.json({ message: "Laporan berhasil dihapus" });
            });
        });
    });
});

app.put('/api/reports/:id/resolve', (req, res) => {
    const reportId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) return res.status(401).json({ error: "Unauthorized" });

    const checkSql = "SELECT * FROM reports WHERE id = ?";
    db.query(checkSql, [reportId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });

        const report = results[0];

        if (report.user_id != user_id) {
            return res.status(403).json({ error: "Bukan milik Anda." });
        }

        const updateSql = "UPDATE reports SET status = 'resolved', updated_at = NOW() WHERE id = ?";
        db.query(updateSql, [reportId], (err) => {
            if (err) return res.status(500).json({ error: "Gagal update status" });
            
            res.json({ 
                message: "Status berhasil diubah menjadi Resolved", 
                new_status: 'resolved' 
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});