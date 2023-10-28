const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i == 0
        ? currency_code == "USD"
          ? "selected"
          : ""
        : currency_code == "VND"
        ? "selected"
        : "";
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate .text");
  let amountVal = amount.value;
  if (amountVal == "" || amountVal == "0") {
    exchangeRateTxt.innerText = "Please fill out the amount field !";
    return 0;
  }
  exchangeRateTxt.style.opacity = "0";
  let url = `https://v6.exchangerate-api.com/v6/d809ddc861e1f423328a2003/latest/USD`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);

      setTimeout(() => {
        exchangeRateTxt.style.opacity = "1";
      }, 100);

      exchangeRateTxt.innerText = `${new Intl.NumberFormat("en-US").format(
        amountVal
      )} ${fromCurrency.value} \n = \n ${new Intl.NumberFormat("en-US").format(
        totalExRate
      )} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "An error occured, please reload the page !";
    });
}
