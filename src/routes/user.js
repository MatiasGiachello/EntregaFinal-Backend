import { Router } from "express";
import { checkRole } from "../middlewares/auth.js";
import { userModel } from "../dao/models/user.js";
import { uploaderDocument } from "../utils.js";

const router = Router();

router.put("/premium/:uid", checkRole(["admin"]), async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await userModel.findById(userId)
        const userRol = user.role
        if (user.documents.length < 3 && user.status !== "completo") {
            return res.json({ status: "error", message: "El usuario no ha subido todos los documentos" });
        }
        if (userRol === "user") {
            user.role = "premium"
        } else if (userRol === "premium") {
            user.role = "user"
        } else {
            return res.json({ status: "error", message: "no es posible cambiar el role del usuario" });
        }
        await userModel.updateOne({ _id: user._id }, user)
        res.send({ status: "success", message: "Rol Modificado" });
    } catch (error) {
        console.log(error.message)
        res.json({ error: error, message: "Hubo un error al cambiar el Rol del Usuario" })
    }
});

router.post("/:uid/documents", uploaderDocument.fields([{ name: "identificacion", maxCount: 1 }, { name: "domicilio", maxCount: 1 }, { name: "estadoDeCuenta", maxCount: 1 }]), async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await userModel.findById(userId)
        if (user) {
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            const docs = []

            if (identificacion) {
                docs.push({ name: "identificacion", reference: identificacion.filename })
            }

            if (domicilio) {
                docs.push({ name: "domicilio", reference: domicilio.filename })
            }

            if (estadoDeCuenta) {
                docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename })
            }

            if (docs.length === 3) {
                user.status = "completo"
            } else {
                user.status = "incompleto"
            }
            user.documents = docs
            const userUpdated = await userModel.findByIdAndUpdate(user._id, user)
            res.json({ status: "sucess", message: "Documentos Actualizados" })
        } else {
            res.json({ status: "error", message: "no es posible cargar los documentos" })
        }
    } catch (error) {
        console.log(error.message);
        res.json({ status: "error", message: "hubo un error al cargar los documentos" })
    }
})

export default router;