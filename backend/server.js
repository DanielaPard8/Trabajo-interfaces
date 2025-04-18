require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');


const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());

//Configurar el pool de conexiones a PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


app.post('/register', async (req, res) => {
    //Vamos a acceder a los datos enviados desde el formulario.
    const datosUsuario = req.body;
    //Obtenemos la contraseña para posteriormente hashearla.
    const contrasenia = datosUsuario.contraseña;
    //Desestructuramos el objeto datosUsuario para quitar la contraseña actual y para posteriormente colocar la contraseña hasheada.
    // "restoDeDatos" es el nuevo objeto que tiene todos los datos que ingreso el usuario pero sin la contraseña.
    const {contraseña, ...restoDeDatos} = datosUsuario;
    try {
        //Generamos un salt (aleatorio) para mejorar la seguridad.
        const salt = await bcrypt.genSalt(10);

        //Pasamos a hashear la contraseña utilizando el salt.
        const contraseñaHasheada = await bcrypt.hash(contrasenia, salt);
        console.log("Contraseña hasheada: ", contraseñaHasheada);
        //Aqui se definen columnas, donde las columnas tienen todas las claves de "restoDeDatos".
        const columnas = Object.keys(restoDeDatos);
        //Aqui se define los valores, donde se almacenan los valores de "restoDeDatos."
        const valores = Object.values(restoDeDatos);
        //Aqui creamos una nueva columna con el nombre de "contraseña"
        columnas.push('contraseña');
        //Aqui creamos un valor para esa columna llamada contraseña y contendra la contraseña hasheada.
        valores.push(contraseñaHasheada);

        //Tomamos el array "valores" para extraer los indices de cada elemento y lo almacenamos como un string en "posiciones."
        const posiciones = valores.map((_, index) => `$${index + 1}`).join(", ");
        //Tomamos el array columnas y lo almacenamos como un string en "nombreColumna".
        const nombreColumna = columnas.join(", ");
        //Se crea la consulta SQL para agregar un usuario a la tabla usuarios.
        const query = `INSERT INTO usuarios (${nombreColumna}) VALUES (${posiciones})`;
        //Enviamos la consulta a la base para que almacene los datos a la tabla.
        const result = await pool.query(query, valores);
        console.log("Usuario registrado con exito.", result.rows[0]);
        res.status(201).json({message: "Usuario registrado correctamente.", user: result.rows[0]});




    } catch (error) {
        console.error("Error al registrar al usuario: ", error);
        res.status(500).json({error: "Error al procesar el registro."});
    }
    

    //Responder al cliente.
    res.status(200).json({message: "Formulario recibido correctamente."});
})

app.listen(port, () =>{
    console.log(`Servidor escuchando en http://localhost:${port}`);
});