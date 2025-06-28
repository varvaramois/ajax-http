//Створіть просту HTML-сторінку з кнопкою та ділянкою для відображення результату запиту.
// Використовуючи AJAX, створіть функцію, яка буде відправляти GET-запит до публічного API (наприклад,
// https://newsapi.org/) та отримувати список статтей по ключовому слову.
//     При кліку на кнопку на сторінці, виконайте AJAX-запит до API та відобразіть результат на сторінці.
//     Реалізуйте обробку помилок, якщо запит до API не вдалося виконати.
//     Виведіть на сторінку повідомлення про помилку, якщо запит не вдалося виконати.

//     Додайте можливість передавати параметри у запиті, наприклад, для фільтрації або сортування результатів.

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".search__input");
  const btn = document.querySelector(".search__button");
  const contentContainer = document.querySelector(
    ".article .article__container"
  );
  const btnBox = document.querySelector(".btn__box");
  const prevPage = document.querySelector(".btn__prev");
  const nextPage = document.querySelector(".btn__next");
  const pageNumberDisplay = document.querySelector(".number");

  // Ініціалізуємо змінні для керування пагінацією та кількістю новин
  let currentPage = 1; // Поточна сторінка, починаємо з першої
  const pageSize = 10; // Кількість статей на одній сторінці
  const maxPages = 5; // Максимально дозволена кількість сторінок для завантаження

  // Асинхронна функція для отримання новин з API
  async function fetchNews() {
    const apiKey = "5c04ec3662f84f0f8a902ef1ff972191"; // Ваш унікальний API ключ для NewsAPI
    const inputValue = input.value.trim(); // Отримуємо значення з поля вводу, видаляючи пробіли

    // Перевіряємо, чи ввів користувач щось у поле пошуку
    if (inputValue === "") {
      // Якщо поле пусте, виводимо повідомлення і ховаємо елементи пагінації
      contentContainer.innerHTML =
        "<p>Будь ласка, введіть ключове слово для пошуку новин.</p>";
      btnBox.classList.add("hidden"); // Ховаємо контейнер з кнопками пагінації
      pageNumberDisplay.textContent = ""; // Очищаємо текст номера сторінки
      return; // Виходимо з функції
    }

    // Показуємо повідомлення про завантаження новин
    contentContainer.innerHTML = "<p>Завантаження новин...</p>";
    btnBox.classList.add("hidden"); 
    pageNumberDisplay.textContent = ""; 

    try {
      // Виконуємо GET-запит до NewsAPI за допомогою fetch
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${inputValue}&page=${currentPage}&pageSize=${pageSize}&sortBy=publishedAt&language=uk&apiKey=${apiKey}`
      );

      // Перевіряємо, чи був запит успішним (статус 200 OK)
      if (!response.ok) {
        // Якщо відповідь не успішна, намагаємося отримати детальне повідомлення про помилку з API
        const errorData = await response.json();
        // Генеруємо нову помилку з повідомленням від API або стандартним повідомленням
        throw new Error(errorData.message || "Помилка при завантаженні новин.");
      }

      // Перетворюємо відповідь у формат JSON
      const data = await response.json();

      // Перевіряємо, чи отримані статті або їх взагалі немає
      if (!data.articles || data.articles.length === 0) {
        // Якщо новин не знайдено, виводимо відповідне повідомлення
        contentContainer.innerHTML =
          "<p>Новин за вашим запитом не знайдено.</p>";
        btnBox.classList.add("hidden"); 
        pageNumberDisplay.textContent = ""; 
        return; 
      }

      contentContainer.innerHTML = "";

      // Перетворюємо масив статей у масив HTML-рядків
      const articlesHTML = data.articles.map((article) => {
        return `
          <article class="article__content">
            <h2 class="article__title">${article.title || "Без заголовка"}</h2>
            <img class="article__image" src="${
              article.urlToImage ||
              "https://via.placeholder.com/300x200?text=No+Image"
            }" alt="Зображення до статті">
            <h3 class="article__description">${
              article.description || "Опис відсутній"
            }</h3>
            <p class="article__date">Опубліковано: ${new Date(
              article.publishedAt
            ).toLocaleString()}</p>
            <p class="article__author">Автор: ${
              article.author || "Невідомо"
            }</p>
            <a class="article__link" href="${
              article.url
            }" target="_blank" rel="noopener noreferrer">Читати повністю</a>
          </article>
        `;
      });
      contentContainer.innerHTML = articlesHTML.join("");

      // Обчислюємо загальну кількість сторінок, обмежуючи її до maxPages
      const totalResults = data.totalResults; // Загальна кількість результатів, доступних на API
      const totalPages = Math.min(Math.ceil(totalResults / pageSize), maxPages); // Розраховуємо кількість сторінок та обмежуємо її

      btnBox.classList.remove("hidden");
      pageNumberDisplay.textContent = `Сторінка ${currentPage} з ${totalPages}`;

      // Встановлюємо стан кнопок пагінації (активні/неактивні)
      prevPage.disabled = currentPage === 1; // Деактивуємо "Попередня", якщо ми на першій сторінці
      nextPage.disabled = currentPage >= totalPages; // Деактивуємо "Наступна", якщо ми на останній сторінці
    } catch (error) {
      // Обробка будь-яких помилок, що виникли під час запиту
      console.error("Помилка:", error); // Виводимо помилку в консоль
      // Відображаємо повідомлення про помилку на сторінці
      contentContainer.innerHTML = `<p class="error-message">Сталася помилка: ${error.message}. Будь ласка, спробуйте ще раз пізніше.</p>`;
      btnBox.classList.add("hidden"); // Ховаємо кнопки пагінації при помилці
      pageNumberDisplay.textContent = ""; // Очищаємо номер сторінки
    }
  }

  // Обробник події кліку для кнопки пошуку
  btn.addEventListener("click", (event) => {
    event.preventDefault(); // Запобігаємо стандартній поведінці кнопки (наприклад, перезавантаженню сторінки)
    currentPage = 1; // При новому пошуку завжди починаємо з першої сторінки
    fetchNews(); // Викликаємо функцію для отримання новин
  });

  // Обробник події кліку для кнопки "Попередня сторінка"
  prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
      // Якщо ми не на першій сторінці, зменшуємо номер поточної сторінки
      currentPage--;
      fetchNews(); // Завантажуємо новини для попередньої сторінки
    }
  });

  // Обробник події кліку для кнопки "Наступна сторінка"
  nextPage.addEventListener("click", () => {
    // Збільшуємо номер поточної сторінки
    currentPage++;
    fetchNews(); // Завантажуємо новини для наступної сторінки
  });
});
