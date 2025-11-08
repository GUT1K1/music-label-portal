import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-primary hover:text-primary/80"
        >
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Договор публичной оферты
          </h1>

          <div className="space-y-6 text-gray-300">
            <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Реквизиты исполнителя</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Индивидуальный предприниматель</p>
                  <p className="text-white font-semibold">Костырев Виктор Николаевич</p>
                </div>
                <div>
                  <p className="text-gray-400">ИНН</p>
                  <p className="text-white font-semibold">463407305547</p>
                </div>
                <div>
                  <p className="text-gray-400">ОГРНИП</p>
                  <p className="text-white font-semibold">324460000036131</p>
                </div>
                <div>
                  <p className="text-gray-400">Адрес</p>
                  <p className="text-white">Россия, Курская обл., Курчатовский р-н, с. Успенка, д. 57</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-400 mb-2">Банковские реквизиты</p>
                  <div className="space-y-1 text-white">
                    <p>Расчётный счёт: <span className="font-mono">40802810900006611334</span></p>
                    <p>Банк: АО «ТБанк»</p>
                    <p>ИНН банка: 7710140679</p>
                    <p>БИК банка: 044525974</p>
                    <p>Корр. счёт: <span className="font-mono">30101810145250000974</span></p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Общие положения</h2>
              <p>
                Настоящий документ представляет собой публичное предложение (оферту) Индивидуального предпринимателя 
                Костырева Виктора Николаевича (ИНН 463407305547, ОГРНИП 324460000036131), действующего под брендом 
                Музыкальный лейбл «420» (далее — «Исполнитель»), в адрес физических и юридических лиц 
                (далее — «Заказчик» или «Артист») о заключении договора на оказание услуг по дистрибуции 
                и продвижению музыкального контента.
              </p>
              <p>
                Акцептом настоящей оферты является регистрация на платформе и загрузка музыкального материала. 
                С момента акцепта оферты договор считается заключённым.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Предмет договора</h2>
              <p>
                Лейбл обязуется оказывать Артисту следующие услуги:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Дистрибуция музыкального контента на стриминговые платформы (Spotify, Apple Music, Яндекс.Музыка и др.)</li>
                <li>Питчинг треков на редакционные плейлисты</li>
                <li>Предоставление аналитики и статистики прослушиваний</li>
                <li>Консультационная поддержка по вопросам продвижения</li>
                <li>Учёт доходов от стриминга</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Права и обязанности сторон</h2>
              
              <h3 className="text-xl font-semibold text-primary mb-3">3.1. Лейбл обязуется:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Качественно и своевременно оказывать услуги по дистрибуции</li>
                <li>Предоставлять достоверную статистику прослушиваний</li>
                <li>Соблюдать конфиденциальность персональных данных Артиста</li>
                <li>Предоставлять техническую поддержку</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-4">3.2. Артист обязуется:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Предоставлять музыкальный контент надлежащего качества</li>
                <li>Гарантировать наличие всех необходимых авторских прав</li>
                <li>Не загружать контент, нарушающий права третьих лиц</li>
                <li>Своевременно вносить плату за услуги (при наличии)</li>
                <li>Не распространять ложную информацию о Лейбле</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Стоимость услуг и порядок расчётов</h2>
              <p>
                Стоимость услуг определяется согласно действующему прайс-листу, размещённому на сайте Лейбла.
              </p>
              <p>
                Лейбл удерживает комиссию от доходов, полученных от дистрибуции музыкального контента. 
                Размер комиссии составляет от 15% до 30% в зависимости от условий договора.
              </p>
              <p>
                Расчёты производятся ежемесячно по факту получения выплат от стриминговых платформ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Ответственность сторон</h2>
              <p>
                За неисполнение или ненадлежащее исполнение обязательств по настоящему договору Стороны 
                несут ответственность в соответствии с действующим законодательством Российской Федерации.
              </p>
              <p>
                Лейбл не несёт ответственности за:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Задержки выплат со стороны стриминговых платформ</li>
                <li>Отказ редакций плейлистов в размещении треков</li>
                <li>Низкие показатели прослушиваний</li>
                <li>Действия третьих лиц (платформ, правообладателей)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Конфиденциальность</h2>
              <p>
                Стороны обязуются не разглашать конфиденциальную информацию, полученную в ходе исполнения договора, 
                за исключением случаев, предусмотренных законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Срок действия и расторжение договора</h2>
              <p>
                Договор вступает в силу с момента акцепта оферты и действует до полного исполнения обязательств Сторонами.
              </p>
              <p>
                Каждая из Сторон вправе расторгнуть договор в одностороннем порядке, уведомив другую Сторону 
                за 30 календарных дней.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Порядок приёмки и оплаты услуг</h2>
              <p>
                Оплата услуг производится путём перечисления денежных средств на расчётный счёт Исполнителя:
              </p>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 my-4 text-sm">
                <p className="font-semibold text-white mb-2">Реквизиты для оплаты:</p>
                <p>Получатель: ИП Костырев Виктор Николаевич</p>
                <p>ИНН: 463407305547</p>
                <p>Расчётный счёт: <span className="font-mono">40802810900006611334</span></p>
                <p>Банк: АО «ТБанк»</p>
                <p>БИК: 044525974</p>
                <p>Корр. счёт: <span className="font-mono">30101810145250000974</span></p>
              </div>
              <p>
                Услуги считаются оказанными и принятыми Заказчиком с момента размещения контента 
                на стриминговых платформах, если в течение 5 рабочих дней не поступили мотивированные возражения.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Заключительные положения</h2>
              <p>
                Все споры и разногласия решаются путём переговоров. При недостижении согласия спор передаётся 
                на рассмотрение в Арбитражный суд Курской области (для юридических лиц и ИП) или 
                мировой/районный суд по месту нахождения Исполнителя (для физических лиц).
              </p>
              <p>
                Настоящая оферта может быть изменена Исполнителем в одностороннем порядке с уведомлением Заказчиков 
                не менее чем за 10 календарных дней путём размещения новой редакции на сайте.
              </p>
            </section>

            <section className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Дата публикации: 08.11.2025<br />
                Версия документа: 1.0
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}