// src/componentes/autores/ConsultaAutores.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate

export default function ConsultaAutores() {
    const [autores, setAutores] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'
    const navigate = useNavigate(); // Hook para navegação programática

    // Função para buscar os autores da API
    const buscarAutores = async () => {
        try {
            const response = await axios.get('http://localhost:3001/autores');
            setAutores(response.data);
            setMensagem(''); // Limpa a mensagem se a busca for bem-sucedida
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
            setMensagem('Erro ao carregar os autores. Tente novamente mais tarde.');
            setTipoMensagem('erro');
        }
    };

    // Função para excluir um autor
    const excluirAutor = async (id, nomeAutor) => {
        if (window.confirm(`Tem certeza que deseja excluir o autor "${nomeAutor}"?`)) {
            try {
                await axios.delete(`http://localhost:3001/autores/${id}`);
                setMensagem(`Autor "${nomeAutor}" excluído com sucesso!`);
                setTipoMensagem('sucesso');
                buscarAutores(); // Recarrega a lista de autores após a exclusão
            } catch (error) {
                console.error('Erro ao excluir autor:', error);
                const erroMsg = error.response?.data?.error || 'Erro ao excluir o autor.';
                setMensagem(erroMsg);
                setTipoMensagem('erro');
            }
        }
    };

    // useEffect para carregar os autores quando o componente for montado
    useEffect(() => {
        buscarAutores();
    }, []); // O array vazio garante que a função seja executada apenas uma vez ao montar o componente

    return (
        <div className="conteudo">
            <h1>Consulta de Autores</h1>

            {/* Exibe mensagens de sucesso ou erro */}
            {mensagem && (
                <div className={`mensagem ${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            <div className="botoes-acao">
                <Link to="/autores/cadastrar" className="button">Cadastrar Novo Autor</Link>
            </div>

            {autores.length === 0 ? (
                <p>Nenhum autor cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr> {/* Garanta que não há espaços aqui */}
                            <th>ID</th> {/* Nem aqui */}
                            <th>Nome</th> {/* Nem aqui */}
                            <th>Ações</th> {/* Nem aqui */}
                        </tr> {/* Nem aqui */}
                    </thead>
                    <tbody>
                        {autores.map((autor) => (
                            <tr key={autor.id_autor}> {/* Garanta que não há espaços aqui */}
                                <td>{autor.id_autor}</td> {/* Nem aqui */}
                                <td>{autor.nome}</td> {/* Nem aqui */}
                                <td> {/* Nem aqui */}
                                    <button
                                        onClick={() => navigate(`/autores/alterar/${autor.id_autor}`)}
                                        className="button-editar"
                                    >
                                        Alterar
                                    </button>
                                    <button
                                        onClick={() => excluirAutor(autor.id_autor, autor.nome)}
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