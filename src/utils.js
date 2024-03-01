import { dirname } from "path"
import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import { faker } from "@faker-js/faker"
import jwt from "jsonwebtoken"
import config from "./config/config.js"
import multer from "multer"

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const generateProducts = (id) => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.string.numeric(1),
        code: faker.string.alphanumeric(10),
        category: faker.commerce.product(),
        img: faker.image.url(),
        status: true
    }
}

export const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({ email }, config.tokenSecret, { expiresIn: expireTime })
    return token
}

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, config.tokenSecret)
        return info.email
    } catch (error) {
        console.log(error.message)
        return null
    }
}

//configuracion para guardar imagenes usuarios
const validFields = (body) => {
    const { name, email, password } = body;
    if (!name || !email || !password) {
        return false;
    } else {
        return true
    }
};

//filtro para validar los campos antes de cargar la imagen
const multerFilterProfile = (req, file, cb) => {
    const isValid = validFields(req.body);
    if (!isValid) {
        cb(null, false)
    } else {
        cb(null, true)
    }
};

const profileStorage = multer.diskStorage({
    //donde voy a guardar los archivos
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/users/images"))
    },
    //que nombre tendra el archivo que guardamos
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-perfil-${file.originalname}`)
    }
});
//creamos el uploader de multer
export const uploaderProfile = multer({ storage: profileStorage, fileFilter: multerFilterProfile });


//configuracion para guardar documentos de los usuarios
const documentStorage = multer.diskStorage({
    //donde voy a guardar los archivos
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/users/documents"))
    },
    //que nombre tendra el archivo que guardamos
    filename: function (req, file, cb) {
        cb(null, `${req.user.email}-documento-${file.originalname}`)
    }
});
//creamos el uploader de multer
export const uploaderDocument = multer({ storage: documentStorage });



//configuracion para guardar imagenes de productos
const productStorage = multer.diskStorage({
    //donde voy a guardar los archivos
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/products/images"))
    },
    //que nombre tendra el archivo que guardamos
    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-imagen-${file.originalname}`)
    }
});
//creamos el uploader de multer
export const uploaderProduct = multer({ storage: productStorage });