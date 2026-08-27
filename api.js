import http from 'node:http'
import {URL} from 'node:url'

const PORTA = 3000

let tarefas = [
    {id: 1, titulo: 'Lavar louças'},
    {id: 2, titulo: 'Comprar uma RTX 5090'}
]

const servidor = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    const urlObj = new URL(req.url, `http://${req.headers.host}`)

    if(req.method == 'GET' && req.url == '/tarefas'){
        res.statusCode = 200

        res.end(JSON.stringify(tarefas))
    }
    else if(req.method == 'GET' && urlObj.pathname == '/tarefas/busca'){
        const titulo = urlObj.searchParams.get('titulo')

        const tituloEncotrado = tarefas.filter(tarefa => tarefa.titulo.includes(titulo))

        res.end(JSON.stringify(tituloEncotrado))
    }
    else if(req.method == 'POST' && req.url == "/tarefa"){
        let body = ''

        req.on('data', (chunk /*um pedaço de informaações*/) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            try{
                const novaTarefa = JSON.parse(body)

                if(!novaTarefa.titulo){
                    res.statusCode = 400
                    res.end(JSON.stringify({error: `O campo titulo é obrigatório`}))
                }
                
                const tarefaCriada = {
                    id: tarefas.length++,
                    titulo: novaTarefa.titulo
                }

                tarefas.push(tarefaCriada)

                res.statusCode = 201
                res.end(JSON.stringify(tarefaCriada))
            } 
            catch(erro){
                res.statusCode = 400
                res.end(JSON.stringify({error: "Formato JSON inválido!"}))
            }
        })
    }
    else{
        res.statusCode = 404
        res.end(JSON.stringify({error: 'Página não encontrada'}))
    }
})

servidor.listen(PORTA, () => {
    console.log(`Servidor rodando na porta: ${PORTA}`)
})