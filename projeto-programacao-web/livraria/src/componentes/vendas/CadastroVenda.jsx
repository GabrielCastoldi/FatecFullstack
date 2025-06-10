// src/componentes/vendas/CadastroVenda.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CadastroVenda() {
    const [dataVenda, setDataVenda] = useState('');
    const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
    const [itensVenda, setItensVenda] = useState([]); // Lista de livros adicionados à venda
    const [livroSelecionadoId, setLivroSelecionadoId] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'
    const navigate = useNavigate();

    useEffect(() => {
        const buscarLivros = async () => {
            try {
                const response = await axios.get('http://localhost:3001/livros');
                setLivrosDisponiveis(response.data.map(livro => ({
                    ...livro,
                    // Garante que o preço seja um número ao carregar
                    preco: parseFloat(livro.preco) || 0
                })));
            } catch (error) {
                console.error('Erro ao buscar livros para seleção:', error);
                setMensagem('Erro ao carregar lista de livros.');
                setTipoMensagem('erro');
            }
        };
        buscarLivros();

        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
        setDataVenda(dataFormatada);
    }, []);

    const adicionarItem = () => {
        // Validação para ADICIONAR ITEM
        if (!livroSelecionadoId || quantidade <= 0) {
            setMensagem('Selecione um livro e informe uma quantidade válida para adicionar o item.'); // Mensagem mais específica
            setTipoMensagem('erro');
            return;
        }

        const livro = livrosDisponiveis.find(l => l.id_livro === parseInt(livroSelecionadoId));

        if (!livro) {
            setMensagem('Livro selecionado não encontrado.');
            setTipoMensagem('erro');
            return;
        }
        if (quantidade > livro.estoque) {
            setMensagem(`Quantidade (${quantidade}) excede o estoque disponível (${livro.estoque}) para este livro.`);
            setTipoMensagem('erro');
            return;
        }

        const itemExistente = itensVenda.find(item => item.id_livro === livro.id_livro);

        if (itemExistente) {
            const novaQuantidade = itemExistente.quantidade + quantidade;
            if (novaQuantidade > livro.estoque) {
                setMensagem(`Adição excede o estoque. Total: ${novaQuantidade}, Estoque: ${livro.estoque}`);
                setTipoMensagem('erro');
                return;
            }
            setItensVenda(itensVenda.map(item =>
                item.id_livro === livro.id_livro ? { ...item, quantidade: novaQuantidade } : item
            ));
        } else {
            setItensVenda([...itensVenda, {
                id_livro: livro.id_livro,
                titulo: livro.titulo,
                preco_unitario: livro.preco, // Já é número devido ao map no useEffect
                quantidade: quantidade
            }]);
        }

        setMensagem(''); // Limpa a mensagem se adicionou com sucesso
        setTipoMensagem('');
        setLivroSelecionadoId('');
        setQuantidade(1);
    };

    const removerItem = (idLivro) => {
        setItensVenda(itensVenda.filter(item => item.id_livro !== idLivro));
        setMensagem(''); // Limpa qualquer mensagem ao remover
        setTipoMensagem('');
    };

    const totalVenda = itensVenda.reduce((total, item) =>
        total + (item.preco_unitario * item.quantidade), 0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação para REGISTRAR VENDA: Apenas verifica se há itens na lista de venda.
        if (itensVenda.length === 0) {
            setMensagem('Não é possível registrar uma venda sem itens. Adicione livros à lista.'); // Mensagem mais específica
            setTipoMensagem('erro');
            return;
        }
        
        // Limpa a mensagem de sucesso/erro anterior antes de tentar o submit
        setMensagem('');
        setTipoMensagem('');

        try {
            const vendaResponse = await axios.post('http://localhost:3001/vendas', {
                data_venda: dataVenda
            });
            const match = vendaResponse.data.message.match(/ID (\d+)/);
            const idVendaCriada = match ? match[1] : null;

            if (!idVendaCriada) {
                throw new Error("Não foi possível obter o ID da venda criada.");
            }

            for (const item of itensVenda) {
                await axios.post('http://localhost:3001/itens-venda', {
                    id_livro: item.id_livro,
                    id_venda: parseInt(idVendaCriada),
                    quantidade: item.quantidade,
                    preco_unitario: item.preco_unitario
                });
                // TODO: Chamar API para decrementar estoque do livro no backend
                // Isso exigiria um endpoint PUT /livros/:id/decrementar-estoque
                // Ex: await axios.put(`http://localhost:3001/livros/${item.id_livro}/decrementar-estoque`, { quantidade: item.quantidade });
            }

            setMensagem('Venda registrada com sucesso!');
            setTipoMensagem('sucesso');
            // Limpa o formulário após o sucesso
            setDataVenda(new Date().toISOString().split('T')[0]);
            setItensVenda([]);
            setLivroSelecionadoId('');
            setQuantidade(1);
            navigate('/vendas'); // Redireciona para a consulta de vendas
        } catch (error) {
            console.error('Erro ao registrar a venda:', error);
            const erroMsg = error.response?.data?.error || 'Erro desconhecido ao registrar a venda.';
            setMensagem(`Erro ao registrar a venda: ${erroMsg}`); // Mensagem de erro mais clara
            setTipoMensagem('erro');
        }
    };

    return (
        <div className="conteudo">
            <h1>Registrar Nova Venda</h1>

            {mensagem && (
                <div className={`mensagem ${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Data da Venda:
                    <input
                        type="date"
                        value={dataVenda}
                        onChange={(e) => setDataVenda(e.target.value)}
                        required
                    />
                </label>

                <h2>Adicionar Livros à Venda</h2>
                <div className="form-group-inline">
                    <label>
                        Livro:
                        <select
                            value={livroSelecionadoId}
                            onChange={(e) => setLivroSelecionadoId(e.target.value)}
                            // REMOVIDO: required
                        >
                            <option value="">Selecione um livro</option>
                            {livrosDisponiveis.map(livro => (
                                <option key={livro.id_livro} value={livro.id_livro}>
                                    {livro.titulo} (R$ {livro.preco.toFixed(2)}) - Estoque: {livro.estoque}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Quantidade:
                        <input
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                            min="1"
                            // REMOVIDO: required
                        />
                    </label>
                    <button type="button" onClick={adicionarItem} className="button-adicionar">Adicionar</button>
                </div>

                <h3>Itens da Venda:</h3>
                {itensVenda.length === 0 ? (
                    <p>Nenhum item adicionado à venda.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Livro</th>
                                <th>Preço Unitário</th>
                                <th>Quantidade</th>
                                <th>Subtotal</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensVenda.map((item, index) => ( // Adicionado 'index' como fallback para key
                                <tr key={item.id_livro || index}> {/* Usar id_livro como key, com index fallback */}
                                    <td>{item.titulo}</td>
                                    <td>R$ {item.preco_unitario.toFixed(2)}</td>
                                    <td>{item.quantidade}</td>
                                    <td>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => removerItem(item.id_livro)}
                                            className="button-excluir"
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3">Total da Venda:</td>
                                <td>R$ {totalVenda.toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                )}

                <button type="submit" className="button">Registrar Venda</button>
            </form>
        </div>
    );
}