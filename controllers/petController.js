import Pet from '../models/Pet.js';  // Importăm modelul Pet

/**
 * Funcția de creare a unui pet asociat unui utilizator
 */
export const addPet = async (req, res) => {
    const { name, age, specie, talie, image } = req.body;
    const userId = req.user.id;  // Preluăm userId din req.user, obținut din token

    console.log('Received pet data:', { name, age, specie, talie, image });

    if (!name || !age || !specie || !talie) {
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    }

    try {
        // Creăm un nou pet asociat cu utilizatorul din token
        const newPet = await Pet.create({
            name,
            age,
            specie,
            talie,
            image,
            user_id: userId,  // Asociem animalul cu utilizatorul din token
        });

        console.log('Created pet:', newPet.toJSON());
        res.status(201).json(newPet);
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ error: 'Eroare la adăugarea animalului.' });
    }
};

/**
 * Funcția de actualizare a unui pet
 */
export const updatePet = async (req, res) => {
    const { id } = req.params;  // Preluăm ID-ul din parametrii URL
    const { name, age, specie, talie, image } = req.body;

    try {
        // Căutăm pet-ul în baza de date folosind ID-ul
        const pet = await Pet.findByPk(id);

        // Dacă nu găsim pet-ul, returnăm un mesaj de eroare
        if (!pet) {
            return res.status(404).json({ message: 'Animanul nu a fost gasit' });
        }

        // Verificăm dacă pet-ul aparține utilizatorului curent
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Nu aveți permisiunea să modificați acest animal.' });
        }

        // Actualizăm pet-ul
        pet.name = name || pet.name;
        pet.age = age || pet.age;
        pet.specie = specie || pet.specie;
        pet.talie = talie || pet.talie;
        pet.image = image || pet.image;

        // Salvăm modificările în baza de date
        await pet.save();

        // Returnăm pet-ul actualizat
        res.status(200).json(pet);
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ message: 'Eroare la modificarea animalului' });
    }
};

/**
 * Funcția de ștergere a unui pet
 */
export const deletePet = async (req, res) => {
    const { id } = req.params; // ID-ul petului de șters

    try {
        // Căutăm pet-ul după ID
        const pet = await Pet.findByPk(id);

        if (!pet) {
            return res.status(404).json({ message: 'Animanul nu a fost gasit' });
        }

        // Verificăm dacă pet-ul aparține utilizatorului curent
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Nu aveți permisiunea să ștergeți acest animal.' });
        }

        // Ștergem pet-ul
        await pet.destroy();

        return res.status(200).json({ message: 'Animalul a fost sters' });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ error: 'Eroare la stergerea animalului' });
    }
};

export const getPetsByUser = async (req, res) => {
  const userId = req.user.id; // JWT middleware deja setează req.user.id

  try {
    const pets = await Pet.findAll({
      where: { user_id: userId },
      attributes: ['id', 'name', 'age', 'specie', 'talie', 'image']
    });

    res.status(200).json(pets);
  } catch (error) {
    console.error('Eroare la obținerea animalelor:', error);
    res.status(500).json({ error: 'Eroare internă.' });
  }
};

export const getPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({ error: 'Animalul nu a fost găsit.' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Eroare la obținerea detaliilor animalului:', error);
    res.status(500).json({ error: 'Eroare internă.' });
  }
};
