import { useState } from "react"; // Importa o hook useState para controle de estados no React
import axios from "axios"; // Importa o axios para fazer requisições HTTP

export default function Cadastro() {
  // Define os estados do componente, que armazenam os dados do formulário e o resultado da requisição
  const [nome, setNome] = useState();
  const [cidade, setCidade] = useState();
  const [estado, setEstado] = useState();
  const [resultado, setResultado] = useState();

  // Função assíncrona chamada ao clicar no botão de cadastro
  async function cadastrar() {
    try {
      setResultado("...Aguarde..."); // Mostra mensagem temporária enquanto a requisição é feita

      // Envia uma requisição POST para o servidor com os dados do formulário
      const response = await axios.post("http://localhost:3001/alunos", {
        nome,
        cidade,
        estado,
      });

      // Mostra a resposta recebida do servidor
      setResultado(response.data.message);

      // Limpa os campos do formulário após o envio
      setNome("");
      setCidade("");
      setEstado("");
    } catch (erro) {
      // Em caso de erro, exibe a mensagem de erro retornada pelo servidor (ou uma mensagem genérica)
      setResultado(erro.response?.data?.error || "Erro desconhecido");
    }
  }

  return (
    <div className="conteudo">
      <form>
        <h1>Cadastro</h1>
        <p>
          Digite o nome do aluno <br />
          <input
            type="text"
            value={nome} // Valor do campo controlado pelo estado "nome"
            onChange={(e) => setNome(e.target.value)} // Atualiza o estado "nome" a cada digitação
          />
        </p>
        <p>
          Digite a cidade <br />
          <input
            type="text"
            value={cidade} // Campo controlado pelo estado "cidade"
            onChange={(e) => setCidade(e.target.value)} // Atualiza "cidade" com o valor digitado
          />
        </p>
        <p>
          Digite o estado <br />
          <input
            type="text"
            maxLength={2} // Limita o input a 2 caracteres (ex: "SP")
            value={estado} // Controlado por "estado"
            onChange={(e) => setEstado(e.target.value)} // Atualiza "estado"
          />
        </p>
        <p>
          <input
            type="button"
            value="Cadastrar"
            onClick={cadastrar} // Chama a função "cadastrar" ao clicar
          />
        </p>
        <p>{resultado}</p> {/* Exibe a mensagem do resultado */}
      </form>
    </div>
  );
}