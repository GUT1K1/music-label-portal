import json
import os
from typing import Dict, Any
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send email via SendGrid (verification, 2FA codes)
    Args: event with httpMethod, body {to, subject, html_content, from_name}
          context with request_id
    Returns: HTTP response with success/error status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    to_email = body_data.get('to')
    subject = body_data.get('subject')
    html_content = body_data.get('html_content')
    from_name = body_data.get('from_name', '420 Music Label')
    
    if not to_email or not subject or not html_content:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields: to, subject, html_content'})
        }
    
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    
    if not sendgrid_api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'SendGrid API key not configured'})
        }
    
    from_email = Email('noreply@420music.ru', from_name)
    to_email_obj = To(to_email)
    content = Content('text/html', html_content)
    
    mail = Mail(from_email, to_email_obj, subject, content)
    
    sg = SendGridAPIClient(sendgrid_api_key)
    response = sg.send(mail)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Email sent successfully',
            'status_code': response.status_code
        })
    }
