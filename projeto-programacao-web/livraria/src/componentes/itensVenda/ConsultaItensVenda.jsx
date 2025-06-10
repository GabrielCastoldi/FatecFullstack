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
            
            // --- INÍCIO DA DEPURAGEM ---
            console.log("Dados brutos de itens-venda da API:", response.data);
            // --- FIM DA DEPURAGEM ---

            const itensProcessados = response.data.map(item => {
                // Tenta converter para float. Se o resultado for NaN (não é um número), usa 0
                const precoNumerico = parseFloat(item.preco_unitario);
                
                // --- INÍCIO DA DEPURAGEM ---
                console.log(`Item ID ${item.id_item_venda || 'novo'}: preco_unitario original="${item.preco_unitario}", após parseFloat=${precoNumerico}`);
                // --- FIM DA DEPURAGEM ---
                
                // Se precoNumerico for NaN, ou se o original era null/undefined, define como 0
                return {
                    ...item,
                    preco_unitario: isNaN(precoNumerico) ? 0 : precoNumerico
                };
            });
            setItensVenda(itensProcessados);
            setMensagem(''); // Limpa a mensagem se a busca for bem-sucedida
        } catch (error) {
            console.error('Erro ao buscar itens de venda:', error);
            setMensagem('Erro ao carregar os itens de venda. Tente novamente mais tarde.');
            setTipoMensagem('erro');
        }
    };

    // useEffect para carregar os itens de venda quando o componente for montado
    useEffect(() => {
        buscarItensVenda();
    }, []);

    // Calcula o total geral de todos os itens de venda listados (não o total de uma venda específica)
    const totalGeral = itensVenda.reduce((acc, item) => {
        // 'item.preco_unitario' já deve ser um número ou 0 devido ao processamento acima
        const preco = item.preco_unitario; 
        const quantidade = item.quantidade;
        return acc + (preco * quantidade);
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
                        </tr>
                    </thead>
                    <tbody>
                        {itensVenda.map((item) => (
                            <tr key={item.id_item_venda}>
                                <td>{item.id_item_venda}</td>
                                <td>{item.id_venda}</td>
                                <td>{item.id_livro}</td>
                                <td>{item.quantidade}</td>
                                {/* Agora 'item.preco_unitario' é garantido como número */}
                                <td>R$ {item.preco_unitario.toFixed(2)}</td>
                                <td>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5">Total Geral de Itens de Venda:</td>
                            <td>R$ {totalGeral.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
}