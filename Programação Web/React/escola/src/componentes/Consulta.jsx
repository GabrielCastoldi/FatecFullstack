import { useState, useEffect } from "react"; // Importa hooks do React para estado e efeitos colaterais
import axios from "axios"; // Importa o axios para fazer requisições HTTP
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação entre páginas

export default function Consulta() {
  const navigate = useNavigate(); // Hook para redirecionar o usuário para outra rota
  const [alunos, setAlunos] = useState([]); // Estado que armazena a lista de alunos

  // Função assíncrona que faz uma requisição GET para buscar os alunos
  async function consultar() {
    try {
      const response = await axios.get("http://localhost:3001/alunos");
      setAlunos(response.data); // Atualiza o estado com os dados recebidos
    } catch (erro) {
      alert(erro); // Exibe erro genérico em caso de falha
    }
  }

  // useEffect é executado assim que o componente for montado
  useEffect(() => {
    consultar(); // Chama a função para buscar alunos ao carregar a página
  }, []); // O array vazio garante que isso ocorra apenas uma vez

  // Função que redireciona o usuário para a página de alteração do aluno
  function alterar(codigo) {
    navigate("/alterar/" + codigo);
  }

  // Função que redireciona para a página de exclusão do aluno
  function excluir(codigo) {
    navigate("/excluir/" + codigo);
  }

  return (
    <div className="conteudo">
      <form>
        <h1>Consulta de alunos</h1>

        {/* Mostra a quantidade de alunos cadastrados */}
        <p>A quantidade de alunos cadastrados é {alunos.length}.</p>

        {/* Tabela para exibir os dados dos alunos */}
        <table>
          <tr>
            <th>Codigo</th>
            <th>Nome</th>
            <th>Cidade</th>
            <th>Estado</th>
          </tr>

          {/* Renderiza cada aluno como uma linha da tabela */}
          {alunos.map((aluno, index) => (
            <tr key={index}>
              {" "}
              {/* Sempre usar 'key' ao iterar elementos */}
              <td>{aluno.codigo}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.cidade}</td>
              <td>{aluno.estado}</td>
              <td>
                {/* Link para alterar, impedindo o comportamento padrão do <a> */}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    alterar(aluno.codigo);
                  }}
                >
                  Alterar
                </a>{" "}
                {/* Espaço adicionado para separar os links */}
                {/* Link para excluir, também impedindo comportamento padrão */}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    excluir(aluno.codigo);
                  }}
                >
                  Excluir
                </a>
              </td>
            </tr>
          ))}
        </table>
      </form>
    </div>
  );
}