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

};
export default App;
  