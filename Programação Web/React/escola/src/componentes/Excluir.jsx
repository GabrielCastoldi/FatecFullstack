import axios from "axios"; // Importa o axios para requisições HTTP
import { useState, useEffect } from "react"; // Hooks do React
import { useParams, useNavigate } from "react-router-dom"; // Hook para acessar parâmetros da rota e navegar entre páginas

export default function Excluir() {
  const { codigo } = useParams(); // Recupera o parâmetro "codigo" da URL
  const navigate = useNavigate(); // Permite redirecionar o usuário para outra página
  const [alunos, setAlunos] = useState([]); // Estado que armazena os dados do aluno a ser excluído

  // Função que busca os dados do aluno pelo código
  async function consultarPorCodigo(codigo) {
    try {
      const response = await axios.get(
        "http://localhost:3001/alunos/" + codigo
      );
      setAlunos(response.data); // Atualiza o estado com os dados retornados
    } catch (erro) {
      alert(erro); // Alerta em caso de erro na requisição
    }
  }

  // useEffect é executado assim que o componente é montado
  useEffect(() => {
    consultarPorCodigo(codigo); // Busca os dados do aluno ao carregar a página
  }, []); // Array vazio garante que seja executado apenas uma vez

  // Função que exclui o aluno com base no código
  async function Excluir(codigo) {
    try {
      const response = await axios.delete(
        "http://localhost:3001/alunos/" + codigo
      ); // Requisição DELETE
      alert("Exclusão efetuada com sucesso!");
      navigate("/consulta"); // Redireciona para a página de consulta após a exclusão
    } catch (erro) {
      alert(erro); // Alerta em caso de erro
    }

    // Essa função está **dentro** da função Excluir, o que é um erro. O certo é fora!
    function voltar() {
      navigate("/consulta");
    }
  }

  return (
    <div>
      <form>
        <h1>Exclusão de alunos</h1>

        {/* Pergunta se o usuário quer excluir o aluno com o nome recuperado */}
        <p>Você deseja excluir o aluno {alunos.nome}?</p>

        {/* Botão de confirmação */}
        <p>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault(); // Previne o comportamento padrão do link
              Excluir(alunos.codigo); // Chama a função para excluir o aluno
            }}
          >
            Sim
          </a>
        </p>

        {/* Botão para cancelar e voltar para a consulta */}
        <p>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault(); // Impede o recarregamento da página
              navigate("/consulta"); // Volta para a tela de consulta
            }}
          >
            Não, voltar a consulta
          </a>
        </p>
      </form>
    </div>
  );
}