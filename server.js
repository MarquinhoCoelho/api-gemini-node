import Fastify from 'fastify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from '@fastify/cors'

const server = Fastify();

// CORS
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyDjPAGqQDYiYn-SnanniO86NJdBvagIbDQ");

server.get('/', () => {
    return 'Omelete FEIO !!!!'
})

server.post('/login', (request, reply) => {
    console.log(request.body);

    const usuario = {
        email: 'jotinha@123',
        senha: '123'
    }

    if (usuario.email === request.body.email && usuario.senha === request.body.senha) {
        return reply.status(201).send('USUARIO PODE ENTRAR');
    } else {
        return reply.status(400).send('EMAIL OU SENHA INVÁLIDOS!');
    }

})

server.post('/pergunta', async (request, reply) => {
    console.log(request.body);

    if (request.body.pergunta) {
        const resposta = await perguntar(request.body.pergunta);
        return reply.status(201).send(
            {resposta}  
        );
    } else {
        return reply.status(400).send('pergunta inválida');
    }

});

async function perguntar(pergunta) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

  const prompt = pergunta;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}


server.listen({
    port: 3333
});