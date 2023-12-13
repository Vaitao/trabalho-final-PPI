import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
const PORT = 3000;
const app = express();
app.use(cookieParser());
app.use(session({
  secret: "FUN4D4",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}))
app.get("/sair", sair);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src")));
function autenticar(req, res, next) {
  if (req.session.usuarioAutenticado) {
    next();
  }
  else {
    res.redirect("/login.html");
  }
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
var recebe = [];
var usuarios_cadastrados = [];



app.post("/login", (req, res) => {
  const login = req.body.username;
  const senha = req.body.senha;

  if (login === 'Vaitao' && senha === '1234') {
    req.session.usuarioAutenticado = true;
    res.redirect("/");
  }

  else {
    let erro = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Erro no Login</title>
      <style>
        /* Estilos para a página de erro */
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f2f2f2;
          text-align: center;
        }
    
        .error-message {
          margin-bottom: 20px;
          color: #FF0000;
        }
    
        button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
    
        button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="error-message">
        <h2>Ocorreu um erro no login</h2>
        <p>Por favor, verifique suas credenciais e tente novamente.</p>
      </div>
      <a href="login.html">
      <button">Voltar ao Login</button>
      </a>
    
    </body>
    </html>
    `;
    res.end(erro);
  }
})

app.get("/chat",autenticar, (req, res) => {
  let mensagem = `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Chat</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
  
      .chat-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-family: Arial, sans-serif;
      }
  
      .chat-messages {
        border: 1px solid #ccc;
        min-height: 300px;
        margin-bottom: 10px;
        padding: 10px;
        overflow-y: scroll;
      }
  
      .chat-input {
        display: flex;
        margin-top: 10px;
      }
  
      .chat-input select, .chat-input input[type="text"] {
        flex: 1;
        padding: 8px;
        margin-right: 5px;
      }
  
      .chat-input button {
        padding: 8px 15px;
        background-color: #333;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
  
      .chat-input button:hover {
        background-color: #555;
      }
    </style>
  </head>
  <body>
  <a href="/">
  <button>Voltar ao menu inicial</button>
  </a>
  
  
  <div class="chat-container">
  `
  for (let dados of recebe) {

    mensagem += `
    <div class="chat-messages" id="chatMessages">
    <h6>${dados.nome}</h6>
    <p>enviado no dia ${dados.data} as ${dados.hora}</p>
    <p>${dados.mensagem}</p>

    </div>
    `
  }
  mensagem += `
    <div class="chat-input">
    <form action="/postar_mensagem" method="post">
      <select id="users" name="usuario">
      <option value="">selecione um usuario</option>
      `
  for (let dados of usuarios_cadastrados) {
    mensagem += `<option value="${dados.nick}">${dados.nome}</option>`
  }
  mensagem += `
      </select>
      
      <input type="text" id="message" name="mensagem" placeholder="Digite sua mensagem">
      <input type="submit" value="Enviar">
    </div>
    </form>
  </div>
  
  
  </body>
  </html>`;
  res.end(mensagem);
})

app.post("/postar_mensagem", autenticar, (req, res) => {
  const nome_usuario = req.body.usuario;
  const mensagem_usuario = req.body.mensagem;

  if (nome_usuario == '' || mensagem_usuario == '') {
    let mensagem = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Chat</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
    
        .chat-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-family: Arial, sans-serif;
        }
    
        .chat-messages {
          border: 1px solid #ccc;
          min-height: 300px;
          margin-bottom: 10px;
          padding: 10px;
          overflow-y: scroll;
        }
    
        .chat-input {
          display: flex;
          margin-top: 10px;
        }
    
        .chat-input select, .chat-input input[type="text"] {
          flex: 1;
          padding: 8px;
          margin-right: 5px;
        }
    
        .chat-input button {
          padding: 8px 15px;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
    
        .chat-input button:hover {
          background-color: #555;
        }
      </style>
    </head>
    <body>
    <a href="/">
    <button>Voltar ao menu inicial</button>
    </a>
    <div class="chat-container">
    `
    for (let dados of recebe) {

      mensagem += `
      <div class="chat-messages" id="chatMessages">
      <h6>${dados.nome}</h6>
      <p>enviado no dia ${dados.data} as ${dados.hora}</p>
      <p>${dados.mensagem}</p>
  
      </div>
      `
    }
    mensagem += `
      <div class="chat-input">
      <form action="/postar_mensagem" method="post">`
    if (nome_usuario == '') {
      mensagem += `<select id="users" name="usuario" style = "border: 5px solid red">`;

    }

    else {
      mensagem += `<select id="users" name="usuario">`;
    }
    mensagem += `<option value="">selecione um usuario</option>`;

    for (let dados of usuarios_cadastrados) {
      mensagem += `<option value="${dados.nick}">${dados.nome}</option>`
    }
    mensagem += `
        </select>`;
    if (mensagem_usuario == '') {

      mensagem += `<input type="text" id="message" name="mensagem" value="${mensagem_usuario}" placeholder="Digite sua mensagem" style = "border: 5px solid red">`
    }

    else {
      mensagem += `<input type="text" id="message" name="mensagem" value="${mensagem_usuario}" placeholder="Digite sua mensagem">`
    }


    mensagem += `<input type="submit" value="Enviar">
      </div>
      </form>
    </div>
    
    
    </body>
    </html>`;
    res.end(mensagem);

  }

  else {
    const data = new Date();
    const recebe_td = {
      nome: nome_usuario,
      mensagem: mensagem_usuario,
      data: data.toLocaleDateString(),
      hora: data.toLocaleTimeString()
    };
    recebe.push(recebe_td);
    let mensagem = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Chat</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
    
        .chat-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-family: Arial, sans-serif;
        }
    
        .chat-messages {
          border: 1px solid #ccc;
          min-height: 300px;
          margin-bottom: 10px;
          padding: 10px;
          overflow-y: scroll;
        }
    
        .chat-input {
          display: flex;
          margin-top: 10px;
        }
    
        .chat-input select, .chat-input input[type="text"] {
          flex: 1;
          padding: 8px;
          margin-right: 5px;
        }
    
        .chat-input button {
          padding: 8px 15px;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
    
        .chat-input button:hover {
          background-color: #555;
        }
      </style>
    </head>
    <body>
    <a href="/">
    <button>Voltar ao menu inicial</button>
    </a>
    <div class="chat-container">
    `
    for (let dados of recebe) {

      mensagem += `
      <div class="chat-messages" id="chatMessages">
      <h6>${dados.nome}</h6>
      <p>enviado no dia ${dados.data} as ${dados.hora}</p>
      <p>${dados.mensagem}</p>
  
      </div>
      `
    }
    mensagem += `
      <div class="chat-input">
      <form action="/postar_mensagem" method="post">
        <select id="users" name="usuario">
        <option value="">selecione um usuario</option>
        `
    for (let dados of usuarios_cadastrados) {
      mensagem += `<option value="${dados.nick}">${dados.nome}</option>`
    }
    mensagem += `
        </select>
        
        <input type="text" id="message" name="mensagem" placeholder="Digite sua mensagem">
        <input type="submit" value="Enviar">
      </div>
      </form>
    </div>
    
    
    </body>
    </html>`;
    res.end(mensagem);
  }

})

app.get('/', autenticar, (req, res) => {
  const ultimoacesso = req.cookies.ultimoacesso;
  const data = new Date();
  res.cookie("ultimoacesso", data.toLocaleDateString() + '' + data.toLocaleTimeString(), {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
  });
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Menu</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
    
        nav {
          background-color: #333;
          text-align: center;
        }
    
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
    
        li {
          display: inline;
          margin-right: 20px;
        }
    
        a {
          text-decoration: none;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          padding: 10px;
          transition: all 0.3s ease;
        }
    
        a:hover {
          background-color: #555;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
    
    <nav>
      <ul>
        <li><a href="/sair">sair</a></li>
        <li><a href="/chat">Bate-Papo</a></li>
        <li><a href="/cadastro">Cadastro de Usuários</a></li>
        <li><a href="#">seu ultimo acesso foi: ${ultimoacesso}</a></li>
      </ul>
    </nav>
        
    
    </body>
    </html>
    
        `);
});


app.get('/cadastro', autenticar, (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Cadastro de Usuário</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
    
        form {
          max-width: 400px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-family: Arial, sans-serif;
        }
    
        label {
          display: block;
          margin-bottom: 5px;
        }
    
        input[type="text"],
        input[type="date"] {
          width: calc(100% - 12px);
          padding: 8px;
          margin-bottom: 15px;
        }
    
        input[type="submit"] {
          background-color: #333;
          color: #fff;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
    
        input[type="submit"]:hover {
          background-color: #555;
        }
      </style>
    </head>
    <body>
    
    <form action="/validacao_usuario" method="post">
      <label for="nickname">Nickname:</label>
      <input type="text" id="nickname" name="nickname">
    
      <label for="nome">Nome:</label>
      <input type="text" id="nome" name="nome">
    
      <label for="dataNascimento">Data de Nascimento:</label>
      <input type="date" id="dataNascimento" name="dataNascimento">
    
      <input type="submit" value="Cadastrar">
    </form>
    
    </body>
    </html>
    `);
});

app.post('/validacao_usuario', autenticar, (req, res) => {
  var teste = 10;

  if (req.body.nickname != '') {
    var conteudo = `<!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <title>Formulário de Cadastro</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
        
            form {
              max-width: 400px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-family: Arial, sans-serif;
            }
        
            label {
              display: block;
              margin-bottom: 5px;
            }
        
            input[type="text"],
            input[type="date"] {
              width: calc(100% - 12px);
              padding: 8px;
              margin-bottom: 15px;
            }
        
            input[type="submit"] {
              background-color: #333;
              color: #fff;
              padding: 10px 15px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
        
            input[type="submit"]:hover {
              background-color: #555;
            }
          </style>
        </head>
        <body>
        
        <form action="/validacao_usuario" method="post">
          <label for="nickname">Nickname:</label>
          <input type="text" id="nickname" name="nickname" value="${req.body.nickname}">`
  }

  else {
    teste = 0;
    var conteudo = `<!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <title>Formulário de Cadastro</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
        
            form {
              max-width: 400px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-family: Arial, sans-serif;
            }
        
            label {
              display: block;
              margin-bottom: 5px;
            }
        
            input[type="text"],
            input[type="date"] {
              width: calc(100% - 12px);
              padding: 8px;
              margin-bottom: 15px;
            }
        
            input[type="submit"] {
              background-color: #333;
              color: #fff;
              padding: 10px 15px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
            p{
              color: red;
            }
        
            input[type="submit"]:hover {
              background-color: #555;
            }
          </style>
        </head>
        <body>
        
        <form action="/validacao_usuario" method="post">
          <label for="nickname">Nickname:</label>
          <input type="text" id="nickname" name="nickname" value="${req.body.nickname}">
          <p>digite algo no campo do nickname</p>`
  }

  if (req.body.nome != '') {
    conteudo += ` <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome" value="${req.body.nome}">`
  }
  else {
    teste = 0;

    conteudo += ` <label for="nome">Nome:</label>
      <input type="text" id="nome" name="nome" value="${req.body.nome}">
      <p>Digite algo nesse campo</p>`
  }

  if (req.body.dataNascimento != '') {
    conteudo += `<label for="dataNascimento">Data de Nascimento:</label>
      <input type="date" id="dataNascimento" name="dataNascimento" value="${req.body.dataNascimento}">
    
      <input type="submit" value="Enviar">
    </form>
    
    </body>
    </html>`
  }

  else {
    teste = 0;

    conteudo += `<label for="dataNascimento">Data de Nascimento:</label>
      <input type="date" id="dataNascimento" name="dataNascimento" value="${req.body.dataNascimento}">
      <p>Dite algo nesse campo</p>
    
      <input type="submit" value="Enviar">
    </form>
    
    </body>
    </html>`
  }
  const user = {
    nick: req.body.nickname,
    nome: req.body.nome,
    data: req.body.dataNascimento
  }
  if (teste == 10) {
    usuarios_cadastrados.push(user);
    var tabela = '';
    tabela = `<!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Usuários Cadastrados</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f2f2f2;
          }
      
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
      
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
      
          th {
            background-color: #4CAF50;
            color: white;
          }
        </style>
      </head>
      <body>
        <h2>Usuários Cadastrados</h2>
        <table>
          <thead>
            <tr>
              <th>nome de usuario</th>
              <th>Apelido</th>
              <th>data de nascimento</th>
            </tr>
          </thead>
          <tbody>
            `;
    for (let dados of usuarios_cadastrados) {
      tabela += `<tr>
              <td>${dados.nome}</td>
              <td>${dados.nick}</td>
              <td>${dados.data}</td>
            </tr>`;
    }
    tabela += `
          </tbody>
        </table>
        <a href="/">
        <button>Voltar ao menu</button>
        </a>
        <a href="/cadastro">
        <button>Continuar cadastrando</button>
        </a>
      </body>
      </html>
      `;
    res.end(tabela);
  }
  else {
    res.send(conteudo);
  }


})
function sair(requisicao, resposta) {
  requisicao.session.usuarioAutenticado = false;
  resposta.redirect('/login.html');}
