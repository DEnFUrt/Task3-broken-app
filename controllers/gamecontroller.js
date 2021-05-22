var router = require('express').Router();
var Game = require('../db').import('../models/game');

router.get('/all', (req, res) => {
    Game.findAll(
        { 
            where: { owner_id: req.user.id }
        }
    ) 
    .then(
        games => { 
            res.status(200).json(
                {
                    games: games, 
                    message: 'Data fetched.'
                }
            );
        },
    )
    .catch(
        () => res.status(500).json({ message: 'Data not found' })
    );
});

router.get('/:id', (req, res) => {
    Game.findOne(
        { 
            where: { id: req.params.id, owner_id: req.user.id }
        }
    )
    .then(
        game => res.status(200).json({ game: game })
    )
    .catch(
        () => res.status(500).json({ message: 'Data not found.' })
    );
});

router.post('/create', (req, res) => {
    const {title, studio, esrb_rating, user_rating, have_played } = req.body.game;
    
    Game.create(
        {
            title: title,
            owner_id: req.user.id,  
            studio: studio,
            esrb_rating: esrb_rating,
            user_rating: user_rating,
            have_played: have_played
        }
    )
    .then(
        (game) => res.status(200).json(
            {
                game: game,
                message: 'Game created.'
            })
    )
    .catch(
        err => res.status(500).send(err.message)
    );
});

router.put('/update/:id', (req, res) => {
    const {title, studio, esrb_rating, user_rating, have_played } = req.body.game;
    
    Game.update({
        title: title,
        studio: studio,
        esrb_rating: esrb_rating,
        user_rating: user_rating,
        have_played: have_played
    },
        {
            where: {
                id: req.params.id,
                owner_id: req.user.id     
            }
        }
    )
    .then(
        game => res.status(200).json(
            {
                game: game,
                message: 'Successfully updated.'
            })
    )
    .catch(
        err => res.status(500).json({ message: err.message })
    );
});

router.delete('/remove/:id', (req, res) => {
    Game.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(
        game => res.status(200).json(
            {
                game: game,
                message: 'Successfully deleted'
            })
    )
    .catch(
        err => res.status(500).json({ error: err.message })
    );
});

module.exports = router;