import { useEffect } from 'react';

export default function VKCallback() {
  useEffect(() => {
    console.log('🟢 VK callback page loaded');
    console.log('🟢 Full URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('payload');
    
    if (payload) {
      try {
        const data = JSON.parse(decodeURIComponent(payload));
        console.log('🟢 VK payload:', data);
        
        if (window.opener) {
          window.opener.postMessage({
            code: data.code,
            state: data.state,
            device_id: data.device_id
          }, window.location.origin);
          
          console.log('🟢 Data sent to parent window');
          
          setTimeout(() => {
            window.close();
          }, 500);
        }
      } catch (error) {
        console.error('🔴 Error parsing payload:', error);
      }
    } else {
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const device_id = urlParams.get('device_id');
      
      console.log('🟢 Direct params:', { code, state, device_id });
      
      if (code && window.opener) {
        window.opener.postMessage({
          code,
          state,
          device_id
        }, window.location.origin);
        
        console.log('🟢 Data sent to parent window');
        
        setTimeout(() => {
          window.close();
        }, 500);
      }
    }
  }, []);

  return (
    <div style={{ 
      textAlign: 'center', 
      paddingTop: '50px', 
      fontFamily: 'sans-serif', 
      color: '#4CAF50' 
    }}>
      ✓ Авторизация выполнена
      <br />
      <small style={{ color: '#666' }}>Это окно закроется автоматически...</small>
    </div>
  );
}
