require("dotenv").config(); // Charge les variables d'environnement en local

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ success: false, message: "Méthode non autorisée" }),
            };
        }

        const { name, email, subject, message } = JSON.parse(event.body);

        if (!name || !email || !subject || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "Tous les champs sont requis." }),
            };
        }

        // Vérification des variables d'environnement
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Erreur : Les variables d'environnement EMAIL_USER et EMAIL_PASS ne sont pas définies.");
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, message: "Erreur serveur. Variables d'environnement manquantes." }),
            };
        }

        // Création du transporteur Nodemailer
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Adresse email sécurisée via les variables d'environnement
                pass: process.env.EMAIL_PASS, // Mot de passe sécurisé via les variables d'environnement
            },
        });

        // Configuration du mail
        let mailOptions = {
            from: `"${name}" <${email}>`, // Expéditeur
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER, // Destinataire
            subject: subject,
            text: message,
        };

        // Envoi de l'email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "E-mail envoyé !" }),
        };
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Erreur serveur. Impossible d'envoyer l'e-mail." }),
        };
    }
};
