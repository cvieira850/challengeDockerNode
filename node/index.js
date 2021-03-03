const express = require('express')
const faker = require('faker')
const mysql = require('mysql')
const app = express()
const port = 3000

let listNames = []

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const connection = mysql.createConnection(config)

connection.connect((err) => {
    if (err) throw err
    console.log('Database Connected!')
    const table = `create table if not exists people(
        id int primary key auto_increment,
        name varchar(255)not null
    )`

    connection.query(table, (err, result) => {
        if (err) throw err
        const insertName = `INSERT INTO people(name) VALUES("${faker.name.firstName()}")`
        connection.query(insertName, (err, result) => {
            if (err) throw err
            const search = `SELECT * FROM people`
            connection.query(search, (err, result, fields) => {
                result.forEach(element => {
                    listNames.push(element.name)
                });
                connection.end()
            })
        })
    })

})



app.get('/', (req, res) => {
    res.send(`<h1>Full Cycle</h1><h2>Lista de nomes cadastrada no banco de dados</h2><p>${listNames.join(', ')}</p>`)
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})