import Employee from '../models/Employee.js';

// Creeaza angajat
export const creeazaAngajat = async (req, res) => {
  try {
    const { nume, prenume, rol } = req.body;
    if (!nume || !prenume) {
      return res.status(400).json({ error: 'Numele si prenumele sunt obligatorii.' });
    }
    const employee = await Employee.create({ nume, prenume, rol: rol ?? 0 });
    res.status(201).json({ message: 'Angajat creat cu succes.', employee });
  } catch (error) {
    console.error('Eroare la crearea angajatului:', error);
    res.status(500).json({ error: 'Eroare la crearea angajatului.' });
  }
};

// Sterge angajat
export const stergeAngajat = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Angajatul nu a fost gasit.' });
    }
    await employee.destroy();
    res.status(200).json({ message: 'Angajat sters cu succes.' });
  } catch (error) {
    console.error('Eroare la stergerea angajatului:', error);
    res.status(500).json({ error: 'Eroare la stergerea angajatului.' });
  }
};

// Modifica angajat
export const modificaAngajat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nume, prenume, rol } = req.body;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Angajatul nu a fost gasit.' });
    }
    if (nume) employee.nume = nume;
    if (prenume) employee.prenume = prenume;
    if (rol !== undefined) employee.rol = rol;
    await employee.save();
    res.status(200).json({ message: 'Angajat modificat cu succes.', employee });
  } catch (error) {
    console.error('Eroare la modificarea angajatului:', error);
    res.status(500).json({ error: 'Eroare la modificarea angajatului.' });
  }
};

// Get toti angajatii
export const getAngajati = async (req, res) => {
  try {
    const angajati = await Employee.findAll();
    res.status(200).json(angajati);
  } catch (error) {
    console.error('Eroare la obtinerea angajatilor:', error);
    res.status(500).json({ error: 'Eroare la obtinerea angajatilor.' });
  }
};

// Get angajat după id
export const getAngajat = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Angajatul nu a fost găsit.' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Eroare la obținerea angajatului:', error);
    res.status(500).json({ error: 'Eroare la obținerea angajatului.' });
  }
}; 