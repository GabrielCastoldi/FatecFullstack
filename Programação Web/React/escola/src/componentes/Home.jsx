export default function Home() {
  return (
    <div className="conteudo">
      {" "}
      {/* Div com classe "conteudo" para estilização */}
      <h1>Home</h1> {/* Título da página */}
      {/* Lista de links de navegação */}
      <ul>
        <li>
          {/* Link para a página de cadastro de alunos */}
          <a href="/cadastro">Cadastro de novos alunos</a>
        </li>
        <li>
          {/* Link para a página de consulta de alunos */}
          <a href="/consulta">Consulta de alunos</a>
        </li>
      </ul>
    </div>
  );
}