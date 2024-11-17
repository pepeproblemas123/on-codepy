from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.auth import HTTPBasicAuth

app = Flask(__name__)
CORS(app)  # Habilitar CORS para solicitudes del frontend

@app.route('/generate-code', methods=['POST'])
def generate_code():
    data = request.json
    blocks = data.get('blocks', [])
    code = ""

    # Procesa los bloques y genera código
    for block in blocks:
        if block['type'] == 'http_request':
            code += f"# Request Block - {block['config']['url']}\n"
            # Si tiene USER:PASS, agregamos el encabezado de autenticación
            if 'user_pass' in block['config']:
                user_pass = block['config']['user_pass']
                code += f"Authorization: Basic {user_pass}\n"
            code += f"Request to {block['config']['url']}\n"
            code += "---------------\n"

    return jsonify({'code': code})

@app.route('/test-request', methods=['POST'])
def test_request():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    proxies = data.get('proxies', {})

    url = "https://httpbin.org/basic-auth/{}".format(username)

    logs = []
    
    try:
        # Realiza la solicitud HTTP con las credenciales y los proxies si existen
        logs.append(f"Realizando solicitud GET a {url} con usuario {username}")

        response = requests.get(url, auth=HTTPBasicAuth(username, password), proxies=proxies)

        # Procesamos la respuesta
        if response.status_code == 200:
            logs.append(f"Autenticación exitosa - Status: {response.status_code}")
        else:
            logs.append(f"Autenticación fallida - Status: {response.status_code}")
        
        logs.append(f"Respuesta: {response.text}")
        
        return jsonify({
            'message': 'Autenticación exitosa' if response.status_code == 200 else 'Autenticación fallida',
            'logs': "\n".join(logs)
        })
    except Exception as e:
        logs.append(f"Error: {str(e)}")
        return jsonify({
            'message': 'Error al hacer la solicitud',
            'logs': "\n".join(logs)
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
