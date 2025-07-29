import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Asigură-te că ai importat corect modelul User

// Funcția de înregistrare a unui utilizator
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Emailul este deja folosit.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Utilizator înregistrat cu succes', userId: newUser.id });
  } catch (error) {
    console.error('Eroare la înregistrare:', error);
    res.status(500).json({ error: 'Eroare internă la înregistrare.' });
  }
};

// Funcția de autentificare a unui utilizator
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email și parolă sunt obligatorii.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Email sau parolă incorectă.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email sau parolă incorectă.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7h' });

    res.status(200).json({
      message: 'Autentificare reușită',
      token,
    });
  } catch (error) {
    console.error('Eroare la autentificare:', error);
    res.status(500).json({ error: 'Eroare internă la autentificare.' });
  }
};

export { registerUser, loginUser };
