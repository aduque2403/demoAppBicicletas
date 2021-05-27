const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('inventario/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { invName, invModel, invDescription } = req.body;
    const newInv = {
        invName,
        invModel,
        invDescription
    };
    await pool.query('INSERT INTO inventory set ?', [newInv]);
    req.flash('success', 'Producto agregado con exito.');
    res.redirect('/inventario');
});

router.get('/', isLoggedIn, async (req, res) => {
    const inventory = await pool.query('SELECT * FROM inventory');
    res.render('inventario/list', {inventory});
});

router.get('/delete/:idInv', isLoggedIn, async (req, res) => {
    const { idInv } = req.params;
    await pool.query('DELETE FROM inventory WHERE idInv = ?', [idInv]);
    req.flash('success', 'El producto fue eliminado de manera exitosa.');
    res.redirect('/films');
});

router.get('/edit/:idInv', isLoggedIn, async (req, res) => {
    const { idInv } = req.params;
    const inventory = await pool.query('SELECT * FROM inventory WHERE idInv = ?', [idInv]);
    res.render('inventario/edit', {inventory: inventory[0]});
});

router.post('/edit/:idInv', isLoggedIn, async (req, res) => {
    const { idInv } = req.params;
    const { invName, invModel, invDescription } = req.body;
    const upInv = {
        invName,
        invModel,
        invDescription
    };
    await pool.query('UPDATE inventory set ? WHERE idInv = ?', [upInv, idInv]);
    req.flash('success', 'Producto actualizado de manera exitosa.');
    res.redirect('/films');
});

module.exports = router;