import Haina from '../models/Haina.js';

export const addHaina = async (req, res) => {
  const { nume, pret, detalii, material, marime, cantitate, imagine, imagine_gen } = req.body;

  try {
    const haina = await Haina.create({
      nume,
      pret,
      detalii,
      material,
      marime,
      cantitate,
      imagine,
      imagine_gen
    });

    return res.status(201).json({
      message: 'Haina adaugata cu succes!',
      haina,
    });
  } catch (error) {
    console.error('Eroare la adaugarea hainei:', error);
    return res.status(500).json({ error: 'Eroare la adaugarea hainei.' });
  }
};

export const updateHaina = async (req, res) => {
  const { id } = req.params;
  const { nume, pret, detalii, material, marime, cantitate, imagine, imagine_gen } = req.body;

  try {
    const haina = await Haina.findByPk(id);
    if (!haina) {
      return res.status(404).json({ error: 'Haina nu a fost gasita.' });
    }

    if (nume) haina.nume = nume;
    if (pret != null) haina.pret = pret;
    if (detalii) haina.detalii = detalii;
    if (material) haina.material = material;
    if (marime) haina.marime = marime;
    if (cantitate != null) haina.cantitate = cantitate;
    if (imagine) haina.imagine = imagine;
    if (imagine_gen) haina.imagine_gen = imagine_gen;

    await haina.save();

    res.status(200).json({
      message: 'Haina actualizata cu succes.',
      haina,
    });
  } catch (error) {
    console.error('Eroare la actualizarea hainei:', error);
    res.status(500).json({ error: 'Eroare interna la actualizarea hainei.' });
  }
};

export const deleteHaina = async (req, res) => {
  const { id } = req.params;

  try {
    const haina = await Haina.findByPk(id);
    if (!haina) {
      return res.status(404).json({ error: 'Haina nu a fost gasita.' });
    }

    await haina.destroy();

    res.status(200).json({ message: 'Haina a fost ?tearsa cu succes.' });
  } catch (error) {
    console.error('Eroare la ?tergerea hainei:', error);
    res.status(500).json({ error: 'Eroare interna la ?tergerea hainei.' });
  }
};

export const getAllHaine = async (req, res) => {
  try {
    const haine = await Haina.findAll();
    res.status(200).json(haine);
  } catch (error) {
    console.error('Eroare la preluarea hainelor:', error);
    res.status(500).json({ error: 'Eroare la ob?inerea hainelor.' });
  }
};

export const getHainaById = async (req, res) => {
  const { id } = req.params;

  try {
    const haina = await Haina.findByPk(id);
    if (!haina) return res.status(404).json({ error: 'Haina nu a fost gasita.' });
    res.status(200).json(haina);
  } catch (error) {
    console.error('Eroare la preluarea hainei:', error);
    res.status(500).json({ error: 'Eroare interna.' });
  }
}; 