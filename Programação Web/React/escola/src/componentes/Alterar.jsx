import { useState, useEffect } from "react"; // Importa hooks do React para estado e efeito colateral
import { useNavigate, useParams } from "react-router-dom"; 
// useParams para pegar parâmetros da URL (ex: código do aluno)
// useNavigate para navegação programática entre páginas
import axios from "axios"; // Biblioteca para fazer requisições HTTP

export default function Alterar() {
  // Pega o parâmetro 'codigo' da URL para identificar qual aluno será alterado
  const { codigo } = useParams();

  // Hook para navegar entre rotas programaticamente (ex: voltar para página de consulta)
  const navigate = useNavigate();

  // Estados locais para armazenar os dados do aluno que serão exibidos e alterados
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [mensagem, setMensagem] = useState(""); // Para mensagens de sucesso ou erro

  // useEffect é executado após o componente ser montado, carrega os dados do aluno
  useEffect(() => {
    // Função assíncrona para buscar os dados do aluno via API
    async function carregarAluno() {
      try {
        // Faz uma requisição GET para a API com o código do aluno
        const response = await axios.get(`http://localhost:3001/alunos/${codigo}`);

        // Dados do aluno retornados pela API
        const aluno = response.data;

        // Atualiza os estados com os dados carregados para preencher o formulário
        setNome(aluno.nome);
        setCidade(aluno.cidade);
        setEstado(aluno.estado);
      } catch (error) {
        // Em caso de erro, exibe mensagem para o usuário
        setMensagem("Erro ao carregar dados do aluno.");
      }
    }

    // Chama a função para carregar os dados
    carregarAluno();
  }, [codigo]); // Executa o efeito novamente se o código do aluno mudar

  // Função que será chamada quando o formulário for submetido para alterar o aluno
  async function alterarAluno(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    try {
      // Faz requisição PUT para atualizar o aluno no backend
      const response = await axios.put(`http://localhost:3001/alunos/${codigo}`, {
        nome,
        cidade,
        estado,
      });

      // Mostra mensagem de sucesso retornada pela API
      setMensagem(response.data.message);

      // Após 1.5 segundos, navega para a página de consulta
      setTimeout(() => navigate("/consulta"), 1500);
    } catch (error) {
      // Em caso de erro na atualização, mostra mensagem de erro
      setMensagem("Erro ao atualizar aluno.");
    }
  }

  // JSX que será renderizado na tela
  return (
    <div>
      <h1>Alterar Aluno</h1>
      {/* Formulário com os campos para alteração */}
      <form onSubmit={alterarAluno}>
        <label>
          Nome:<br />
          <input
            type="text"
            value={nome} // valor controlado pelo estado
            onChange={(e) => setNome(e.target.value)} // atualiza estado quando usuário digita
            required // campo obrigatório
          />
        </label>
        <br />
        <label>
          Cidade:<br />
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Estado:<br />
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Alterar</button> {/* Botão para enviar o formulário */}
      </form>

      {/* Exibe mensagem de sucesso ou erro, se houver */}
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}