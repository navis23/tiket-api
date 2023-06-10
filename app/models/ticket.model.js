module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_tiket : {
                type : String,
                required : true
            },
            kode_unik : {
                type : String,
                required : true
            },
            nama : {
                type : String,
                required : true
            },
            telepon: {
                type : String,
                required : true,
            },
            email: {
                type : String,
                required : true,
            },
            tiket_reg: {
                type : Number,
                required : true,
            },
            tiket_vip: {
                type : Number,
                required : true,
            },
            status: {
                type : String,
                required : true,
            },
            total: {
                type : Number,
                required : true,
            },      
            bukti_tf : {
                type : String,
            },
        }, {
            timestamps : true
        }
    );

    schema.method("toJSON", function() {
        const {__v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    });

    // const Category = mongoose.model("categories", schema);
    return mongoose.model("tickets", schema);
    // return Category
}