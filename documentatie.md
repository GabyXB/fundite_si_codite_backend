# Documentație Backend

## Modele (models)

### 1. Programare
Modelul `Programare` reprezintă o programare efectuată de un utilizator pentru un anumit serviciu, pentru un animal de companie, la o anumită dată și, opțional, cu un angajat alocat.

- **serviciu_id**: integer, referință la serviciul programat (obligatoriu)
- **user_id**: integer, referință la utilizatorul care a făcut programarea (obligatoriu)
- **pet_id**: integer, referință la animalul de companie (obligatoriu)
- **timestamp**: date, data și ora programării (obligatoriu)
- **status**: integer, starea programării (implicit 0 = în așteptare, -1 = respinsă, 1 = acceptată, 2 = finalizată)
- **angajat_id**: integer, referință la angajatul alocat (opțional)

Relații:
- Fiecare programare aparține unui utilizator (`User`), unui animal (`Pet`), unui serviciu (`Serviciu`) și, opțional, unui angajat (`Employee`).

---

### 2. Review
Modelul `Review` reprezintă o recenzie lăsată de un utilizator pentru un anumit subiect.

- **user_id**: integer, referință la utilizator (obligatoriu)
- **topic**: string(40), subiectul recenziei (obligatoriu)
- **text_link**: string, link către textul recenziei (obligatoriu)
- **stele**: integer, număr de stele (1-5, obligatoriu)
- **created_at**: date, data creării recenziei (implicit: acum)

Relații:
- Fiecare recenzie aparține unui utilizator (`User`).

---

### 3. Employee
Modelul `Employee` reprezintă un angajat al salonului.

- **nume**: string, numele angajatului (obligatoriu)
- **prenume**: string, prenumele angajatului (obligatoriu)
- **rol**: tinyint, rolul angajatului (implicit 0 = stilist , 1 = administrator)

---

### 4. User
Modelul `User` reprezintă un utilizator al aplicației.

- **name**: string, numele utilizatorului (obligatoriu)
- **email**: string, emailul utilizatorului (unic, obligatoriu)
- **password**: string, parola (obligatoriu)
- **image**: string, link către imaginea de profil (opțional)
- **had_appointment**: tinyint, dacă a avut sau nu programare (implicit 0)

---

### 5. Pet
Modelul `Pet` reprezintă un animal de companie al unui utilizator.

- **id**: integer, cheie primară, auto-increment
- **name**: string(30), numele animalului (obligatoriu)
- **age**: integer, vârsta (obligatoriu)
- **specie**: string(20), specia animalului (obligatoriu)
- **talie**: integer, talia animalului (obligatoriu)
- **image**: string(255), link către imagine (opțional)
- **user_id**: integer, referință la utilizator (obligatoriu)

Relații:
- Fiecare animal aparține unui utilizator (`User`).

---

### 6. Haina
Modelul `Haina` reprezintă o haină disponibilă în magazin.

- **nume**: string(255), numele hainei (obligatoriu)
- **pret**: float, prețul hainei (obligatoriu)
- **detalii**: text, detalii despre haină (obligatoriu)
- **material**: string(100), materialul hainei (obligatoriu)
- **marime**: string(10), mărimea hainei (obligatoriu)
- **cantitate**: integer, stocul disponibil (obligatoriu)
- **imagine**: string(255), link către imagine (opțional)
- **imagine_gen**: string(255), link către imagine generică (opțional)

---

### 7. Serviciu
Modelul `Serviciu` reprezintă un serviciu oferit de salon.

- **nume**: string, numele serviciului (obligatoriu)
- **pret**: float, prețul serviciului (obligatoriu)
- **detalii**: text, detalii despre serviciu (opțional)

---

### 8. CartItem
Modelul `CartItem` reprezintă un produs adăugat într-un coș de cumpărături.

- **cart_id**: integer, referință la coș (obligatoriu)
- **product_id**: integer, referință la produs (obligatoriu)
- **cantitate**: integer, cantitatea produsului (obligatoriu)

---

### 9. OrderItem
Modelul `OrderItem` reprezintă un produs dintr-o comandă plasată.
Face legatura intre utilizator si comenzi.

- **order_id**: integer, referință la comandă (obligatoriu)
- **product_id**: integer, referință la produs (obligatoriu)
- **cantitate**: integer, cantitatea comandată (obligatoriu)
- **pret**: float, prețul produsului la momentul comenzii (obligatoriu)

---

### 10. Order
Modelul `Order` reprezintă o comandă plasată de un utilizator.

- **user_id**: integer, referință la utilizator (obligatoriu)
- **pret_total**: float, prețul total al comenzii (obligatoriu)
- **discount**: float, discount aplicat (opțional)

---

### 11. Cart
Modelul `Cart` reprezintă un coș de cumpărături asociat unui utilizator.

- **user_id**: integer, referință la utilizator (obligatoriu)

---

### 12. Product
Modelul `Product` reprezintă un produs disponibil în magazin.

- **nume**: string(255), numele produsului (obligatoriu)
- **pret**: float, prețul produsului (obligatoriu)
- **detalii**: string(255), detalii despre produs (obligatoriu)
- **imagine**: string(255), link către imagine (opțional)
- **cantitate**: integer, stocul disponibil (obligatoriu)

---

## Controllere (controllers)

### cartController.js

#### cartController.js - Detaliere avansată

- **Ruta:** `POST /cos/creaza`
- **createCart(req, res)**
  - **Descriere:** Creează un coș de cumpărături pentru un utilizator. Dacă utilizatorul are deja coș, îl returnează pe cel existent.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "user_id": 1 }
      ```
  - **Response:**
    - Status 201: `{ "message": "Coșul de cumpărături a fost creat cu succes!", "cos": { ... } }`
    - Status 200: `{ "message": "Coșul a fost găsit.", "cos": { ... } }`
    - Status 400: `{ "error": "Trebuie sa furnizezi un user_id." }`
    - Status 500: `{ "error": "A aparut o eroare la crearea coșului." }`
  - **Validări:** user_id este obligatoriu.
  - **Scenarii:** Se folosește la primul acces în shop sau la login.

- **Ruta:** `POST /cos/adaugare`
- **addProductToCart(req, res)**
  - **Descriere:** Adaugă un produs în coșul unui utilizator. Dacă produsul există deja, actualizează cantitatea.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "user_id": 1, "product_id": 2, "cantitate": 3 }
      ```
  - **Response:**
    - Status 201: `{ "message": "Produsul a fost adăugat în coș cu succes!", "item": { ... } }`
    - Status 200: `{ "message": "Cantitatea produsului a fost actualizată.", "item": { ... } }`
    - Status 400: `{ "error": "Date invalide. Asigura-te ca ai trimis user_id, product_id și cantitatea corecta." }`
    - Status 404: `{ "error": "Coșul nu a fost găsit." }`
    - Status 500: `{ "error": "A aparut o eroare la adaugarea produsului în coș." }`
  - **Validări:** user_id, product_id, cantitate > 0 sunt obligatorii.
  - **Scenarii:** Adăugare produs din pagina de shop.

- **Ruta:** `GET /cos/vezi`
- **getCart(req, res)**
  - **Descriere:** Returnează coșul de cumpărături al unui utilizator, cu toate produsele și prețul total. Creează coș dacă nu există.
  - **Request:**
    - Method: `GET`
    - Query: `?user_id=1`
  - **Response:**
    - Status 200: `{ "message": "Coșul a fost găsit.", "cos": { ... } }`
    - Status 400: `{ "error": "user_id este obligatoriu." }`
    - Status 500: `{ "error": "A aparut o eroare la vizualizarea coșului." }`
  - **Validări:** user_id este obligatoriu.
  - **Scenarii:** Vizualizare coș, checkout.

- **Ruta:** `POST /cos/finalizeaza`
- **finalizeOrder(req, res)**
  - **Descriere:** Plasează comanda pentru produsele din coș, creează o comandă nouă și golește coșul.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "user_id": 1 }
      ```
  - **Response:**
    - Status 200: `{ "message": "Comanda a fost plasată cu succes!", "order": { ... } }`
    - Status 404: `{ "error": "Coșul nu a fost găsit." }`
    - Status 500: `{ "error": "A aparut o eroare la finalizarea comenzii." }`
  - **Validări:** user_id este obligatoriu, coșul trebuie să conțină produse.
  - **Scenarii:** Finalizare comandă.

- **Ruta:** `DELETE /cos/scoate`
- **scoateProdusDinCos(req, res)**
  - **Descriere:** Elimină un produs din coșul utilizatorului.
  - **Request:**
    - Method: `DELETE`
    - Body:
      ```json
      { "user_id": 1, "product_id": 2 }
      ```
  - **Response:**
    - Status 200: `{ "message": "Produsul a fost eliminat din coș." }`
    - Status 404: `{ "error": "Coșul nu a fost găsit." }`
    - Status 404: `{ "error": "Produsul nu a fost găsit în coș." }`
    - Status 500: `{ "error": "A aparut o eroare la eliminarea produsului din coș." }`
  - **Validări:** user_id, product_id sunt obligatorii.
  - **Scenarii:** Ștergere produs din coș.

- **Ruta:** `PUT /cos/modifica`
- **modificaCantitateProdusInCos(req, res)**
  - **Descriere:** Modifică cantitatea unui produs din coș.
  - **Request:**
    - Method: `PUT`
    - Body:
      ```json
      { "user_id": 1, "product_id": 2, "cantitate": 5 }
      ```
  - **Response:**
    - Status 200: `{ "message": "Cantitatea a fost actualizată.", "item": { ... } }`
    - Status 400: `{ "error": "Date invalide. Trebuie sa furnizezi user_id, product_id și o cantitate valida (> 0)." }`
    - Status 404: `{ "error": "Coșul nu a fost găsit." }`
    - Status 404: `{ "error": "Produsul nu a fost găsit în coș." }`
    - Status 500: `{ "error": "A aparut o eroare la actualizarea cantității." }`
  - **Validări:** user_id, product_id, cantitate > 0 sunt obligatorii.
  - **Scenarii:** Modificare rapidă cantitate din coș.

---

### employeeController.js

#### employeeController.js - Detaliere avansată

- **Ruta:** `POST /employee/`
- **creeazaAngajat(req, res)**
  - **Descriere:** Creează un angajat nou în sistem.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "nume": "Popescu", "prenume": "Ion", "rol": 1 }
      ```
    - (rol este opțional)
  - **Response:**
    - Status 201: `{ "message": "Angajat creat cu succes.", "employee": { ... } }`
    - Status 400: `{ "error": "Numele si prenumele sunt obligatorii." }`
    - Status 500: `{ "error": "Eroare la crearea angajatului." }`
  - **Validări:** nume și prenume sunt obligatorii. rol este opțional (default 0).
  - **Scenarii:** Adăugare angajat nou de către admin.

- **Ruta:** `DELETE /angajati/:id`
- **stergeAngajat(req, res)**
  - **Descriere:** Șterge un angajat după id.
  - **Request:**
    - Method: `DELETE`
    - URL: `/angajati/5`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Angajat sters cu succes." }`
    - Status 404: `{ "error": "Angajatul nu a fost gasit." }`
    - Status 500: `{ "error": "Eroare la stergerea angajatului." }`
  - **Validări:** id-ul trebuie să existe în baza de date.
  - **Scenarii:** Ștergere angajat de către admin.

- **Ruta:** `PUT /angajati/:id`
- **modificaAngajat(req, res)**
  - **Descriere:** Modifică datele unui angajat după id.
  - **Request:**
    - Method: `PUT`
    - URL: `/angajati/5`
    - Body:
      ```json
      { "nume": "Ionescu", "prenume": "Maria", "rol": 2 }
      ```
    - (toate câmpurile sunt opționale, se modifică doar ce se trimite)
  - **Response:**
    - Status 200: `{ "message": "Angajat modificat cu succes.", "angajati": { ... } }`
    - Status 404: `{ "error": "Angajatul nu a fost gasit." }`
    - Status 500: `{ "error": "Eroare la modificarea angajatului." }`
  - **Validări:** id-ul trebuie să existe. Oricare din nume, prenume, rol pot fi modificate.
  - **Scenarii:** Modificare date angajat de către admin.

- **Ruta:** `GET /angajati/`
- **getAngajati(req, res)**
  - **Descriere:** Returnează toți angajații existenți în sistem.
  - **Request:**
    - Method: `GET`
    - URL: `/angajati/`
    - Nu necesită body sau query.
  - **Response:**
    - Status 200: `[ { ... }, ... ]` (listă de angajați)
    - Status 500: `{ "error": "Eroare la obtinerea angajatilor." }`
  - **Scenarii:** Vizualizare listă angajați pentru management.

- **Ruta:** `GET /angajati/:id`
- **getAngajat(req, res)**
  - **Descriere:** Returnează un angajat după id.
  - **Request:**
    - Method: `GET`
    - URL: `/angajati/5`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ ... }` (angajatul găsit)
    - Status 404: `{ "error": "Angajatul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare la obținerea angajatului." }`
  - **Validări:** id-ul trebuie să existe.
  - **Scenarii:** Vizualizare detalii angajat.

---

### programareController.js

#### programareController.js - Detaliere avansată

- **Ruta:** `POST /programare/creare`
- **creareProgramare(req, res)**
  - **Descriere:** Creează o programare nouă pentru un utilizator, un animal și un serviciu la o anumită dată/ora.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "user_id": 1, "pet_id": 2, "serviciu_id": 3, "timestamp": "2024-06-01T10:00:00Z", "angajat_id": 4 }
      ```
    - (angajat_id este opțional)
  - **Response:**
    - Status 201: `{ "message": "Programare creată cu succes.", "programare": { ... } }`
    - Status 400: `{ "error": "Toate câmpurile sunt obligatorii." }`
    - Status 404: `{ "error": "Utilizatorul/Animalul/Serviciul nu există." }`
    - Status 400: `{ "error": "Există deja o programare pentru acest user și animal la acest moment." }`
    - Status 500: `{ "error": "Eroare la crearea programării." }`
  - **Validări:** user_id, pet_id, serviciu_id, timestamp obligatorii. angajat_id opțional.
  - **Scenarii:** Programare nouă la salon.

- **Ruta:** `PUT /programare/modifica/:id`
- **modificaProgramare(req, res)**
  - **Descriere:** Modifică serviciul și data/ora unei programări existente.
  - **Request:**
    - Method: `PUT`
    - URL: `/programare/modifica/10`
    - Body:
      ```json
      { "serviciu_id": 3, "timestamp": "2024-06-01T12:00:00Z" }
      ```
  - **Response:**
    - Status 200: `{ "message": "Programarea a fost actualizată.", "programare": { ... } }`
    - Status 400: `{ "error": "Serviciul și timestamp-ul sunt obligatorii." }`
    - Status 404: `{ "error": "Programarea/Serviciul nu a fost găsit." }`
    - Status 400: `{ "error": "Există deja o altă programare la acest moment pentru acest user și pet." }`
    - Status 500: `{ "error": "Eroare la modificarea programării." }`
  - **Validări:** serviciu_id și timestamp obligatorii. id-ul programării trebuie să existe.
  - **Scenarii:** Reprogramare sau schimbare serviciu.

- **Ruta:** `DELETE /programare/sterge/:id`
- **stergeProgramare(req, res)**
  - **Descriere:** Șterge o programare după id. Nu permite ștergerea programărilor finalizate.
  - **Request:**
    - Method: `DELETE`
    - URL: `/programare/sterge/10`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Programarea a fost ștearsă cu succes." }`
    - Status 404: `{ "error": "Programarea nu a fost găsită." }`
    - Status 400: `{ "error": "Nu poți șterge o programare care a fost deja realizată." }`
    - Status 500: `{ "error": "Eroare la ștergerea programării." }`
  - **Validări:** id-ul programării trebuie să existe și să nu fie finalizată.
  - **Scenarii:** Anulare programare de către user/admin.

- **Ruta:** `PUT /programare/confirma/:id`
- **confirmaProgramare(req, res)**
  - **Descriere:** Confirmă sau schimbă statusul unei programări (admin). Dacă statusul devine 2 (finalizată), setează had_appointment la user.
  - **Request:**
    - Method: `PUT`
    - URL: `/programare/confirma/10`
    - Body:
      ```json
      { "status": 1 }
      ```
  - **Response:**
    - Status 200: `{ "message": "Statusul programării a fost actualizat la 1.", "programare": { ... } }`
    - Status 400: `{ "error": "Status invalid. Valori permise: -1, 0, 1, 2" }`
    - Status 404: `{ "error": "Programarea nu a fost găsită." }`
    - Status 500: `{ "error": "Eroare la confirmarea programării." }`
  - **Validări:** status trebuie să fie -1, 0, 1 sau 2. id-ul programării trebuie să existe.
  - **Scenarii:** Confirmare, respingere sau finalizare programare de către admin.

- **Ruta:** `GET /programare/user/:userId`
- **getProgramariByUserId(req, res)**
  - **Descriere:** Returnează toate programările unui utilizator.
  - **Request:**
    - Method: `GET`
    - URL: `/programare/user/1`
    - Nu necesită body.
  - **Response:**
    - Status 200: `[ { ... }, ... ]` (listă de programări cu detalii pet și serviciu)
    - Status 500: `{ "error": "Eroare la preluarea programărilor." }`
  - **Validări:** userId trebuie să existe.
  - **Scenarii:** Istoric programări pentru user.

- **Ruta:** `GET /programare/:id`
- **getProgramareById(req, res)**
  - **Descriere:** Returnează o programare după id, cu detalii pet și serviciu.
  - **Request:**
    - Method: `GET`
    - URL: `/programare/10`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ ... }` (programarea găsită)
    - Status 404: `{ "error": "Programarea nu a fost găsită." }`
    - Status 500: `{ "error": "Eroare internă." }`
  - **Validări:** id-ul programării trebuie să existe.
  - **Scenarii:** Vizualizare detalii programare.

- **Ruta:** `GET /programare/pet/:petId`
- **getProgramariByPet(req, res)**
  - **Descriere:** Returnează toate programările pentru un animal, cu detalii user, pet, serviciu, angajati.
  - **Request:**
    - Method: `GET`
    - URL: `/programare/pet/2`
    - Nu necesită body.
  - **Response:**
    - Status 200: `[ { ... }, ... ]` (listă de programări)
    - Status 500: `{ "error": "Eroare la preluarea programărilor pentru animal." }`
  - **Validări:** petId trebuie să existe.
  - **Scenarii:** Istoric programări pentru animal.

---

### reviewController.js

#### reviewController.js - Detaliere avansată

- **Ruta:** `POST /recenzii/`
- **creeazaRecenzie(req, res)**
  - **Descriere:** Creează o recenzie nouă pentru un serviciu/experiență, doar dacă utilizatorul are programare finalizată.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "user_id": 1, "topic": "Tuns", "text_link": "https://...", "stele": 5 }
      ```
  - **Response:**
    - Status 201: `{ "message": "Recenzie creată cu succes.", "recenzie": { ... } }`
    - Status 400: `{ "error": "Toate câmpurile sunt obligatorii." }`
    - Status 403: `{ "error": "Doar utilizatorii cu programare finalizată pot lăsa o recenzie." }`
    - Status 500: `{ "error": "Eroare la crearea recenziei." }`
  - **Validări:** user_id, topic, text_link, stele (1-5) obligatorii. Userul trebuie să aibă had_appointment=1.
  - **Scenarii:** Lăsare recenzie după finalizarea unei programări.

- **Ruta:** `DELETE /recenzii/:id`
- **stergeRecenzie(req, res)**
  - **Descriere:** Șterge o recenzie după id.
  - **Request:**
    - Method: `DELETE`
    - URL: `/recenzii/10`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Recenzie ștearsă cu succes." }`
    - Status 404: `{ "error": "Recenzia nu a fost gasita." }`
    - Status 500: `{ "error": "Eroare la ștergerea recenziei." }`
  - **Validări:** id-ul recenziei trebuie să existe.
  - **Scenarii:** Ștergere recenzie de către user/admin.

- **Ruta:** `PUT /recenzii/:id`
- **modificaRecenzie(req, res)**
  - **Descriere:** Modifică o recenzie după id.
  - **Request:**
    - Method: `PUT`
    - URL: `/recenzii/10`
    - Body:
      ```json
      { "topic": "Spălat", "text_link": "https://...", "stele": 4 }
      ```
    - (toate câmpurile sunt opționale, se modifică doar ce se trimite)
  - **Response:**
    - Status 200: `{ "message": "Recenzie modificată cu succes.", "recenzii": { ... } }`
    - Status 404: `{ "error": "Recenzia nu a fost gasita." }`
    - Status 500: `{ "error": "Eroare la modificarea recenziei." }`
  - **Validări:** id-ul recenziei trebuie să existe. Oricare din topic, text_link, stele pot fi modificate.
  - **Scenarii:** Editare recenzie de către user.

- **Ruta:** `GET /recenzii/user/:user_id`
- **getRecenzieByUser(req, res)**
  - **Descriere:** Returnează toate recenziile unui utilizator.
  - **Request:**
    - Method: `GET`
    - URL: `/recenzii/user/1`
    - Nu necesită body.
  - **Response:**
    - Status 200: `[ { ... }, ... ]` (listă de recenzii)
    - Status 500: `{ "error": "Eroare la obtinerea recenziilor." }`
  - **Validări:** user_id trebuie să existe.
  - **Scenarii:** Vizualizare recenzii proprii.

- **Ruta:** `GET /recenzii/`
- **getRecenzii(req, res)**
  - **Descriere:** Returnează toate recenziile, cu numele userului.
  - **Request:**
    - Method: `GET`
    - URL: `/recenzii/`
    - Nu necesită body sau query.
  - **Response:**
    - Status 200: `[ { ... }, ... ]` (listă de recenzii cu user)
    - Status 500: `{ "error": "Eroare la obtinerea recenziilor." }`
  - **Scenarii:** Vizualizare recenzii pentru admin sau public.

---

### userController.js

#### userController.js - Detaliere avansată

- **Ruta:** `PUT /user/:id`
- **updateUser(req, res)**
  - **Descriere:** Actualizează datele unui utilizator (nume, email, parolă, imagine). Verifică parola curentă pentru modificări sensibile.
  - **Request:**
    - Method: `PUT`
    - URL: `/user/1`
    - Body:
      ```json
      { "name": "Ana Maria", "email": "ana.nou@email.com", "currentPassword": "Parola123", "newPassword": "NouaParola123", "image": "https://..." }
      ```
    - (currentPassword este obligatoriu doar dacă se modifică email sau parolă)
  - **Response:**
    - Status 200: `{ "message": "Utilizatorul a fost actualizat cu succes!", "user": { ... } }`
    - Status 403: `{ "message": "Nu ai permisiunea de a modifica acest utilizator." }`
    - Status 404: `{ "message": "Utilizatorul nu a fost gasit." }`
    - Status 400: `{ "message": "Pentru a modifica email-ul sau parola, trebuie sa introduceți parola curenta." }`
    - Status 401: `{ "message": "Parola curenta este incorecta." }`
    - Status 400: `{ "message": "Acest email este deja folosit." }`
    - Status 500: `{ "message": "A aparut o eroare la actualizarea utilizatorului." }`
  - **Validări:** id-ul userului trebuie să existe. Pentru modificare email/parolă, parola curentă este obligatorie. Email unic.
  - **Scenarii:** Editare profil user.

- **Ruta:** `DELETE /user/:id`
- **deleteUser(req, res)**
  - **Descriere:** Șterge un utilizator după id, cu verificare parolă.
  - **Request:**
    - Method: `DELETE`
    - URL: `/user/1`
    - Body:
      ```json
      { "password": "Parola123" }
      ```
  - **Response:**
    - Status 200: `{ "message": "Utilizatorul a fost șters cu succes!" }`
    - Status 403: `{ "message": "Nu ai permisiunea de a modifica acest utilizator." }`
    - Status 404: `{ "message": "Utilizatorul nu a fost gasit." }`
    - Status 400: `{ "message": "Trebuie sa introduceți parola pentru a șterge contul." }`
    - Status 401: `{ "message": "Parola este incorecta." }`
    - Status 500: `{ "message": "A aparut o eroare la ștergerea utilizatorului." }`
  - **Validări:** id-ul userului trebuie să existe. Parola obligatorie.
  - **Scenarii:** Ștergere cont user.

- **Ruta:** `GET /user/:id`
- **getUserById(req, res)**
  - **Descriere:** Returnează datele unui user după id.
  - **Request:**
    - Method: `GET`
    - URL: `/user/1`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "id": 1, "name": "Ana", "email": "ana@email.com", "image": "...", "had_appointment": 0 }`
    - Status 404: `{ "message": "Utilizatorul nu a fost gasit." }`
    - Status 500: `{ "message": "A aparut o eroare la preluarea utilizatorului." }`
  - **Validări:** id-ul userului trebuie să existe.
  - **Scenarii:** Vizualizare profil alt user (admin).

---

### petController.js

#### petController.js - Detaliere avansată

- **Ruta:** `POST /pets/`
- **addPet(req, res)**
  - **Descriere:** Creează un animal de companie asociat userului autentificat.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "name": "Rex", "age": 3, "specie": "Caine", "talie": 2, "image": "https://..." }
      ```
    - (user_id se ia din token)
  - **Response:**
    - Status 201: `{ ... }` (petul creat)
    - Status 400: `{ "error": "Toate câmpurile sunt obligatorii." }`
    - Status 500: `{ "error": "Eroare la adăugarea animalului." }`
  - **Validări:** name, age, specie, talie obligatorii. user_id se ia din token.
  - **Scenarii:** Adăugare animal nou de către user.

- **Ruta:** `PUT /pets/:id`
- **updatePet(req, res)**
  - **Descriere:** Modifică datele unui animal. Doar userul proprietar poate modifica.
  - **Request:**
    - Method: `PUT`
    - URL: `/pet/10`
    - Body:
      ```json
      { "name": "Rexy", "age": 4, "specie": "Caine", "talie": 2, "image": "https://..." }
      ```
    - (toate câmpurile sunt opționale, se modifică doar ce se trimite)
  - **Response:**
    - Status 200: `{ ... }` (petul modificat)
    - Status 404: `{ "message": "Animanul nu a fost gasit" }`
    - Status 403: `{ "message": "Nu aveți permisiunea să modificați acest animal." }`
    - Status 500: `{ "message": "Eroare la modificarea animalului" }`
  - **Validări:** id-ul petului trebuie să existe. userul să fie proprietar.
  - **Scenarii:** Editare animal propriu.

- **Ruta:** `DELETE /pets/:id`
- **deletePet(req, res)**
  - **Descriere:** Șterge un animal după id. Doar userul proprietar poate șterge.
  - **Request:**
    - Method: `DELETE`
    - URL: `/pets/10`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Animalul a fost sters" }`
    - Status 404: `{ "message": "Animanul nu a fost gasit" }`
    - Status 403: `{ "message": "Nu aveți permisiunea să ștergeți acest animal." }`
    - Status 500: `{ "error": "Eroare la stergerea animalului" }`
  - **Validări:** id-ul petului trebuie să existe. userul să fie proprietar.
  - **Scenarii:** Ștergere animal propriu.

- **Ruta:** `GET /pets/me`
- **getPetsByUser(req, res)**
  - **Descriere:** Returnează toate animalele userului autentificat.
  - **Request:**
    - Method: `GET`
    - URL: `/pets/me`
    - Nu necesită body.
  - **Response:**
    - Status 200: `[ { ... }, ... ]` (listă de animale)
    - Status 500: `{ "error": "Eroare internă." }`
  - **Scenarii:** Vizualizare animale proprii.

- **Ruta:** `GET /pets/:id`
- **getPetById(req, res)**
  - **Descriere:** Returnează un animal după id.
  - **Request:**
    - Method: `GET`
    - URL: `/pets/10`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ ... }` (petul găsit)
    - Status 404: `{ "error": "Animalul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare internă." }`
  - **Validări:** id-ul petului trebuie să existe.
  - **Scenarii:** Vizualizare detalii animal.

---

### authController.js

#### authController.js - Detaliere avansată

- **Ruta:** `POST /auth/signup`
- **registerUser(req, res)**
  - **Descriere:** Înregistrează un utilizator nou cu datele de bază și parolă securizată.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "name": "Ana", "email": "ana@email.com", "password": "Parola123" }
      ```
  - **Response:**
    - Status 201: `{ "message": "Utilizator înregistrat cu succes", "userId": 1, "had_appointment": 0 }`
    - Status 400: `{ "error": "Toate câmpurile sunt obligatorii." }`
    - Status 400: `{ "error": "Parola trebuie sa aiba cel puțin 8 caractere, o litera mare și o cifra." }`
    - Status 400: `{ "error": "Emailul este deja folosit." }`
    - Status 500: `{ "error": "Eroare interna la înregistrare." }`
  - **Validări:** name, email, password obligatorii. Parola minim 8 caractere, o literă mare, o cifră. Email unic.
  - **Scenarii:** Înregistrare user nou în aplicație.

- **Ruta:** `POST /auth/login`
- **loginUser(req, res)**
  - **Descriere:** Autentifică un utilizator și returnează token JWT.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "email": "ana@email.com", "password": "Parola123" }
      ```
  - **Response:**
    - Status 200: `{ "message": "Autentificare reușită", "token": "...", "userId": 1, "name": "Ana", "had_appointment": 0 }`
    - Status 400: `{ "error": "Email și parola sunt obligatorii." }`
    - Status 401: `{ "error": "Email sau parola incorecta." }`
    - Status 500: `{ "error": "Eroare interna la autentificare." }`
  - **Validări:** email și password obligatorii.
  - **Scenarii:** Login user existent.

- **Ruta:** `GET /auth/verify-token`
- **verifyToken(req, res)**
  - **Descriere:** Verifică tokenul JWT și returnează datele utilizatorului autentificat.
  - **Request:**
    - Method: `GET`
    - URL: `/auth/verify-token`
    - Header: `Authorization: Bearer <token>`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Token valid", "userId": 1, "name": "Ana", "had_appointment": 0 }`
    - Status 401: `{ "error": "Token invalid sau expirat" }`
    - Status 500: `{ "error": "Eroare la verificarea tokenului" }`
  - **Validări:** token trebuie să fie valid și să nu fi expirat.
  - **Scenarii:** Verificare token la accesarea resurselor protejate.

- **Ruta:** `GET /auth/profile`
- **profil user autentificat(req, res)**
  - **Descriere:** Returnează datele userului autentificat (din token).
  - **Request:**
    - Method: `GET`
    - URL: `/auth/profile`
    - Header: `Authorization: Bearer <token>`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "id": 1, "name": "Ana", "email": "ana@email.com", "image": "...", "had_appointment": 0 }`
    - Status 404: `{ "message": "Utilizatorul nu a fost gasit." }`
    - Status 500: `{ "message": "A aparut o eroare la preluarea utilizatorului." }`
  - **Scenarii:** Vizualizare profil user logat.

---

### hainaController.js

#### hainaController.js - Detaliere avansată

- **Ruta:** `GET /haina/`
- **getAllHaine(req, res)**
  - **Descriere:** Returnează toate hainele.
  - **Request:**
    - Method: `GET`
    - URL: `/haine`
  - **Response:**
    - Status 200: `[ { ... }, ... ]`
    - Status 500: `{ "error": "Eroare la obținerea hainelor." }`
  - **Scenarii:** Vizualizare produse magazin.

- **GET /haina/:id**
- **getHainaById(req, res)**
  - **Descriere:** Returnează o haină după id.
  - **Request:**
    - Method: `GET`
    - URL: `/haine/:id`
  - **Response:**
    - Status 200: `{ ... }`
    - Status 404: `{ "error": "Haina nu a fost gasita." }`
    - Status 500: `{ "error": "Eroare interna." }`
  - **Validări:** id-ul hainei trebuie să existe.
  - **Scenarii:** Vizualizare detalii produs.

- **POST /haina/add**
- **addHaina(req, res)**
  - **Descriere:** Adaugă o haină nouă.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "nume": "Pulover", "pret": 99.99, "detalii": "Lână", "material": "Lână", "marime": "M", "cantitate": 10, "imagine": "https://...", "imagine_gen": "https://..." }
      ```
    - (imagine, imagine_gen sunt opționale)
  - **Response:**
    - Status 201: `{ "message": "Haina adaugata cu succes!", "haina": { ... } }`
    - Status 500: `{ "error": "Eroare la adaugarea hainei." }`
  - **Validări:** nume, pret, detalii, material, marime, cantitate obligatorii.
  - **Scenarii:** Adăugare produs nou în magazin.

- **PUT /haina/:id**
- **updateHaina(req, res)**
  - **Descriere:** Modifică o haină după id.
  - **Request:**
    - Method: `PUT`
    - URL: `/haina/10`
    - Body:
      ```json
      { "nume": "Pulover", "pret": 89.99, "detalii": "Lână", "material": "Lână", "marime": "M", "cantitate": 8, "imagine": "https://...", "imagine_gen": "https://..." }
      ```
    - (toate câmpurile sunt opționale, se modifică doar ce se trimite)
  - **Response:**
    - Status 200: `{ "message": "Haina actualizata cu succes.", "haina": { ... } }`
    - Status 404: `{ "error": "Haina nu a fost gasita." }`
    - Status 500: `{ "error": "Eroare interna la actualizarea hainei." }`
  - **Validări:** id-ul hainei trebuie să existe.
  - **Scenarii:** Editare produs magazin.

- **DELETE /haina/:id**
- **deleteHaina(req, res)**
  - **Descriere:** Șterge o haină după id.
  - **Request:**
    - Method: `DELETE`
    - URL: `/haina/:id`
  - **Response:**
    - Status 200: `{ "message": "Haina a fost ștearsă cu succes." }`
    - Status 404: `{ "error": "Haina nu a fost gasita." }`
    - Status 500: `{ "error": "Eroare interna la ștergerea hainei." }`
  - **Validări:** id-ul hainei trebuie să existe.
  - **Scenarii:** Ștergere produs magazin.

---

### storeController.js

#### storeController.js - Detaliere avansată

- **Ruta:** `GET /store/`
- **getAllProducts(req, res)**
  - **Descriere:** Returnează toate produsele din magazin.
  - **Request:**
    - Method: `GET`
    - URL: `/store`
  - **Response:**
    - Status 200: `[ { ... }, ... ]`
    - Status 500: `{ "error": "Eroare la obținerea produselor." }`
  - **Scenarii:** Vizualizare produse shop.

- **GET /store/:id**
- **getProductById(req, res)**
  - **Descriere:** Returnează un produs după id.
  - **Request:**
    - Method: `GET`
    - URL: `/store/:id`
  - **Response:**
    - Status 200: `{ ... }`
    - Status 404: `{ "error": "Produsul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare internă." }`
  - **Validări:** id-ul produsului trebuie să existe.
  - **Scenarii:** Vizualizare detalii produs.

- **POST /store/add**
- **addProduct(req, res)**
  - **Descriere:** Adaugă un produs nou în magazin.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "nume": "Jucărie", "pret": 19.99, "detalii": "Pentru câini", "imagine": "https://...", "cantitate": 20 }
      ```
    - (imagine este opțional)
  - **Response:**
    - Status 201: `{ "message": "Produs adăugat cu succes!", "product": { ... } }`
    - Status 500: `{ "error": "Eroare la adăugarea produsului." }`
  - **Validări:** nume, pret, detalii, cantitate obligatorii.
  - **Scenarii:** Adăugare produs nou în shop.

- **PUT /store/:id**
- **updateProduct(req, res)**
  - **Descriere:** Modifică un produs după id.
  - **Request:**
    - Method: `PUT`
    - URL: `/store/10`
    - Body:
      ```json
      { "nume": "Jucărie nouă", "pret": 24.99, "detalii": "Pentru câini", "imagine": "https://...", "cantitate": 15 }
      ```
    - (toate câmpurile sunt opționale, se modifică doar ce se trimite)
  - **Response:**
    - Status 200: `{ "message": "Produs actualizat cu succes.", "product": { ... } }`
    - Status 404: `{ "error": "Produsul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare internă la actualizarea produsului." }`
  - **Validări:** id-ul produsului trebuie să existe.
  - **Scenarii:** Editare produs shop.

- **DELETE /store/:id**
- **deleteProduct(req, res)**
  - **Descriere:** Șterge un produs după id.
  - **Request:**
    - Method: `DELETE`
    - URL: `/store/:id`
  - **Response:**
    - Status 200: `{ "message": "Produsul a fost șters cu succes." }`
    - Status 404: `{ "error": "Produsul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare internă la ștergerea produsului." }`
  - **Validări:** id-ul produsului trebuie să existe.
  - **Scenarii:** Ștergere produs shop.

---

### serviciuController.js

#### serviciuController.js - Detaliere avansată

- **Ruta:** `POST /serviciu/`
- **creareServiciu(req, res)**
  - **Descriere:** Creează un serviciu nou.
  - **Request:**
    - Method: `POST`
    - Body:
      ```json
      { "nume": "Tuns", "pret": 50, "detalii": "Tuns complet" }
      ```
    - (detalii este opțional)
  - **Response:**
    - Status 201: `{ "message": "Serviciu creat cu succes.", "serviciu": { ... } }`
    - Status 400: `{ "error": "Numele și prețul serviciului sunt obligatorii și valide." }`
    - Status 500: `{ "error": "Eroare internă." }`
  - **Validări:** nume și pret obligatorii.
  - **Scenarii:** Adăugare serviciu nou.

- **Ruta:** `PUT /serviciu/:id`
- **modificaServiciu(req, res)**
  - **Descriere:** Modifică un serviciu după id.
  - **Request:**
    - Method: `PUT`
    - URL: `/serviciu/10`
    - Body:
      ```json
      { "nume": "Tuns special", "pret": 60, "detalii": "..." }
      ```
    - (toate câmpurile sunt opționale, se modifică doar ce se trimite)
  - **Response:**
    - Status 200: `{ "message": "Serviciu actualizat.", "serviciu": { ... } }`
    - Status 404: `{ "error": "Serviciul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare internă." }`
  - **Validări:** id-ul serviciului trebuie să existe.
  - **Scenarii:** Editare serviciu.

- **DELETE /serviciu/:id**
- **stergeServiciu(req, res)**
  - **Descriere:** Șterge un serviciu după id.
  - **Request:**
    - Method: `DELETE`
    - URL: `/serviciu/10`
  - **Response:**
    - Status 200: `{ "message": "Serviciu șters cu succes." }`
    - Status 404: `{ "error": "Serviciul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare internă." }`
  - **Validări:** id-ul serviciului trebuie să existe.
  - **Scenarii:** Ștergere serviciu.

- **GET /serviciu/**
- **getServicii(req, res)**
  - **Descriere:** Returnează toate serviciile.
  - **Request:**
    - Method: `GET`
    - URL: `/servicii`
  - **Response:**
    - Status 200: `[ { ... }, ... ]`
    - Status 500: `{ "error": "Eroare la obținerea serviciilor." }`
  - **Scenarii:** Vizualizare servicii.

- **GET /serviciu/:id**
- **getServiciuById(req, res)**
  - **Descriere:** Returnează un serviciu după id.
  - **Request:**
    - Method: `GET`
    - URL: `/servicii/10`
  - **Response:**
    - Status 200: `{ ... }`
    - Status 404: `{ "error": "Serviciul nu a fost găsit." }`
    - Status 500: `{ "error": "Eroare la obținerea serviciului." }`
  - **Validări:** id-ul serviciului trebuie să existe.
  - **Scenarii:** Vizualizare detalii serviciu.

---

### orderController.js

#### orderController.js - Detaliere avansată

- **Ruta:** `POST /order/:id/produs`
- **adaugaProdus(req, res)**
  - **Descriere:** Adaugă un produs într-o comandă existentă.
  - **Request:**
    - Method: `POST`
    - URL: `/comenzi/:id/adauga`
    - Body: `{ "produs_id": 2, "cantitate": 3 }`
  - **Response:**
    - Status 201: `{ "message": "Produsul a fost adăugat în comandă.", "produsAdaugat": { ... } }`
    - Status 400: `{ "error": "Produsul și cantitatea trebuie să fie valide." }`
    - Status 404: `{ "error": "Produsul/Comanda nu a fost găsit(ă)." }`
    - Status 400: `{ "error": "Produsul cu ID ... este deja în comandă." }`
    - Status 500: `{ "error": "A apărut o eroare la adăugarea produsului." }`
  - **Validări:** produs_id, cantitate > 0, comanda și produsul să existe.
  - **Scenarii:** Adăugare produs la comandă.

- **PUT /order/:id/produs/:produs_id**
- **modificaCantitateProdus(req, res)**
  - **Descriere:** Modifică cantitatea unui produs dintr-o comandă.
  - **Request:**
    - Method: `PUT`
    - URL: `/orders/:id/produse/:produs_id`
    - Body: `{ "cantitate": 5 }`
  - **Response:**
    - Status 200: `{ "message": "Cantitatea produsului a fost modificată.", "produsInComanda": { ... } }`
    - Status 400: `{ "error": "Cantitatea trebuie să fie mai mare decât 0." }`
    - Status 404: `{ "error": "Produsul nu este în comandă/nu a fost găsit." }`
    - Status 400: `{ "error": "Stoc insuficient pentru a crește cantitatea." }`
    - Status 500: `{ "error": "A apărut o eroare la modificarea cantității." }`
  - **Validări:** produsul să fie în comandă, cantitate > 0, stoc suficient.
  - **Scenarii:** Modificare cantitate produs comandă.

- **DELETE /order/:id/produs/:produs_id**
- **stergeProdus(req, res)**
  - **Descriere:** Șterge un produs dintr-o comandă.
  - **Request:**
    - Method: `DELETE`
    - URL: `/order/10/produs/2`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Produsul a fost șters din comandă." }`
    - Status 404: `{ "error": "Produsul nu este în comandă/nu a fost găsit." }`
    - Status 500: `{ "error": "A apărut o eroare la ștergerea produsului." }`
  - **Validări:** produsul să fie în comandă.
  - **Scenarii:** Ștergere produs din comandă.

- **DELETE /order/:id**
- **stergeComanda(req, res)**
  - **Descriere:** Șterge o comandă și toate produsele asociate.
  - **Request:**
    - Method: `DELETE`
    - URL: `/order/10`
    - Nu necesită body.
  - **Response:**
    - Status 200: `{ "message": "Comanda și produsele au fost șterse cu succes." }`
    - Status 404: `{ "message": "Comanda nu a fost găsită." }`
    - Status 500: `{ "message": "A apărut o eroare la ștergerea comenzii." }`
  - **Validări:** id-ul comenzii trebuie să existe.
  - **Scenarii:** Ștergere comandă.

---

## Routes (routes)

### cartRoutes.js
- `POST /cos/creaza` → createCart
- `POST /cos/adaugare` → addProductToCart
- `GET /cos/vezi` → getCart
- `POST /cos/finalizeaza` → finalizeOrder
- `DELETE /cos/scoate` → scoateProdusDinCos
- `PUT /cos/modifica` → modificaCantitateProdusInCos

### employeeRoutes.js
- `POST /angajati/` → creeazaAngajat
- `DELETE /angajati/:id` → stergeAngajat
- `PUT /angajati/:id` → modificaAngajat
- `GET /angajati/` → getAngajati

### programareRoutes.js
- `GET /programare/user/:userId` → getProgramariByUserId
- `GET /programare/:id` → getProgramareById
- `POST /programare/creare` → creareProgramare
- `PUT /programare/modifica/:id` → modificaProgramare
- `DELETE /programare/sterge/:id` → stergeProgramare
- `PUT /programare/confirma/:id` → confirmaProgramare
- `GET /programare/pet/:petId` → getProgramariByPet

### reviewRoutes.js
- `POST /recenzii/` → creeazaRecenzie
- `DELETE /recenzii/:id` → stergeRecenzie
- `PUT /recenzii/:id` → modificaRecenzie
- `GET /recenzii/user/:user_id` → getRecenzieByUser
- `GET /recenzii/` → getRecenzii

### userRoutes.js
- `PUT /user/:id` → updateUser
- `DELETE /user/:id` → deleteUser
- `GET /user/:id` → getUserById

### hainaRoutes.js
- `GET /haina/` → getAllHaine
- `GET /haina/:id` → getHainaById
- `POST /haina/add` → addHaina
- `PUT /haina/:id` → updateHaina
- `DELETE /haina/:id` → deleteHaina

### authRoutes.js
- `POST /auth/signup` → registerUser
- `POST /auth/login` → loginUser
- `GET /auth/verify-token` → verifyToken
- `GET /auth/profile` → profil user autentificat

### storeRoutes.js
- `GET /store/` → getAllProducts
- `GET /store/:id` → getProductById
- `POST /store/add` → addProduct
- `PUT /store/:id` → updateProduct
- `DELETE /store/:id` → deleteProduct

### petRoutes.js
- `POST /pet/` → addPet
- `PUT /pet/:id` → updatePet
- `DELETE /pet/:id` → deletePet
- `GET /pet/me` → getPetsByUser
- `GET /pet/:id` → getPetById

### serviciuRoutes.js
- `POST /serviciu/` → creareServiciu
- `PUT /serviciu/:id` → modificaServiciu
- `DELETE /serviciu/:id` → stergeServiciu
- `GET /serviciu/` → getServicii
- `GET /serviciu/:id` → getServiciuById

### orderRoutes.js
- `POST /order/:id/produs` → adaugaProdus
- `PUT /order/:id/produs/:produs_id` → modificaCantitateProdus
- `DELETE /order/:id/produs/:produs_id` → stergeProdus
- `DELETE /order/:id` → stergeComanda

### uploadRoutes.js
- `POST /upload/` → upload imagine
- `POST /upload/review` → upload text recenzie


