import { useState, useEffect } from "react"; // Importa hooks para estado e ciclo de vida do componente
import axios from "axios"; // Importa axios para fazer requisições HTTP
import { Link } from "react-router-dom"; // Importa Link para navegação declarativa

export default function ConsultaVendas() {
  // Estado para armazenar a lista de vendas obtida da API
  const [vendas, setVendas] = useState([]);
  // Estado para mensagens de sucesso ou erro para o usuário
  const [mensagem, setMensagem] = useState("");

  // useEffect é executado após a renderização inicial do componente
  // Ele é ideal para buscar dados da API
  useEffect(() => {
    // Define uma função assíncrona para buscar as vendas
    async function buscarVendas() {
      setMensagem("Carregando vendas..."); // Mensagem enquanto carrega

      try {
        // Faz uma requisição GET para o endpoint /vendas da sua API
        const response = await axios.get("http://localhost:3001/vendas");
        // Atualiza o estado 'vendas' com os dados recebidos
        setVendas(response.data);
        setMensagem(""); // Limpa a mensagem após o sucesso
      } catch (error) {
        // Em caso de erro, exibe uma mensagem de erro e loga no console
        setMensagem("Erro ao carregar vendas.");
        console.error("Erro ao buscar vendas:", error);
      }
    }

    buscarVendas(); // Chama a função para buscar as vendas assim que o componente é montado
  }, []); // O array vazio [] como segundo argumento significa que o useEffect será executado apenas uma vez (ao montar)

  return (
    <div className="conteudo">
      <h1>Consulta de Vendas</h1>

      {/* Exibe mensagem de carregamento, sucesso ou erro */}
      {mensagem && <p>{mensagem}</p>}

      {/* Verifica se há vendas para exibir antes de renderizar a tabela */}
      {vendas.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID Venda</th>
              <th>Data da Venda</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeia a lista de vendas para criar uma linha da tabela para cada uma */}
            {vendas.map((venda) => (
              <tr key={venda.id_venda}> {/* 'key' é importante para o React renderizar listas de forma eficiente */}
                <td>{venda.id_venda}</td>
                {/* Formata a data para um formato mais legível no Brasil (DD/MM/YYYY) */}
                <td>{new Date(venda.data_venda).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Mensagem se não houver vendas ou se ainda estiver carregando
        !mensagem && <p>Nenhuma venda encontrada.</p>
      )}

      <p>
        {/* Link para o componente de cadastro de venda */}
        <Link to="/vendas/cadastrar">
          <button>Registrar Nova Venda</button>
        </Link>
      </p>
    </div>
  );
}