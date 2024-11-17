import React, { useState } from 'react';
import BlockPalette from './components/BlockPalette';
import Workspace from './components/Workspace';
import axios from 'axios';

const blocks = [
  { id: '1', title: 'HTTP Request' }
];

const App = () => {
  const [userPass, setUserPass] = useState('');
  const [proxies, setProxies] = useState('');
  const [code, setCode] = useState('');
  const [testResult, setTestResult] = useState('');
  const [logData, setLogData] = useState('');

  const handleGenerateCode = async () => {
    // Aquí enviarías los bloques generados al backend para generar el código.
    const response = await axios.post('http://localhost:5000/generate-code', {
      blocks: [
        {
          type: 'http_request',
          config: {
            url: 'https://example.com',
            user_pass: userPass
          }
        }
      ]
    });
    setCode(response.data.code);
  };

  const handleTestRequest = async () => {
    const userPassParts = userPass.split(':');
    const username = userPassParts[0];
    const password = userPassParts[1];

    let proxy = null;
    if (proxies) {
      proxy = {
        http: proxies,
        https: proxies
      };
    }

    const requestData = {
      username,
      password,
      proxies: proxy
    };

    try {
      const response = await axios.post('http://localhost:5000/test-request', requestData);
      setTestResult(response.data.message);
      setLogData(prevLog => `${prevLog}\n${response.data.logs}`);
    } catch (error) {
      setTestResult('Error en la prueba de solicitud');
      setLogData(prevLog => `${prevLog}\nError: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <BlockPalette blocks={blocks} />
      <Workspace blocks={blocks} />
      
      <div className="config">
        <h3>Configuración de Proxy y Autenticación</h3>
        <div>
          <label>USER:PASS:</label>
          <input
            type="text"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
            placeholder="usuario:contraseña"
          />
        </div>

        <div>
          <label>Proxies (opcional):</label>
          <input
            type="text"
            value={proxies}
            onChange={(e) => setProxies(e.target.value)}
            placeholder="http://proxy:port"
          />
        </div>

        <button onClick={handleGenerateCode}>Generar Código</button>
        <button onClick={handleTestRequest}>Test Solicitud</button>

        <div className="logs">
          <h3>Resultado Test:</h3>
          <pre>{testResult}</pre>
          <h3>Logs:</h3>
          <pre>{logData}</pre>
        </div>

        <h3>Código Generado:</h3>
        <pre>{code}</pre>
      </div>
    </div>
  );
};

export default App;
