import { useState, useEffect } from "react"; // Importa hooks do React para estado e efeito colateral
import { useNavigate, useParams } from "react-router-dom";
// useParams para pegar parâmetros da URL (ex: id do autor)
// useNavigate para navegação programática entre páginas
import axios from "axios"; // Biblioteca para fazer requisições HTTP

export default function AlterarAutor() {
  // Pega o parâmetro 'id' da URL, que corresponde ao id_autor na sua API
  const { id } = useParams();

  // Hook para navegar entre rotas programaticamente (ex: voltar para página de consulta)
  const navigate = useNavigate();

  // Estados locais para armazenar os dados do autor que serão exibidos e alterados
  const [nome, setNome] = useState("");
  const [pais, setPais] = useState("");
  const [mensagem, setMensagem] = useState(""); // Para mensagens de sucesso ou erro

  // useEffect é executado após o componente ser montado (e quando 'id' muda)
  // Ele é usado para carregar os dados do autor existente ao iniciar a tela
  useEffect(() => {
    // Função assíncrona para buscar os dados do autor via API
    async function carregarAutor() {
      setMensagem("Carregando dados do autor..."); // Mensagem enquanto carrega
      try {
        // Faz uma requisição GET para a API com o ID do autor
        const response = await axios.get(`http://localhost:3001/autores/${id}`);

        // Dados do autor retornados pela API
        const autor = response.data;

        // Atualiza os estados com os dados carregados para preencher o formulário
        setNome(autor.nome);
        setPais(autor.pais);
        setMensagem(""); // Limpa a mensagem após o sucesso
      } catch (error) {
        // Em caso de erro, exibe mensagem para o usuário e loga no console
        setMensagem("Erro ao carregar dados do autor.");
        console.error("Erro ao carregar autor:", error);
        // Opcional: Redirecionar se o autor não for encontrado, por exemplo
        // setTimeout(() => navigate("/autores"), 2000);
      }
    }

    // Chama a função para carregar os dados
    carregarAutor();
  }, [id]); // O efeito é executado novamente se o 'id' do autor na URL mudar

  // Função que será chamada quando o formulário for submetido para alterar o autor
  async function alterarAutor(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    setMensagem("...Atualizando autor..."); // Mensagem enquanto atualiza
    try {
      // Faz requisição PUT para atualizar o autor no backend, passando o ID e os novos dados
      const response = await axios.put(`http://localhost:3001/autores/${id}`, {
        nome, // Os valores dos estados 'nome'
        pais, // e 'pais' serão enviados no corpo da requisição
      });

      // Mostra mensagem de sucesso retornada pela API
      setMensagem(response.data.message);

      // Após 1.5 segundos, navega para a página de consulta de autores
      setTimeout(() => navigate("/autores"), 1500); // Ajuste a rota se a sua consulta for diferente
    } catch (error) {
      // Em caso de erro na atualização, mostra mensagem de erro e loga no console
      setMensagem(error.response?.data?.error || "Erro desconhecido ao atualizar autor.");
      console.error("Erro ao atualizar autor:", error);
    }
  }

  // JSX que será renderizado na tela
  return (
    <div className="conteudo">
      <h1>Alterar Autor</h1>
      {/* Formulário com os campos para alteração */}
      <form onSubmit={alterarAutor}>
        <p>
          <label htmlFor="nome">Nome do Autor:<br /></label>
          <input
            type="text"
            id="nome"
            value={nome} // valor controlado pelo estado
            onChange={(e) => setNome(e.target.value)} // atualiza estado quando usuário digita
            required // campo obrigatório
          />
        </p>
        <p>
          <label htmlFor="pais">País:<br /></label>
          <input
            type="text"
            id="pais"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            required
          />
        </p>
        <p>
          <button type="submit">Alterar Autor</button> {/* Botão para enviar o formulário */}
        </p>
      </form>

      {/* Exibe mensagem de sucesso ou erro, se houver */}
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}