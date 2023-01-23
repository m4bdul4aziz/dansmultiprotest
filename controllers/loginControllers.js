const express = require('express');
var db = require('../config/database');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async(req,res) => {

    db.query(
        `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
        (err, result) => {
            // user does not exists
            if (err) {
                throw err;
                return res.status(400).send({
                    status : false,
                    message: err
                });
            }

            if (!result.length) {
                return res.status(401).send({
                    status : false,
                    message: 'Email or password is incorrect!'
                });
            }
            // check password
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    
                    // wrong password
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            message: 'Email or password is incorrect!',
                            status : false
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign({id:result[0].id},process.env.TOKEN_KEY,{ expiresIn: '2h' });
                        
                        db.query(
                            `UPDATE users SET token = '${token}' WHERE id = '${result[0].id}'`
                        );

                        return res.status(200).send({
                            status : true,
                            message: 'Success Login!',
                            data : {
                                "token": token,
                                "user" : result[0]
                            }
                        });
                    }
                    return res.status(401).send({
                        message: 'Email or password is incorrect!',
                        status : false
                        
                    });
                }
            );
        }
      );
    
}


module.exports =  {
    login
};