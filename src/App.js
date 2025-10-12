import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pecas, setPecas] = useState([]);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const API_URL = 'http://localhost:3001/pecas';
};

export default App;
  