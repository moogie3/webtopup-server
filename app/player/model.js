const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const HASH_ROUND = 10

let playerSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email harus diisi']
    },
    name: {
        type: String,
        require: [true, 'Nama harus diisi'],
        maxlength: [225, 'panjang nama harus antara 3 - 225 karakter'],
        minlength: [3, 'panjang nama harus antara 3 - 225 karakter']
    },
    username: {
        type: String,
        require: [true, 'Nama harus diisi'],
        maxlength: [225, 'panjang username harus antara 3 - 225 karakter'],
        minlength: [3, 'panjang username harus antara 3 - 225 karakter']
    },
    password: {
        type: String,
        require: [true, 'Kata sandi harus diisi'],
        maxlength: [225, 'panjang password maksimal 255 karakter']
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    avatar: {
        type: String,
        fileName: { type: String }
    },
    phoneNumber: {
        type: String,
        require: [true, 'nomor telepon harus diisi'],
        maxlength: [13, 'panjang nomor telefon harus antara 9 - 13 karakter'],
        minlength: [9, 'panjang nomor telefon harus antara 9 - 13 karakter']
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }

}, { timestamps: true })

playerSchema.path('email').validate(async function (value) {
    try {
        const count = await this.model('Player').countDocuments({ email: value })
        return !count;
    } catch (err) {
        throw err
    }
}, `Email sudah terdaftar, silahkan gunakan email lain`);

playerSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Player', playerSchema) 