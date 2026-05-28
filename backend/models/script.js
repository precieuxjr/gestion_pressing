import  User  from '../models/users.js';


async function createAdmin() {
    try {
        const adminData = {
            nom: 'MAYELA',
            postnom: 'lema',
            prenom: 'Precieux',
            email: 'mayelaprecieux6@gmail.com',
            password: 'precieuxmayela123', 
            telephone: '+243814996962',
            adresse: 'Bureau principal',
            role: 'admin',
            email_verifie: 1,
            statut: 'actif'
        };
        const admin = new User(adminData);
        await admin.enregistrement(); // utilise votre méthode d'enregistrement
        console.log('Administrateur créé avec succès');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
createAdmin();