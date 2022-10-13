/* ============= INICIO DE ROUTEO ============= */
import express from 'express';
import fs from 'fs'
const routerInitial = express.Router();

/* ============ Creacion de objeto ============ */
import { ContenedorSQLite } from '../container/ContenedorSQLite.js';
import { ContenedorFirebase } from "../container/ContenedorFirebase.js";
import { productoMock } from '../mocks/producto.mock.js';
import { auth } from '../../server.js';
const cajaMensajes = new ContenedorFirebase('mensajes');
const cajaProducto = new ContenedorSQLite('productos');

/* ============= Routing y metodos ============= */
routerInitial.get('/', auth, async (req, res) => {
    const usuario = req.session.usuario;
    const DB_PRODUCTOS = await cajaProducto.listarAll()
    const DB_MENSAJES = await cajaMensajes.getAll()
    res.render('vista', {DB_PRODUCTOS, DB_MENSAJES, usuario})
})

routerInitial.get('/login', async (req, res) => {
    const { usuario } = req.query
    if (!usuario) {
        if (!req.session.contador) {
            req.session.contador = 1
            res.render('login') 
        } else {
            const errorLogin = 'Debe ingresar un usuario'
            req.session.contador++
            res.render('login', {errorLogin})
        }
    } else {
        req.session.usuario = usuario
        res.redirect('/')
    }
})

routerInitial.get('/logout', async (req, res) => {
    req.session.destroy( error => console.log(error) )
    setTimeout(()=>{
        res.redirect('/login')
    }, 5000)
})

routerInitial.get('/api/productos-test', auth, async (req, res) => {
    const cajaRandom = new productoMock();
    let productos = cajaRandom.generarDatos()
    res.render('productos-test', {productos})
})

/* =========== Exportacion de modulo =========== */
export default routerInitial;