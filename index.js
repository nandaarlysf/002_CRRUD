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

// ==========================================
// 2. POST - Tambah data biodata baru
// ==========================================
app.post('/api/biodata', async (req, res) => {
    // Sesuaikan nama, nim, dll dengan nama kolom di tabel biodata Anda
    const { nama, jurusan } = req.body; 
    
    try {
        const result = await pool.query(
            'INSERT INTO biodata (nama, jurusan) VALUES ($1, $2) RETURNING *',
            [nama, jurusan]
        );
        res.status(201).json({
            success: true,
            message: 'Biodata berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. PUT - Update data biodata
// ==========================================
app.put('/api/biodata/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, jurusan } = req.body; // Sesuaikan dengan kolom Anda

    try {
        const result = await pool.query(
            'UPDATE biodata SET nama = $1, jurusan = $2 WHERE id = $3',
            [nama, jurusan, id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Biodata berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 4. DELETE - Hapus data biodata
// ==========================================
app.delete('/api/biodata/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM biodata WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Biodata berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Jalankan Server
app.listen(port, () => {
    console.log(`CIHUY BERJALAN on port ${port}.`);
});