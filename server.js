const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/send-message", async (req, res) => {
    try {
        const { name, email, mobile, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            replyTo: email,
            subject: subject || "New Portfolio Message",
            text: `
Name: ${name}
Email: ${email}
Mobile: ${mobile}

Message:
${message}
`
        });

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Message sending failed."
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
});