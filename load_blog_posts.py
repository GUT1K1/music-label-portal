import requests
import json

# URL backend API для создания статей
API_URL = "https://functions.poehali.dev/d61fe125-c1fe-446c-a35b-79bd0f0ae128"

# ID пользователя
USER_ID = "1"

# Список статей для загрузки (только первые 3 для примера, так как в текущей версии только 1)
posts = [
    {
        "title": "Сколько прослушиваний в ТОП 1?",
        "slug": "skolko-proslushivaniy-v-top-1",
        "excerpt": "Актуальная статистика 2025 года: сколько нужно прослушиваний для попадания в чарты на всех популярных платформах. Реальные примеры артистов.",
        "content": """<h2>Сколько прослушиваний нужно для ТОП-1 в 2025?</h2>
      <p>Попадание в топ чартов — мечта каждого артиста. Но сколько именно прослушиваний для этого требуется? Мы проанализировали данные за 2025 год и вот что выяснили.</p>""",
        "image": "https://cdn.poehali.dev/files/81d2b3fc-e7ee-4995-b5b8-6fd9eb0b0ac8.png",
        "category": "Аналитика"
    }
]

success_count = 0
error_count = 0

for post in posts:
    payload = {
        "title": post["title"],
        "slug": post["slug"],
        "excerpt": post["excerpt"],
        "content": post["content"],
        "image_url": post["image"],
        "category": post["category"],
        "published": True
    }
    
    try:
        response = requests.post(
            API_URL,
            json=payload,
            headers={
                "Content-Type": "application/json",
                "X-User-Id": USER_ID
            }
        )
        
        if response.status_code in [200, 201]:
            success_count += 1
            print(f"✓ Загружена статья: {post['title']} - Status: {response.status_code}")
        else:
            error_count += 1
            print(f"✗ Ошибка при загрузке: {post['title']} - Status: {response.status_code}, Response: {response.text}")
    except Exception as e:
        error_count += 1
        print(f"✗ Исключение при загрузке: {post['title']} - Error: {str(e)}")

print(f"\n{'='*50}")
print(f"Итого: {success_count} успешно загружено, {error_count} ошибок")
print(f"{'='*50}")
