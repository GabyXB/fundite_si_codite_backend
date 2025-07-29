import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Valideaza o parola (minim 8 caractere, o litera mare, o cifra)
 */
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

/**
 * Înregistreaza un utilizator nou
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ 
            error: 'Parola trebuie sa aiba cel pu?in 8 caractere, o litera mare ?i o cifra.' 
        });
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
            had_appointment: 0,
        });

        res.status(201).json({ message: 'Utilizator înregistrat cu succes', userId: newUser.id, had_appointment: newUser.had_appointment });
    } catch (error) {
        console.error('Eroare la înregistrare:', error);
        res.status(500).json({ error: 'Eroare interna la înregistrare.' });
    }
};

/**
 * Autentifica un utilizator
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email ?i parola sunt obligatorii.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Email sau parola incorecta.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email sau parola incorecta.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Autentificare reu?ita',
            token,
            userId: user.id,
            name: user.name,
            had_appointment: user.had_appointment,
        });
    } catch (error) {
        console.error('Eroare la autentificare:', error);
        res.status(500).json({ error: 'Eroare interna la autentificare.' });
    }
};

export { registerUser, loginUser };

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, currentPassword, newPassword, image } = req.body;

    if (req.user.id.toString() !== id) {
        return res.status(403).json({ message: 'Nu ai permisiunea de a modifica acest utilizator.' });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
        }

        // Verificam daca se încearca modificarea email-ului sau parolei
        if ((email && email !== user.email) || newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Pentru a modifica email-ul sau parola, trebuie sa introduce?i parola curenta.' });
            }

            // Verificam parola curenta
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Parola curenta este incorecta.' });
            }
        }

        // Verificam daca noul email nu este deja folosit
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Acest email este deja folosit.' });
            }
        }

        // Pregatim datele pentru actualizare
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (newPassword) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(newPassword, saltRounds);
        }
        if (image) updateData.image = image;

        // Actualizam utilizatorul
        await user.update(updateData);

        // Returnam datele actualizate (fara parola)
        const updatedUser = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'image']
        });

        return res.status(200).json({
            message: 'Utilizatorul a fost actualizat cu succes!',
            user: updatedUser
        });
    } catch (error) {
        console.error('Eroare la actualizarea utilizatorului:', error);
        res.status(500).json({ message: 'A aparut o eroare la actualizarea utilizatorului.' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    // Verifica daca ID-ul utilizatorului din token coincide cu ID-ul din URL
    if (req.user.id.toString() !== id) {
        return res.status(403).json({ message: 'Nu ai permisiunea de a modifica acest utilizator.' });
    }

    try {
        // Gasim utilizatorul ?i verificam parola
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
        }

        // Verificam parola
        if (!password) {
            return res.status(400).json({ message: 'Trebuie sa introduce?i parola pentru a ?terge contul.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Parola este incorecta.' });
        }

        // ?tergem utilizatorul
        await user.destroy();

        return res.status(200).json({ message: 'Utilizatorul a fost ?ters cu succes!' });
    } catch (error) {
        console.error('Eroare la ?tergerea utilizatorului:', error);
        res.status(500).json({ message: 'A aparut o eroare la ?tergerea utilizatorului.' });
    }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'image', 'had_appointment']
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Eroare la preluarea utilizatorului:', error);
    res.status(500).json({ message: 'A aparut o eroare la preluarea utilizatorului.' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'image', 'had_appointment']
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Eroare la preluarea utilizatorului:', error);
    res.status(500).json({ message: 'A aparut o eroare la preluarea utilizatorului.' });
  }
};
