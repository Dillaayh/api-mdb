import db from '../models/db.js'; 
import { jwt } from '../models/jwt.js';

// Controller for Registration
export const registerUser = (req, res) => {
    const { name, username, password, is_dokter } = req.body;

    // Validate input
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'Nama, username, dan password harus diisi' });
    }

    // Call the stored procedure for registration
    db.query('CALL register(?, ?, ?, ?)', [name, username, password, is_dokter], (err, result) => {
        if (err) {
            console.log(err);
            const sqlErrorCode = err.sqlState;

            if (sqlErrorCode !== '00000') {
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            return res.status(400).json({ message: err.message });
        }

        return res.status(201).json({
            message: 'Register akun berhasil'
        });
    });
};

// Controller for Login
export const loginUser = (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    // Call the stored procedure for login
    db.query('CALL login(?, ?)', [username, password], (err, result) => {
        if (err) {
            console.log(err);
            const sqlErrorCode = err.sqlState;

            if (sqlErrorCode !== '00000') {
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            return res.status(400).json({ message: err.message });
        }

        const queryResult = result[0][0]; // Result from stored procedure

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: queryResult.idUser, // Include userId to decode later
                username: queryResult.username,
                role: queryResult.is_dokter ? 'Dokter' : 'User' // Role based on is_dokter
            },
            process.env.JWT_SECRET, // Access JWT_SECRET from environment variables
            { expiresIn: '1h' } // Set token expiration time (e.g., 1 hour)
        );

        return res.status(200).json({
            message: 'Login berhasil',
            token: token // Send the token as part of the response
        });
    });
};
