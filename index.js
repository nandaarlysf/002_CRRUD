import express from 'express'
import pg from 'pg'

const app = express()
const port = 3001
const { Pool } = pg

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Koneksi Database PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Mahasiswa',
    password: 'Nanda123',
    port: 5432,
})

// ==========================================
// 1. GET - Ambil semua data biodata
// ==========================================
app.get('/api/biodata', async (req, res) => {
    try {
        console.log('TEST DATA :');
        const testData = await pool.query('SELECT * FROM biodata');
        console.log(testData.rows);
        res.status(200).json({ success: true, data: testData.rows });
    } catch (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});
