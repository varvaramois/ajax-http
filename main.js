//Створіть просту HTML-сторінку з кнопкою та ділянкою для відображення результату запиту.
// Використовуючи AJAX, створіть функцію, яка буде відправляти GET-запит до публічного API (наприклад,
// https://newsapi.org/) та отримувати список статтей по ключовому слову.
//     При кліку на кнопку на сторінці, виконайте AJAX-запит до API та відобразіть результат на сторінці.
//     Реалізуйте обробку помилок, якщо запит до API не вдалося виконати.
//     Виведіть на сторінку повідомлення про помилку, якщо запит не вдалося виконати.

//     Додайте можливість передавати параметри у запиті, наприклад, для фільтрації або сортування результатів.

const input = document.querySelector(".search__input");
const btn = document.querySelector(".search__button");

btn.addEventListener("click", function () {
  const apiKey = "5c04ec3662f84f0f8a902ef1ff972191";
  const inputValue = input.value.trim();
  if (inputValue === "") {
    alert("Введіть щось");
    return;
  }

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);
  const fromDateString = fromDate.toISOString().split("T")[0];

  fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      inputValue
    )}&from=${fromDateString}&sortBy=publishedAt&apiKey=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Помилка при завантаженні новин");
      }
      return response.json();
    })
    .then((data) => {
      const contentContainer = document.querySelector(".article");
      contentContainer.classList.remove("hidden");

      if (!data.articles || data.articles.length === 0) {
        contentContainer.innerHTML = "<p>Новин не знайдено.</p>";
        return;
      }

      const articlesHTML = data.articles.map((article) => {
        return `
          <article class="article__content">
            <h2 class="article__title">${article.title}</h2>
            <img class="article__image" src="${
              article.urlToImage || "placeholder.jpg"
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
            <a class="article__link" href="${article.url}" target="_blank">Читати повністю</a>
          </article>
        `;
      });

      contentContainer.innerHTML = articlesHTML.join("");
    })
    .catch((error) => {
      console.error(error);
      alert("Сталася помилка при завантаженні новин.");
    });
});

