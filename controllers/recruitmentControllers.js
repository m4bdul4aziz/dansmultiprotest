const express = require('express');
const axios = require('axios');
const paginate = require('../utils/paginate');

const recruitment = async(req,res) => {
    
    const { page, perPage, type,description, location } = req.query;

    const response = await axios({
        url: "http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description="+description+"&location="+location,
        method: "get",
    });
    let dataResponse = response.data
    let dataFiltered = []
    dataResponse.forEach(function (val, key) {
    
        if((type && type.includes(val.type))){
            dataFiltered.push(val);
        }
        
    });

    let data = await paginate(dataFiltered, page, perPage);
    
    return res.status(200).send({
        status : true,
        message: '',
        data : data
    });


}

const detailRecruitment =async(req,res) => {

    const response = await axios({
        url: "http://dev3.dansmultipro.co.id/api/recruitment/positions.json",
        method: "get",
    });

    const id = req.params.id
    let dataResponse = response.data

    const data = dataResponse.filter((item) => {
        // condition for agent level 2
        if (
            item.id === id
        ) {
            return item;
        }
    }).pop();

    return res.status(data ? 200 : 400).send({
        status : data ? true : false,
        message: data ? "Success get data" : "Failed get data",
        data : data
    });

}
module.exports =  {
    recruitment,
    detailRecruitment
};