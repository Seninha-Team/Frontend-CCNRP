import { useState, useEffect } from 'react';
import axios from 'axios';

// Componente
function App() {
  const [pecas, setPecas] = useState([]);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const API_URL = 'http://localhost:3001/pecas';


  const listarPecas = () => {
    axios.get(API_URL)
      .then(res => setPecas(res.data))
      .catch(err => console.log(err));
 };

  useEffect(() => {
    listarPecas();
  }, []);

  const adicionarPeca = () => {
    if (!nome || !quantidade) return alert("Preencha o nome da peça e a quantidade!");
    axios.post(API_URL, { nome, quantidade: Number(quantidade) })
      .then(res => {
        setPecas([...pecas, res.data]);
        setNome('');
        setQuantidade('');
      })
      .catch(err => console.log(err));
  };

  const atualizarPeca = (peca) => {
    const novoNome = prompt('Novo nome da peça:', peca.nome);
    const novaQuantidade = prompt('Nova quantidade:', peca.quantidade);
    if (!novoNome || !novaQuantidade) return;

    axios.put(`${API_URL}/${peca.id}`, { nome: novoNome, quantidade: Number(novaQuantidade) })
      .then(res => {
        setPecas(pecas.map(p => p.id === peca.id ? res.data : p));
      })
      .catch(err => console.log(err));
  };

  const deletarPeca = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => setPecas(pecas.filter(p => p.id !== id)))
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle de Peças de Carro</h1>

      <div style={styles.form}>
        <input 
          placeholder="Nome da peça" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          style={styles.input}
        />
        <input 
          placeholder="Quantidade" 
          type="number"
          value={quantidade} 
          onChange={e => setQuantidade(e.target.value)} 
          style={styles.input}
        />
        <button onClick={adicionarPeca} style={styles.addButton}>Adicionar</button>
      </div>

      <ul style={styles.list}>
        {pecas.map(p => (
          <li key={p.id} style={styles.listItem}>
            <div>
              <b>{p.nome}</b> - Quantidade: {p.quantidade}
            </div>
            <div>
              <button onClick={() => atualizarPeca(p)} style={styles.editButton}>Editar</button>
              <button onClick={() => deletarPeca(p.id)} style={styles.deleteButton}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

};
export default App;
  