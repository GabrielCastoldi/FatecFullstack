// src/componentes/livros/ConsultaLivros.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function ConsultaLivros() {
    const [livros, setLivros] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'
    const navigate = useNavigate();

    // Função para buscar os livros da API
    const buscarLivros = async () => {
        try {
            const response = await axios.get('http://localhost:3001/livros');
            setLivros(response.data);
            setMensagem(''); // Limpa a mensagem se a busca for bem-sucedida
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            setMensagem('Erro ao carregar os livros. Tente novamente mais tarde.');
            setTipoMensagem('erro');
        }
    };

    // Função para excluir um livro
    const excluirLivro = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            try {
                await axios.delete(`http://localhost:3001/livros/${id}`);
                setMensagem('Livro excluído com sucesso!');
                setTipoMensagem('sucesso');
                buscarLivros(); // Recarrega a lista de livros após a exclusão
            } catch (error) {
                console.error('Erro ao excluir livro:', error);
                const erroMsg = error.response?.data?.error || 'Erro ao excluir o livro.';
                setMensagem(erroMsg);
                setTipoMensagem('erro');
            }
        }
    };

    // useEffect para carregar os livros quando o componente for montado
    useEffect(() => {
        buscarLivros();
    }, []); // O array vazio garante que a função seja executada apenas uma vez ao montar o componente

    return (
        <div className="conteudo">
            <h1>Consulta de Livros</h1>

            {/* Exibe mensagens de sucesso ou erro */}
            {mensagem && (
                <div className={`mensagem ${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            <div className="botoes-acao">
                <Link to="/livros/cadastrar" className="button">Cadastrar Novo Livro</Link>
            </div>

            {livros.length === 0 ? (
                <p>Nenhum livro cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>ID Autor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {livros.map((livro) => (
                            <tr key={livro.id_livro}>
                                <td>{livro.id_livro}</td>
                                <td>{livro.titulo}</td>
                                {/* A CORREÇÃO ESTÁ AQUI: parseFloat() antes de toFixed() */}
                                <td>R$ {parseFloat(livro.preco).toFixed(2)}</td>
                                <td>{livro.estoque}</td>
                                <td>{livro.id_autor}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/livros/alterar/${livro.id_livro}`)}
                                        className="button-editar"
                                    >
                                        Alterar
                                    </button>
                                    <button
                                        onClick={() => excluirLivro(livro.id_livro)}
                                        className="button-excluir"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}