import { useState, useEffect } from 'react';
import axios from 'axios';

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
}

// Estilos em JS
const styles = {
  container: {
    padding: '40px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f6f8',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    gap: '10px'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '150px'
  },
  addButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  list: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: 0,
    listStyle: 'none'
  },
  listItem: {
    backgroundColor: 'white',
    padding: '15px 20px',
    marginBottom: '10px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  editButton: {
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ffc107',
    color: 'white',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer'
  }
};

export default App;
  