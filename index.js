const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
app.use(bodyParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATH, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    port: '3306',
    user: 'b56c43b61b70f6',
    password: 'b02520ec',
    database: 'heroku_00b38497b4256c0'
}
var conexao

connect = () => {

    conexao = mysql.createConnection(db_config)

    conexao.connect((err) => {
        if (err) {
            console.log('erro na conexão no banco');
            setTimeout(() => {
                connect()
            }, 10);
        }
    })

    conexao.on('error', (err) => {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect()
        } else {
            throw err
        }
    })
}

connect();

app.listen(process.env.PORT || 2222, () => {
    console.log('Servidor funcionando !')
})

app.get('/', (req, res) => {
    const sql = "select * from users"
    conexao.query(sql, (erro, ln, cl) => {
        res.json({
            data: ln
        })
    })
})

app.post('/', (req, res) => {
    var id = req.params.id
    const sql = "INSERT INTO entregaMotoboy (id_ok) VALUES (?);"
    conexao.query(sql, [id], (erro, result, fields) => {
    })
    res.end()
})