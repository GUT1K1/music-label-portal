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
        
        # Формируем query string для редиректа
        redirect_params = {}
        if code:
            redirect_params['code'] = code
        if state:
            redirect_params['state'] = state
        if device_id:
            redirect_params['device_id'] = device_id
        
        query_string = urlencode(redirect_params)
        redirect_url = f"https://420.рф/app?{query_string}"
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': redirect_url,
                'Access-Control-Allow-Origin': '*'
            },
            'body': '',
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
