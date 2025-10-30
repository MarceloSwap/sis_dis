import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            
            // Verificar se usuário já existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }
            
            // Criptografar senha
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const user = new User({
                name,
                email,
                password: hashedPassword
            });
            
            await user.save();
            
            // Remover senha da resposta
            const userResponse = user.toObject();
            delete userResponse.password;
            
            res.status(201).json(userResponse);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async auth(req, res) {
        try {
            const { email, password } = req.body;
            
            // Buscar usuário
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            
            // Verificar senha
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            
            // Gerar token JWT
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '7d' }
            );
            
            // Remover senha da resposta
            const userResponse = user.toObject();
            delete userResponse.password;
            
            res.json({
                user: userResponse,
                token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new UserController();