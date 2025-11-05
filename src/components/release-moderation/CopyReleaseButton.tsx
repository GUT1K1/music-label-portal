import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import type { Release } from "./types";

interface CopyReleaseButtonProps {
  release: Release;
}

export default function CopyReleaseButton({ release }: CopyReleaseButtonProps) {
  const { toast } = useToast();

  const copyReleaseInfo = async () => {
    let text = `📀 РЕЛИЗ: ${release.release_name}\n`;
    text += `═══════════════════════════════════════\n\n`;

    text += `👤 ОСНОВНАЯ ИНФОРМАЦИЯ\n`;
    text += `─────────────────────────────────────\n`;
    text += `Артист: ${release.artist_name}\n`;
    if (release.release_date) {
      text += `Дата релиза: ${new Date(release.release_date).toLocaleDateString('ru-RU')}\n`;
    }
    if (release.genre) {
      text += `Жанр: ${release.genre}\n`;
    }
    if (release.copyright) {
      text += `Копирайт: ${release.copyright}\n`;
    }
    text += `\n`;

    if (release.preorder_date || release.sales_start_date || release.price_category || release.title_language) {
      text += `📋 ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ\n`;
      text += `─────────────────────────────────────\n`;
      if (release.preorder_date) {
        text += `Дата предзаказа: ${new Date(release.preorder_date).toLocaleDateString('ru-RU')}\n`;
      }
      if (release.sales_start_date) {
        text += `Начало продаж: ${new Date(release.sales_start_date).toLocaleDateString('ru-RU')}\n`;
      }
      if (release.price_category) {
        text += `Ценовая категория: ${release.price_category}\n`;
      }
      if (release.title_language) {
        text += `Язык названия: ${release.title_language}\n`;
      }
      text += `\n`;
    }

    if (release.tracks && release.tracks.length > 0) {
      text += `🎵 ТРЕКИ (${release.tracks.length})\n`;
      text += `═══════════════════════════════════════\n\n`;

      release.tracks.forEach((track, index) => {
        text += `${track.track_number}. ${track.title}`;
        if (track.explicit_content) {
          text += ` [18+]`;
        }
        text += `\n`;
        text += `   ─────────────────────────────────────\n`;
        
        if (track.composer) {
          text += `   🎼 Автор музыки: ${track.composer}\n`;
        }
        if (track.author_lyrics) {
          text += `   ✍️  Автор текста: ${track.author_lyrics}\n`;
        }
        if (track.author_phonogram) {
          text += `   💿 Автор фонограммы: ${track.author_phonogram}\n`;
        }
        if (track.language_audio) {
          text += `   🌐 Язык: ${track.language_audio}\n`;
        }
        if (track.explicit_content !== undefined) {
          text += `   🛡️  Рейтинг: ${track.explicit_content ? '18+ (Нецензурный контент)' : '0+ (Без ограничений)'}\n`;
        }
        if (track.tiktok_preview_start !== undefined && track.tiktok_preview_start !== null) {
          text += `   🎬 TikTok превью: ${track.tiktok_preview_start}с\n`;
        }
        if (track.lyrics_text) {
          text += `   📝 Текст песни:\n`;
          text += `   ${track.lyrics_text.split('\n').join('\n   ')}\n`;
        }
        text += `\n`;
      });
    }

    if (release.pitching) {
      text += `📣 ПИТЧИНГ\n`;
      text += `═══════════════════════════════════════\n`;
      text += `Описание артиста: ${release.pitching.artist_description}\n`;
      text += `Описание релиза: ${release.pitching.release_description}\n`;
      text += `Плейлисты: ${release.pitching.playlist_fit}\n`;
      text += `Текущий охват: ${release.pitching.current_reach}\n`;
      if (release.pitching.preview_link) {
        text += `Превью: ${release.pitching.preview_link}\n`;
      }
      text += `\n`;
    }

    text += `═══════════════════════════════════════\n`;
    text += `Статус: ${release.status}\n`;
    text += `Создан: ${new Date(release.created_at).toLocaleString('ru-RU')}\n`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      toast({
        title: "Скопировано!",
        description: "Информация о релизе скопирована в буфер обмена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать информацию",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyReleaseInfo}
      className="gap-2"
    >
      <Icon name="Copy" size={14} />
      Скопировать все данные
    </Button>
  );
}