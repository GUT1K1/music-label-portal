import Icon from "@/components/ui/icon";
import type { Track } from "./types";

interface TracksOverviewProps {
  tracks: Track[];
}

export default function TracksOverview({ tracks }: TracksOverviewProps) {
  if (!tracks || tracks.length === 0) return null;

  const explicitCount = tracks.filter(t => t.explicit_content).length;
  const withLyricsCount = tracks.filter(t => t.lyrics_text).length;
  const languages = [...new Set(tracks.map(t => t.language_audio).filter(Boolean))];
  const composers = [...new Set(tracks.map(t => t.composer).filter(Boolean))];
  const lyricists = [...new Set(tracks.map(t => t.author_lyrics).filter(Boolean))];

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Icon name="ListMusic" size={16} />
        Сводка по трекам
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Music" size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Всего треков</p>
            <p className="text-sm font-bold">{tracks.length}</p>
          </div>
        </div>

        {explicitCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <Icon name="Shield" size={14} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">18+</p>
              <p className="text-sm font-bold text-red-500">{explicitCount}</p>
            </div>
          </div>
        )}

        {withLyricsCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Icon name="FileText" size={14} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">С текстами</p>
              <p className="text-sm font-bold">{withLyricsCount}</p>
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Icon name="Languages" size={14} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Языков</p>
              <p className="text-sm font-bold">{languages.length}</p>
            </div>
          </div>
        )}
      </div>

      {(composers.length > 0 || lyricists.length > 0) && (
        <div className="mt-3 pt-3 border-t space-y-2">
          {composers.length > 0 && (
            <div className="flex items-start gap-2">
              <Icon name="Music2" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Композиторы</p>
                <p className="text-xs font-medium">{composers.join(", ")}</p>
              </div>
            </div>
          )}
          {lyricists.length > 0 && (
            <div className="flex items-start gap-2">
              <Icon name="PenTool" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Авторы текстов</p>
                <p className="text-xs font-medium">{lyricists.join(", ")}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
