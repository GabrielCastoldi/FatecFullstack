import { useState, useEffect } from "react"; // Importa hooks para estado e efeito colateral
import { useNavigate, useParams } from "react-router-dom"; // Para navegação e parâmetros da URL
import axios from "axios"; // Para fazer requisições HTTP

export default function AlterarLivro() {
  // Pega o parâmetro 'id' da URL, que corresponde ao id_livro na sua API
  const { id } = useParams();

  // Hook para navegar entre rotas programaticamente
  const navigate = useNavigate();

  // Estados para armazenar os dados do livro que serão exibidos e alterados
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState(""); // Usaremos string no input e converteremos para number ao enviar
  const [estoque, setEstoque] = useState(""); // Usaremos string no input e converteremos para number ao enviar
  const [idAutor, setIdAutor] = useState(""); // Estado para o ID do autor selecionado
  const [mensagem, setMensagem] = useState(""); // Para mensagens de sucesso ou erro

  // Estado para armazenar a lista de autores para o dropdown (select)
  const [autores, setAutores] = useState([]);

  // useEffect para carregar os dados do livro e a lista de autores ao montar o componente
  useEffect(() => {
    async function carregarDados() {
      setMensagem("Carregando dados do livro e autores...");
      try {
        // 1. Busca os detalhes do livro específico
        const livroResponse = await axios.get(`http://localhost:3001/livros/${id}`);
        const livro = livroResponse.data;
        setTitulo(livro.titulo);
        setPreco(livro.preco);
        setEstoque(livro.estoque);
        setIdAutor(livro.id_autor); // Preenche o select com o autor atual do livro

        // 2. Busca a lista de autores para o dropdown
        const autoresResponse = await axios.get("http://localhost:3001/autores");
        setAutores(autoresResponse.data);

        setMensagem(""); // Limpa a mensagem após o sucesso
      } catch (error) {
        setMensagem("Erro ao carregar dados do livro ou autores.");
        console.error("Erro ao carregar dados:", error);
        // Opcional: Redirecionar se o livro não for encontrado
        // setTimeout(() => navigate("/livros"), 2000);
      }
    }

    carregarDados();
  }, [id]); // Dependência no 'id' para recarregar se o ID do livro na URL mudar

  // Função que será chamada quando o formulário for submetido para alterar o livro
  async function alterarLivro(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    setMensagem("...Atualizando livro...");

    // Validação básica e conversão de tipos
    const precoNum = parseFloat(preco);
    const estoqueNum = parseInt(estoque, 10); // Inteiro para estoque

    if (!titulo || isNaN(precoNum) || isNaN(estoqueNum) || !idAutor) {
      setMensagem("Por favor, preencha todos os campos corretamente.");
      return;
    }
    if (precoNum <= 0) {
      setMensagem("Preço deve ser maior que zero.");
      return;
    }
    if (estoqueNum < 0) { // Estoque pode ser zero
      setMensagem("Estoque não pode ser negativo.");
      return;
    }

    try {
      // Faz requisição PUT para atualizar o livro no backend
      const response = await axios.put(`http://localhost:3001/livros/${id}`, {
        titulo,
        preco: precoNum, // Envia como número
        estoque: estoqueNum, // Envia como número inteiro
        id_autor: idAutor,
      });

      setMensagem(response.data.message);

      // Após 1.5 segundos, navega para a página de consulta de livros
      setTimeout(() => navigate("/livros"), 1500); // Ajuste a rota se a sua consulta for diferente
    } catch (error) {
      setMensagem(error.response?.data?.error || "Erro desconhecido ao atualizar livro.");
      console.error("Erro ao atualizar livro:", error);
    }
  }

  // JSX que será renderizado na tela
  return (
    <div className="conteudo">
      <h1>Alterar Livro</h1>
      <form onSubmit={alterarLivro}>
        <p>
          <label htmlFor="titulo">Título:<br /></label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </p>
        <p>
          <label htmlFor="preco">Preço:<br /></label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01" // Permite valores decimais
            min="0.01"
            required
          />
        </p>
        <p>
          <label htmlFor="estoque">Estoque:<br /></label>
          <input
            type="number"
            id="estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            min="0" // Estoque pode ser zero
            required
          />
        </p>
        <p>
          <label htmlFor="idAutor">Autor:<br /></label>
          <select
            id="idAutor"
            value={idAutor}
            onChange={(e) => setIdAutor(e.target.value)}
            required
            disabled={autores.length === 0} // Desabilita se não houver autores carregados
          >
            <option value="">Selecione um autor</option>
            {autores.map((autor) => (
              <option key={autor.id_autor} value={autor.id_autor}>
                {autor.nome} (ID: {autor.id_autor})
              </option>
            ))}
          </select>
        </p>
        <p>
          <button type="submit">Alterar Livro</button>
        </p>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}