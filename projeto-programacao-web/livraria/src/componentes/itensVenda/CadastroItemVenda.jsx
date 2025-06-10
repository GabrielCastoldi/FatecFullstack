// src/componentes/itensVenda/ConsultaItensVenda.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function ConsultaItensVenda() {
    const [itensVenda, setItensVenda] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'
    const navigate = useNavigate();

    // Função para buscar os itens de venda da API
    const buscarItensVenda = async () => {
        try {
            const response = await axios.get('http://localhost:3001/itens-venda');
            setItensVenda(response.data);
            setMensagem(''); // Limpa a mensagem se a busca for bem-sucedida
        } catch (error) {
            console.error('Erro ao buscar itens de venda:', error);
            setMensagem('Erro ao carregar os itens de venda. Tente novamente mais tarde.');
            setTipoMensagem('erro');
        }
    };

    // Nota: Sua API não possui endpoint para Alterar/Excluir Item de Venda diretamente por ID.
    // Se você implementou, adicione a lógica aqui. Caso contrário, remova os botões de ação.

    // useEffect para carregar os itens de venda quando o componente for montado
    useEffect(() => {
        buscarItensVenda();
    }, []);

    // Calcula o total geral de todos os itens de venda listados (não o total de uma venda específica)
    const totalGeral = itensVenda.reduce((acc, item) => {
        // Garantir que preco_unitario seja um número antes de calcular
        const preco = parseFloat(item.preco_unitario);
        const quantidade = item.quantidade;
        return acc + (isNaN(preco) ? 0 : (preco * quantidade)); // Adiciona 0 se preço não for um número válido
    }, 0);


    return (
        <div className="conteudo">
            <h1>Consulta de Itens de Venda</h1>

            {/* Exibe mensagens de sucesso ou erro */}
            {mensagem && (
                <div className={`mensagem ${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            <div className="botoes-acao">
                <Link to="/vendas/cadastrar" className="button">Registrar Nova Venda</Link>
                {/* Se houver um componente para cadastro direto de item de venda (menos comum), linkaria aqui */}
                {/* <Link to="/itens-venda/cadastrar" className="button">Adicionar Item de Venda</Link> */}
            </div>

            {itensVenda.length === 0 ? (
                <p>Nenhum item de venda cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID Item</th>
                            <th>ID Venda</th>
                            <th>ID Livro</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Subtotal</th>
                            {/* <th>Ações</th> <-- Remova se não houver lógica de alteração/exclusão */}
                        </tr>
                    </thead>
                    <tbody>
                        {itensVenda.map((item) => (
                            <tr key={item.id_item_venda}>
                                <td>{item.id_item_venda}</td>
                                <td>{item.id_venda}</td>
                                <td>{item.id_livro}</td>
                                <td>{item.quantidade}</td>
                                {/* A CORREÇÃO ESTÁ AQUI: parseFloat() antes de toFixed() */}
                                <td>R$ {parseFloat(item.preco_unitario).toFixed(2)}</td>
                                {/* E AQUI para o subtotal */}
                                <td>R$ {parseFloat(item.preco_unitario * item.quantidade).toFixed(2)}</td>
                                {/* Se não houver botões de ação, remova a <td> inteira */}
                                {/* <td>
                                    <button onClick={() => alert('Alterar Item de Venda (não implementado na API)')}>Alterar</button>
                                    <button onClick={() => alert('Excluir Item de Venda (não implementado na API)')}>Excluir</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5">Total Geral de Itens de Venda:</td>
                            {/* E AQUI para o total geral */}
                            <td>R$ {parseFloat(totalGeral).toFixed(2)}</td>
                            {/* <td></td> <-- Se a coluna de ações for removida, remova este também */}
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
}