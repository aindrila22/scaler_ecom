const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("No Authorization header present");
        return res.sendStatus(401); // No Authorization header
    }

    const token = authHeader.split(' ')[1]; // Extract Bearer token
    if (!token) {
        console.log("No token found in Authorization header");
        return res.sendStatus(401); // No token
    }

    //console.log("Received token:", token);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.sendStatus(403); // Token invalid
        }

        //console.log("User from token:", user);
        req.user = user; // Attach user info to request
        next();
    });
};

module.exports = authenticateToken; // Export the middleware