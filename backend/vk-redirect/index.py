import json
from typing import Dict, Any
from urllib.parse import urlencode

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: VK OAuth callback redirector - redirects to main site with params
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP redirect response to main site
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        code = params.get('code')
        state = params.get('state')
        device_id = params.get('device_id')
        
        # Логирование для отладки
        print(f"🔍 VK redirect proxy received:")
        print(f"  code: {code[:20] if code else None}...")
        print(f"  state: {state}")
        print(f"  state length: {len(state) if state else 0}")
        print(f"  state parts: {len(state.split('|')) if state else 0}")
        print(f"  device_id: {device_id[:20] if device_id else None}...")
        
        # Формируем query string для редиректа
        redirect_params = {}
        if code:
            redirect_params['code'] = code
        if state:
            redirect_params['state'] = state
        if device_id:
            redirect_params['device_id'] = device_id
        
        import base64
        
        # Извлекаем домен из state (формат: random__base64url(domain)__base64url(code_verifier))
        base_url = "https://420.xn--p1ai/app"  # default
        
        if state and '__' in state:
            try:
                parts = state.split('__')
                print(f"  State split into {len(parts)} parts")
                if len(parts) >= 2:  # Может быть 2 или 3 части (с code_verifier или без)
                    encoded_domain = parts[1]
                    # URL-safe base64 декодирование (добавляем паддинг)
                    encoded_domain = encoded_domain.replace('-', '+').replace('_', '/')
                    padding = '=' * ((4 - len(encoded_domain) % 4) % 4)
                    domain = base64.b64decode(encoded_domain + padding).decode('utf-8')
                    base_url = f"{domain}/app"
                    print(f"  Decoded domain: {domain}")
            except Exception as e:
                print(f"Failed to decode domain from state: {e}")
        
        query_string = urlencode(redirect_params)
        redirect_url = f"{base_url}?{query_string}"
        
        # Используем HTML редирект вместо 302, т.к. Cloud Functions может его перехватывать
        html_body = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
        window.location.href = "{redirect_url}";
    </script>
</head>
<body>
    <p>Redirecting to 420.рф...</p>
    <p>If not redirected, <a href="{redirect_url}">click here</a></p>
</body>
</html>'''
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': html_body,
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }