export default function Menu() {
  return (
    <div className="menu">
      {" "}
      {/* Container principal com classe "menu" para estilização */}
      {/* Título do menu com link para a página inicial */}
      <h2>
        <a href="/">Aula BD</a> {/* Link que leva para a página Home */}
      </h2>
      {/* Links de navegação para as outras páginas */}
      <div>
        <a href="/cadastro">Cadastro</a> {/* Vai para a página de cadastro */}
        <a href="/consulta">Consulta</a> {/* Vai para a página de consulta */}
      </div>
    </div>
  );
}