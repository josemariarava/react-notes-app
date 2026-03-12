import express from 'express'
const router = express.Router()
import Note from '../models/noteModel.js'

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find()
        res.status(200).json(notes)
    } catch (error) {
        console.error("Error al devolver las notas", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const note = await Note.findById(id)
        if (!note) return res.status(404).json({ error: "Nota no encontrada" })

        res.status(200).json(note)

    } catch (error) {
        console.error("Error al devolver las notas", error)
        res.status(500).json({ error: "Internal server error" })
    }


})

//Crear una nueva nota
router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body

        if (!title || !description) {
            return res.status(400).json({ error: "Título y descripción son requeridos" })
        }

        const nuevaNota = new Note({ title, description })



        const savedNote = await nuevaNota.save()
        if (savedNote) {
            res.status(201).json({
                message: "Nota creada correctamente",
                note: savedNote //note: en json() = Etiqueta del JSON (lo que ve el cliente)
            })
        }
    } catch (error) {
        console.error("Error al crear la nota", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Eliminar nota
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deletedNote = await Note.findByIdAndDelete(id)

        if(!deletedNote) return res.status(404).json({ error: "Nota no eliminada" })
        
        res.status(200).json({ 
            message: "Nota eliminada correctamente",
            deletedNoteId: deletedNote._id 
        })
    } catch (error) {
        console.error("Error al eliminar la nota", error)
        res.status(500).json({ error: "Internal server error" })
    }

})

router.put("/:id", async (req, res) => {
    try {
        const id  = req.params.id
        const {title, description} = req.body

        // Validación básica (recomendado)
        if (!title || !description) {
            return res.status(400).json({ error: "Título y descripción son requeridos" })
        }

        const updatedNote = await Note.findByIdAndUpdate(id, { title, description }, { returnDocument: 'after', runValidators: true  })
        // const updatedNote = await Note.findByIdAndUpdate(id, { title, description }, { new: true })
        if(!updatedNote) return res.status(404).json({ error: "Note no actualizada correctamente" })
        
        res.status(200).json({
            message: "Nota actualizada correctamente",
            note: updatedNote
        })

    } catch (error) {
        console.error("Error al editar la nota", error)
        res.status(500).json({ error: "Internal server error" })
    }
   
})

export default router
