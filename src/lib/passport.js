const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'userEmail',
    passwordField: 'userPassword',
    passReqToCallback: true
}, async (req, userEmail, userPassword, done) => {
    
    const rows = await pool.query('SELECT * FROM users WHERE userEmail = ?', [userEmail]);
    if(rows.length > 0) {
        const user = rows[0];
        const vailPassword = await helpers.matchPassword(userPassword, user.userPassword);
        if(vailPassword){
            done(null, user, req.flash('success','Bienvenido ' + user.userName));
        } else {
            done(null, false, req.flash('message','Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','El nombre de usuario no existe.'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'userPassword',
    passReqToCallback: true
}, async (req, userName, userPassword, done) => {
    const { userEmail } = req.body;
    const newUser = {
        userName,
        userPassword,
        userEmail
    };
    newUser.userPassword = await helpers.encryptPassword(userPassword);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.idUser = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.idUser);
});

passport.deserializeUser(async (idUser, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE idUser = ?', [idUser]);
    done(null, rows[0]);
});