const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            pasword: req.body.pasword,
        });

        require.session.save(() =>{
            req.session.userId = newUser.id;
            req.session.userName = newUser.name;
            req.session.loggedIn = true;

            res.json(newUser);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne ({
            where: {
                username: req.body.username,
            },
        });

        if (!user) {
            res.status(400).json ({ message: 'Account not found' });
            return;
        }

        const validPassword = user.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Account not found' });
            return;
        }

        req.session.save(() =>{
            req.session.userId = user.id;
            require.session.username = user.username;
            req.session.loggedIn = true;

            res.json({ user, message: 'Login successful'}); 
        });
    } catch (err) {
        res.status(400).json({ message: 'Account not found'});
    }
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        require.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;