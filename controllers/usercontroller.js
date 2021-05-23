const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes');

const User = require('../db').import('../models/user');

router.post('/signup', (req, res) => {
    const { full_name, username, password, email } = req.body.user;

    if (!password) {
        res.status(StatusCodes.BAD_REQUEST).send('Bad request: user password cannot be empty');
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
                res.status(StatusCodes.OK).json({
                    user: user,
                    token: token
                });
            })
        .catch(
            err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
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
                        res.status(StatusCodes.OK).json({
                            user: user,
                            message: 'Successfully authenticated.',
                            sessionToken: token
                        });
                    } else {
                        res.status(StatusCodes.BAD_GATEWAY).send({ error: 'Passwords do not match.' });
                    };
                });
            } else {
                res.status(StatusCodes.FORBIDDEN).send({ error: 'User not found.' });
            };
        })
        .catch(
            err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
            );
});

module.exports = router;