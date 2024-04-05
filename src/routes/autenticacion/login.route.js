
const express= require('express');
const {login}=require("../../controllers/autenticacion/login.controller");


const router = express.Router();

// Routes
router.post("/login", login);

module.exports=router;
