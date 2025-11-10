import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fullUrl = url.startsWith('http') ? url : `https://420music.ru${url}`;

  const shareLinks = {
    vk: `https://vk.com/share.php?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: 'Ссылка скопирована!',
        description: 'Теперь можешь поделиться статьёй',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать ссылку',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold text-white">Поделиться статьёй</h4>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleShare('vk')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0077FF] hover:bg-[#0066DD] text-white rounded-lg transition-colors font-medium"
          aria-label="Поделиться ВКонтакте"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 13.163c.603.599 1.238 1.167 1.744 1.823.224.29.435.589.593.926.224.479.021.999-.388 1.027l-2.547-.001c-.657.054-1.178-.212-1.611-.646-.346-.348-.671-.716-.996-1.083-.136-.154-.278-.298-.447-.414-.322-.222-.604-.152-.797.185-.197.342-.242.725-.265 1.112-.031.543-.244.685-.79.709-1.166.052-2.276-.122-3.306-.729-.91-.537-1.611-1.294-2.206-2.168-.116-.171-.225-.346-.341-.517-.823-1.21-1.489-2.533-2.081-3.903-.117-.271-.033-.418.268-.424.503-.011 1.007-.011 1.511 0 .206.004.344.119.425.313.511 1.223 1.142 2.373 1.949 3.404.138.177.279.355.478.463.218.118.381.042.476-.197.061-.154.092-.317.109-.481.057-.558.063-1.116.003-1.674-.034-.313-.167-.517-.48-.582-.16-.033-.136-.098-.059-.197.125-.161.243-.261.478-.261h1.765c.278.055.34.18.378.459l.001 1.956c-.002.122.061.486.281.567.176.061.293-.082.399-.196.664-.712 1.137-1.553 1.557-2.43.186-.389.343-.792.492-1.199.112-.305.287-.455.625-.448l2.666.003c.079 0 .159.001.236.016.414.079.527.279.396.685-.217.669-.604 1.228-.991 1.784-.416.596-.858 1.175-1.265 1.778-.373.553-.339.829.127 1.312z"/>
          </svg>
          <span>ВКонтакте</span>
        </button>

        <button
          onClick={() => handleShare('telegram')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0088CC] hover:bg-[#0077BB] text-white rounded-lg transition-colors font-medium"
          aria-label="Поделиться в Telegram"
        >
          <Icon name="Send" size={18} />
          <span>Telegram</span>
        </button>

        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-colors font-medium"
          aria-label="Поделиться в WhatsApp"
        >
          <Icon name="MessageCircle" size={18} />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors font-medium"
          aria-label="Поделиться в Twitter/X"
        >
          <Icon name="Twitter" size={18} />
          <span>Twitter</span>
        </button>

        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
            copied
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
          }`}
          aria-label="Скопировать ссылку"
        >
          <Icon name={copied ? 'Check' : 'Link'} size={18} />
          <span>{copied ? 'Скопировано' : 'Копировать'}</span>
        </button>
      </div>
    </div>
  );
}
