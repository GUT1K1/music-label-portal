import Icon from "@/components/ui/icon";
import type { Release } from "./types";

interface ReleaseMetadataSectionProps {
  release: Release;
}

export default function ReleaseMetadataSection({ release }: ReleaseMetadataSectionProps) {
  const metadata = [
    { 
      icon: "Copyright", 
      label: "Копирайт", 
      value: release.copyright,
      show: !!release.copyright
    },
    { 
      icon: "Clock", 
      label: "Дата предзаказа", 
      value: release.preorder_date ? new Date(release.preorder_date).toLocaleDateString('ru-RU') : null,
      show: !!release.preorder_date
    },
    { 
      icon: "DollarSign", 
      label: "Начало продаж", 
      value: release.sales_start_date ? new Date(release.sales_start_date).toLocaleDateString('ru-RU') : null,
      show: !!release.sales_start_date
    },
    { 
      icon: "Tag", 
      label: "Ценовая категория", 
      value: release.price_category,
      show: !!release.price_category
    },
    { 
      icon: "Languages", 
      label: "Язык названия", 
      value: release.title_language,
      show: !!release.title_language
    },
  ].filter(item => item.show);

  if (metadata.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Icon name="Info" size={16} />
        Дополнительная информация
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <Icon name={item.icon} size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
