import Programare from '../models/Programare.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Serviciu from '../models/Serviciu.js';
import Employee from '../models/Employee.js';
import { Op } from 'sequelize'; // Importă Op pentru operatori
include: [
    { model: User, as: 'user' },
    { model: Pet, as: 'pet' },
    { model: Serviciu, as: 'serviciu' },
  ];

/**
 * Creare programare
 */
export const creareProgramare = async (req, res) => {
  const { user_id, pet_id, serviciu_id, timestamp, angajat_id } = req.body;

  // Verifică dacă toate câmpurile necesare sunt prezente
  if (!user_id || !pet_id || !serviciu_id || !timestamp) {
    return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
  }

  try {
    // Verifică existența utilizatorului, animalului și serviciului
    const user = await User.findByPk(user_id);
    const pet = await Pet.findByPk(pet_id);
    const serviciu = await Serviciu.findByPk(serviciu_id);

    if (!user) return res.status(404).json({ error: 'Utilizatorul nu există.' });
    if (!pet) return res.status(404).json({ error: 'Animalul nu există.' });
    if (!serviciu) return res.status(404).json({ error: 'Serviciul nu există.' });

    // Verifică dacă există deja o programare pentru acel user și animal la acest moment
    const programareExistenta = await Programare.findOne({
      where: {
        user_id,
        pet_id,
        timestamp,
      },
    });

    if (programareExistenta) {
      return res.status(400).json({ error: 'Există deja o programare pentru acest user și animal la acest moment.' });
    }

    // Creează programarea cu status implicit 0 (în așteptare)
    const programare = await Programare.create({
      user_id,
      pet_id,
      serviciu_id,
      timestamp,
      status: 0, // Status implicit: în așteptare
      angajat_id: angajat_id || null,
    });

    res.status(201).json({ message: 'Programare creată cu succes.', programare });
  } catch (error) {
    console.error('Eroare creare programare:', error);
    res.status(500).json({ error: 'Eroare la crearea programării.' });
  }
};

/**
 * Modificare programare
 */
export const modificaProgramare = async (req, res) => {
  const { id } = req.params;
  const { serviciu_id, timestamp } = req.body;

  // Verifică dacă serviciul și timestamp-ul sunt prezent
  if (!serviciu_id || !timestamp) {
    return res.status(400).json({ error: 'Serviciul și timestamp-ul sunt obligatorii.' });
  }

  try {
    // Găsește programarea
    const programare = await Programare.findByPk(id);
    if (!programare) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită.' });
    }

    // Verifică dacă serviciul există
    const serviciu = await Serviciu.findByPk(serviciu_id);
    if (!serviciu) {
      return res.status(404).json({ error: 'Serviciul nu există.' });
    }

    // Verifică dacă există o altă programare la același moment pentru același user și pet
    const duplicate = await Programare.findOne({
      where: {
        user_id: programare.user_id,
        pet_id: programare.pet_id,
        timestamp,
        id: { [Op.ne]: id }, // să nu fie programarea curentă
      },
    });

    if (duplicate) {
      return res.status(400).json({ error: 'Există deja o altă programare la acest moment pentru acest user și pet.' });
    }

    // Actualizează programarea cu noul serviciu și timestamp
    programare.serviciu_id = serviciu_id;
    programare.timestamp = timestamp;

    await programare.save();

    res.status(200).json({ message: 'Programarea a fost actualizată.', programare });
  } catch (error) {
    console.error('Eroare modificare programare:', error);
    res.status(500).json({ error: 'Eroare la modificarea programării.' });
  }
};

/**
 * Ștergere programare
 */
export const stergeProgramare = async (req, res) => {
  const { id } = req.params;

  try {
    // Găsește programarea
    const programare = await Programare.findByPk(id);
    if (!programare) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită.' });
    }

    // Verifică dacă programarea a fost deja realizată
    if (programare.status === 2) {
      return res.status(400).json({ error: 'Nu poți șterge o programare care a fost deja realizată.' });
    }

    // Șterge programarea
    await programare.destroy();
    res.status(200).json({ message: 'Programarea a fost ștearsă cu succes.' });
  } catch (error) {
    console.error('Eroare ștergere programare:', error);
    res.status(500).json({ error: 'Eroare la ștergerea programării.' });
  }
};

/**
 * Confirmare programare (pentru admin)
 */
export const confirmaProgramare = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Verifică dacă status-ul este valid
  if (![-1, 0, 1, 2].includes(status)) {
    return res.status(400).json({ error: 'Status invalid. Valori permise: -1, 0, 1, 2' });
  }

  try {
    // Găsește programarea
    const programare = await Programare.findByPk(id);
    if (!programare) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită.' });
    }

    // Actualizează status-ul programării
    programare.status = status;
    await programare.save();

    // Daca statusul devine 2 (finalizata), updatez had_appointment la user
    if (status === 2) {
      await User.update({ had_appointment: 1 }, { where: { id: programare.user_id } });
    }

    res.status(200).json({ 
      message: `Statusul programării a fost actualizat la ${status}.`, 
      programare 
    });
  } catch (error) {
    console.error('Eroare confirmare programare:', error);
    res.status(500).json({ error: 'Eroare la confirmarea programării.' });
  }
};

export const getProgramariByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const programari = await Programare.findAll({
      where: { user_id: userId },
      include: [
        { model: Pet, as: 'pet' },
        { model: Serviciu, as: 'serviciu' }
      ]
    });

    res.status(200).json(programari);
  } catch (error) {
    console.error('Eroare la obținerea programărilor:', error);
    res.status(500).json({ error: 'Eroare la preluarea programărilor.' });
  }
};

export const getProgramareById = async (req, res) => {
  const { id } = req.params;

  try {
    const programare = await Programare.findByPk(id, {
      include: [
        { model: Pet, as: 'pet' },
        { model: Serviciu, as: 'serviciu' }
      ]
    });

    if (!programare) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită.' });
    }

    res.status(200).json(programare);
  } catch (error) {
    console.error('Eroare la obținerea programării:', error);
    res.status(500).json({ error: 'Eroare internă.' });
  }
};

export const getProgramariByPet = async (req, res) => {
  const { petId } = req.params;

  try {
    const programari = await Programare.findAll({
      where: { pet_id: petId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Pet, as: 'pet' },
        { model: Serviciu, as: 'serviciu' },
        { model: Employee, as: 'employee', attributes: ['id', 'nume', 'prenume', 'rol'] }
      ]
    });
    res.status(200).json(programari);
  } catch (error) {
    console.error('Eroare la obținerea programărilor pentru animal:', error);
    res.status(500).json({ error: 'Eroare la preluarea programărilor pentru animal.' });
  }
};
