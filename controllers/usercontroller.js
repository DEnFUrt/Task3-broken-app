var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../db').import('../models/user');

router.post('/signup', (req, res) => {
    const { full_name, username, password, email } = req.body.user;

    if (!password) {
        res.status(400).send('Bad request: user password is not null');
        return;
    };

    User.create({
        full_name: full_name,
        username: username,
        passwordHash: bcrypt.hashSync(password, 10), 
        email: email,
    })
        .then(
            user => {
                const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                res.status(200).json({
                    user: user,
                    token: token
                });
            })
        .catch(
            err => res.status(500).send(err.message)
            );
});

router.post('/signin', (req, res) => {
    const { username, password } = req.body.user;

    User.findOne(
            { 
                where: { username: username } 
            }
        )
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.passwordHash, function (err, matches) {
                    if (matches) {
                        const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                        res.json({
                            user: user,
                            message: 'Successfully authenticated.',
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: 'Passwords do not match.' });
                    };
                });
            } else {
                res.status(403).send({ error: 'User not found.' });
            };
        })
        .catch(
            err => res.status(500).send(err.message)
            );
});

module.exports = router;