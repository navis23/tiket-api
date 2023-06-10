module.exports = app => {
    const tickets = require("../controllers/ticket.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    
 
    r.post("/daftar", tickets.findAll);
    r.post("/simpan", tickets.create);
    r.post("/detail", tickets.show);
    r.post("/update", tickets.update);
    r.post("/hapus", tickets.delete);

    app.use("/tiket-api/api/ticket", r);
}