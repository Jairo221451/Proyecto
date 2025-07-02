const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        req.user = decoded;
        next();
    });
};

// Middleware solo para administradores
const esAdmin = (req, res, next) => {
    if (!req.user?.esAdmin) {
        return res.status(403).json({ error: 'Acceso restringido a administradores' });
    }
    next();
};

module.exports = { verificarToken, esAdmin };