const db = require("../models")
const Ticket = db.tickets;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Ticket.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Ticket.find({ email : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .sort({ createdAt : -1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
            page : currentPage,
            limit : perPage,
            search : search
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''
    // let galleries_temp = []

    await Ticket.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'TKT0000' : result[result.length - 1].kode_tiket

        const checkKode = result.length == 0 || null ? 'TKT0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits).slice(-4);
                generateKode = strings + digits;
        
        // for(let i = 0; i < req.files['galleries'].length; i++) {
        //     galleries_temp.push(req.files['galleries'][i].path)
        // }

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })

        if(req.files['bukti_tf'][0]) {
            fs.unlinkSync(path.join(req.files['bukti_tf'][0].path));
        }
    });
    
    const ticket = await new Ticket({
        kode_tiket : generateKode,
        kode_unik : req.body.kode_unik,
        nama : req.body.nama,
        telepon : req.body.telepon,
        email : req.body.email,
        tiket_reg : req.body.tiket_reg,
        tiket_vip : req.body.tiket_vip,
        status : req.body.status,
        total : req.body.total,
        bukti_tf : req.body.bukti_tf,

    })

    // console.log(req.files['bukti_tf'][0])

    await ticket.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new category data.",
        })

        if(req.files['bukti_tf'][0]) {
            fs.unlinkSync(path.join(req.files['bukti_tf'][0].path));
        }

    })
}

exports.show = async (req, res) => {
    await Ticket.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send({
            data : result
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}

exports.delete = async (req, res) => {

    await Ticket.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Ticket.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
            fs.unlink(
                path.join(result.bukti_tf),
                (err) => console.log(err + ' file bukti_tf berhasil dihapus')
            );

        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving category data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}

exports.update = async (req, res) => {

    await Ticket.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        
        
        console.log('begining')

        console.log(result.bukti_tf)
        if(req.files['bukti_tf'] != undefined && result.bukti_tf != "") {
            fs.unlinkSync(path.join(result.bukti_tf));
            console.log('deleting one lg')
        } else {
            console.log('passed 1')
        }
        

        await Ticket.updateOne({_id : result.id}, { 
            $set : {
                status : req.body.status ? req.body.status : result.status,
                bukti_tf : req.files['bukti_tf'] ? req.files['bukti_tf'][0].path : result.bukti_tf,
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new category data.",
            })
            
            if(req.files['bukti_tf'][0]) {
                fs.unlinkSync(path.join(req.files['bukti_tf'][0].path));
            }

        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}

exports.dashboard = async (req, res) => {

   
    let totalItems;

    await Ticket.find()
    .countDocuments()
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}