import http from 'node:http'
import {URL} from 'node:url'

const PORTA = 3000

let tarefas = [
    {id: 1, titulo: 'Lavar louças'},
    {id: 2, titulo: 'Comprar uma RTX 5090'}
]

const servidor = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    //o primeiro argumento do objeto da classe URL é o caminho da API e o segundo argumento é o endereçço onde a API está sendo hospedada
    //mas uma coisa muito importante é que o segundo não é exatamente "onde a API está sendo hospedada", mas sim uma URL base para transforma o primeiro
    //argumento(que pode ser realtivo) em uma URL completa
    const urlObj = new URL(req.url, `http://${req.headers.host}`)

    if(req.method == 'GET' && req.url == '/tarefas'){
        res.statusCode = 200

        res.end(JSON.stringify(tarefas))
    }
    //usamos urlObj.pathname ao invés de req.url, pois estamos verficando se tudo o que vem antes da query string é igual a "/tarefas/busca"
    //pois o req.url retornaria "/tarefas/busca?titulo=algumacoisa", o que não permitiria tratar diferentes atribuiçãos para os parametros da query sting
    else if(req.method == 'GET' && urlObj.pathname == '/tarefas/busca'){
        //o get captura os valores que são atribuidos ao parametro titulo
        const titulo = urlObj.searchParams.get('titulo')

        //o uso do includes se dá pelo fato de permitir que visualizemos se uma string possui aqueles caracteres
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