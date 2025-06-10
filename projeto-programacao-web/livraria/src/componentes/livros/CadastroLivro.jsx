import { useState, useEffect } from "react"; // Import React hooks for state and side effects
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation

export default function CadastroLivro() {
  // States for the book's data
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [idAutor, setIdAutor] = useState(""); // State for the selected author's ID
  const [mensagem, setMensagem] = useState(""); // For success or error messages

  // State to store the list of authors for the dropdown
  const [autores, setAutores] = useState([]);

  const navigate = useNavigate(); // Hook for programmatic navigation

  // useEffect to load the list of authors when the component mounts
  useEffect(() => {
    async function carregarAutores() {
      setMensagem("Carregando autores para seleção...");
      try {
        const response = await axios.get("http://localhost:3001/autores");
        setAutores(response.data);
        setMensagem(""); // Clear message on successful load
      } catch (error) {
        setMensagem("Erro ao carregar lista de autores.");
        console.error("Erro ao buscar autores:", error);
      }
    }

    carregarAutores(); // Call the function to load authors
  }, []); // Empty dependency array means this runs only once on mount

  // Function to handle form submission for registering a new book
  async function cadastrarLivro(event) {
    event.preventDefault(); // Prevent default form submission behavior (page reload)

    setMensagem("...Cadastrando livro..."); // Show temporary message

    // Basic validation and type conversion
    const precoNum = parseFloat(preco);
    const estoqueNum = parseInt(estoque, 10); // Ensure stock is an integer

    if (!titulo || isNaN(precoNum) || isNaN(estoqueNum) || !idAutor) {
      setMensagem("Por favor, preencha todos os campos corretamente.");
      return;
    }
    if (precoNum <= 0) {
      setMensagem("Preço deve ser maior que zero.");
      return;
    }
    if (estoqueNum < 0) {
      setMensagem("Estoque não pode ser negativo.");
      return;
    }

    try {
      // Send a POST request to your API with the book's data
      const response = await axios.post("http://localhost:3001/livros", {
        titulo,
        preco: precoNum, // Send as a number
        estoque: estoqueNum, // Send as an integer
        id_autor: idAutor, // Send the selected author ID
      });

      setMensagem(response.data.message); // Show success message from API

      // Clear form fields after successful submission
      setTitulo("");
      setPreco("");
      setEstoque("");
      setIdAutor(""); // Reset author selection as well

      // Optional: Redirect to the book listing page after a delay
      setTimeout(() => navigate("/livros"), 1500); // Adjust route if your listing is different
    } catch (error) {
      // Show error message (from API if available, otherwise generic)
      setMensagem(error.response?.data?.error || "Erro desconhecido ao cadastrar livro.");
      console.error("Erro ao cadastrar livro:", error);
    }
  }

  return (
    <div className="conteudo">
      <h1>Cadastro de Livro</h1>
      <form onSubmit={cadastrarLivro}>
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
            step="0.01" // Allows decimal values for price
            min="0.01" // Minimum price is 0.01
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
            min="0" // Stock can be 0 or more
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
            disabled={autores.length === 0} // Disable if no authors are loaded yet
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
          <button type="submit">Cadastrar Livro</button>
        </p>
        {mensagem && <p>{mensagem}</p>}
      </form>
    </div>
  );
}