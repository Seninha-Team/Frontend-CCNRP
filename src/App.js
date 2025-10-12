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

};
export default App;
  