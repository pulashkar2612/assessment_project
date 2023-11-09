const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const db = require('_helpers/db');
const User = db.User;

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.patch('/logout/:id', logout);
router.get('/audit/:id', getAudit);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

async function register(req, res, next) {
    try{
        await userService.create(req.body)
        res.status(200).json({message : "registed successfully", data : req.body});
    }catch(err){
        next(arr);
    }
    
        // .then((data) => res.json({message: "registered succesfully", data: data}))
        // .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function logout(req, res, next) {
    userService.logout(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

async function getAudit(req, res, next) {
    const id = req.params.id;
    try{
        const user = await User.findById(id);
        console.log("use", user);
        if(user.role === "AUDITOR"){
            const data = await User.find().select('-hash');
            if(data){
                res.status(200).json(data);
            }
        }else{
            res.status(401).json(err); 
        }
    }catch(err){
        next(err);
    }       
}