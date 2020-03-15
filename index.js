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
    const sql = "select * from cadastros"
    conexao.query(sql, (erro, ln, cl) => {
        let qtd = ln.reduce((t, v) => t + v.qtd, 0)
        let total = ln.reduce((t, v) => t + v.total, 0)
        res.json({
            qtd: qtd,
            total: total,
            data: ln
        })
    })
})

app.post('/', (req, res) => {
    var qtd = req.body.qtd
    var total = req.body.total
    const sql = "INSERT INTO cadastros (qtd, total) VALUES (?, ?);"
    conexao.query(sql, [qtd, total], (erro, result, fields) => {
    })
    res.end()
})