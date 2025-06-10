import { useState } from "react"; // Importa o hook useState para controle de estados no React
import axios from "axios"; // Importa o axios para fazer requisições HTTP
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegação programática

export default function CadastroAutor() {
  // Define os estados do componente, que armazenam os dados do formulário e o resultado da requisição
  const [nome, setNome] = useState(""); // Estado para o nome do autor
  const [pais, setPais] = useState(""); // Estado para o país do autor
  const [mensagem, setMensagem] = useState(""); // Para mensagens de sucesso ou erro

  const navigate = useNavigate(); // Hook para navegar entre rotas programaticamente

  // Função assíncrona chamada ao clicar no botão de cadastro (ou ao submeter o formulário)
  async function cadastrarAutor(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    setMensagem("...Cadastrando autor..."); // Mostra mensagem temporária enquanto a requisição é feita

    try {
      // Envia uma requisição POST para o endpoint /autores da sua API com os dados do formulário
      const response = await axios.post("http://localhost:3001/autores", {
        nome, // Corresponde ao campo 'nome' da sua API
        pais, // Corresponde ao campo 'pais' da sua API
      });

      // Mostra a resposta de sucesso recebida do servidor
      setMensagem(response.data.message);

      // Limpa os campos do formulário após o envio bem-sucedido
      setNome("");
      setPais("");

      // Opcional: Redireciona para a página de consulta de autores após um pequeno atraso
      setTimeout(() => navigate("/autores"), 1500); // Ajuste a rota se a sua consulta for diferente
    } catch (error) {
      // Em caso de erro, exibe a mensagem de erro retornada pelo servidor (ou uma mensagem genérica)
      setMensagem(error.response?.data?.error || "Erro desconhecido ao cadastrar autor.");
      console.error("Erro ao cadastrar autor:", error);
    }
  }

  return (
    <div className="conteudo">
      <h1>Cadastro de Autor</h1>
      <form onSubmit={cadastrarAutor}> {/* Usa onSubmit para capturar a submissão do formulário */}
        <p>
          <label htmlFor="nome">Nome do Autor:</label> <br />
          <input
            type="text"
            id="nome"
            value={nome} // Valor do campo controlado pelo estado "nome"
            onChange={(e) => setNome(e.target.value)} // Atualiza o estado "nome" a cada digitação
            required // Campo obrigatório
          />
        </p>
        <p>
          <label htmlFor="pais">País:</label> <br />
          <input
            type="text"
            id="pais"
            value={pais} // Campo controlado pelo estado "pais"
            onChange={(e) => setPais(e.target.value)} // Atualiza "pais" com o valor digitado
            required // Campo obrigatório
          />
        </p>
        <p>
          <button type="submit">Cadastrar Autor</button> {/* Botão de submit do formulário */}
        </p>
        <p>{mensagem}</p> {/* Exibe a mensagem do resultado */}
      </form>
    </div>
  );
}