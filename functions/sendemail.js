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

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "virtuosagency@gmail.com", // Ton adresse Gmail d'envoi
                pass: "lxrf sscx amqk rcif", // Remplace par ton mot de passe d'application Gmail
            },
        });

        let mailOptions = {
            from: `"${name}" <${email}>`,
            to: "virtuosagency@gmail.com", // Adresse où tu reçois les messages
            subject: subject,
            text: message,
        };

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
