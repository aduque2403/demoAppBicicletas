const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'invbici@gmail.com',
        pass: 'qbosvqywfsmktnbq',
    },

});

transporter.verify().then(() => {
    console.log('Ready for send emails');
})

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const clients = await pool.query('SELECT * FROM clients');
    res.render('reparaciones/list', {clients});
});

router.get('/cliente/add', isLoggedIn, (req, res) => {
    res.render('cliente/add');
});

router.post('/cliente/add', isLoggedIn, async (req, res) => {
    const { clientName, clientCode, clientEmail, clientCellPhone } = req.body;
    const newClient = {
        clientName,
        clientCode,
        clientEmail,
        clientCellPhone
    };
    await pool.query('INSERT INTO clients set ?', [newClient]);
    req.flash('success', 'Cliente nuevo agregado.');
    res.redirect('/reparaciones');
});

router.get('/add/:idClient', isLoggedIn, async (req, res) => {
    const { idClient } = req.params;
    const clients = await pool.query('SELECT * FROM clients WHERE idClient = ?', [idClient]);
    res.render('reparaciones/add', {clients: clients[0]});
});

router.post('/add/:idClient', isLoggedIn, async (req, res) => {
    const { idClient } = req.params;
    const { repValor, repDescription } = req.body;
    const { clientEmail } = req.body;
    const { clientId } = idClient;
    const upReparation = {
        repValor,
        repDescription
    };
    await pool.query('INSERT INTO reparations (repDescription, repValor, userId, clientId) VALUES ( ?, ?, ?, ?)', [repDescription, repValor, req.user.idUser, clientId]);

    await transporter.sendMail({
        from : '"INVBICI 🚲" <invbici@gmail.com>',
        to : clientEmail,
        subject : 'Reparación asignada',
        html : `<p>La reparación a sido asiganada con el valor de ${repValor} por el concepto de: ${repDescription}</p>`
    });

    req.flash('success', 'Reparacion asignada.');
    res.redirect('/reparaciones');
});

module.exports = router;