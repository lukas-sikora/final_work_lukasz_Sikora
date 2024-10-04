import { rowData } from "./data.js";

const header = document.createElement("header");
const main = document.createElement("main");
const footer = document.createElement("footer");
const menu = document.createElement("div");
menu.className = "menu";

const headerText = document.createElement("div");
headerText.className = "header-text";
headerText.textContent = "Write Yoda or Vader and hear their voices!";

const buttonThemeBox = document.createElement("div");
buttonThemeBox.className = "buttons-theme-box";

const colorfulTheme = document.createElement("button");
colorfulTheme.textContent = "Colorful Theme";
colorfulTheme.className = "theme-buttons colorful-button";
const darkTheme = document.createElement("button");
darkTheme.textContent = "Dark Theme";
darkTheme.className = "theme-buttons dark-button";

darkTheme.addEventListener("click", () => {
  document.body.classList.add("dark-theme");
});
colorfulTheme.addEventListener("click", () => {
  document.body.classList.remove("dark-theme");
});

const imgWrapper = document.createElement("div");
imgWrapper.className = "img-wrapper";

const logo = document.createElement("img");
logo.src = "images/icons8-star-wars-480.png";
logo.className = "logo";

const tableWrapper = document.createElement("div");
tableWrapper.className = "table-wrapper";

const emptyInfo = document.createElement("p");
emptyInfo.textContent = "Brak elementów do wyświetlenia";

const searchById = document.createElement("input");
const searchByText = document.createElement("input");
const inputSite = document.createElement("input");

const table = document.createElement("table");
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

const inputSiteInfo = document.createElement("span");
const leftArrow = document.createElement("button");
leftArrow.className = "pagination-buttons arrow-left";
const rightArrow = document.createElement("button");
rightArrow.className = "pagination-buttons arrow-right";

let currentPage = 1;
let rowsPerPage = 10;
let totalRows = 0;
let totalPages = 0;

document.body.append(header, main, footer);
header.append(headerText, buttonThemeBox);
buttonThemeBox.append(colorfulTheme, darkTheme);
main.append(menu, imgWrapper, tableWrapper);
imgWrapper.append(logo);
let activeButton = "";

function createMenuButton(rowData) {
  const keys = Object.keys(rowData);
  keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key.toUpperCase();
    button.className = "menu-buttons";
    menu.append(button);
    button.addEventListener("click", () => {
      if (activeButton) {
        activeButton.classList.remove("active-category");
      }
      button.classList.add("active-category");
      activeButton = button;
      menuButtonClick(key);
    });
  });
}
createMenuButton(rowData);

function menuButtonClick(menuCategory) {
  logo.remove();
  emptyInfo.remove();

  const displayedThead = document.querySelector("thead");
  if (displayedThead) displayedThead.innerHTML = "";
  const displayedTbody = document.querySelector("tbody");
  if (displayedTbody) displayedTbody.innerHTML = "";
  const data = rowData[menuCategory];

  currentPage = 1;
  const rowThead = document.createElement("tr");

  // tworzenie thead
  const headersKey = Object.keys(data[0]).slice(0, 3);
  const headers = ["ID", ...headersKey, "CREATED", "ACTION"];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header.replace("_", " ").toUpperCase();
    rowThead.append(th);
  });

  thead.append(rowThead);

  // wyszukiwarka po ID
  const displayedSearches = document.querySelector(".search-box");
  if (displayedSearches) displayedSearches.remove();
  const searchBox = document.createElement("div");
  searchBox.className = "search-box";
  const searchTitle1 = document.createElement("span");
  searchTitle1.textContent = "Search by Index";
  searchById.type = "number";
  searchById.className = "searchers search-by-index";

  searchById.addEventListener("input", () => {
    const searchId = parseInt(searchById.value);
    const searchRowById = tbody.querySelectorAll("tr");

    if (!isNaN(searchId) && searchId > 0) {
      searchRowById.forEach((row) => {
        const idCell = row.querySelector("td");
        const rowId = parseInt(idCell.textContent);
        if (rowId === searchId) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    } else {
      if (isNaN(searchId)) displayPages();
    }
  });

  // wyszukiwarka po name/title

  const searechTitle2 = document.createElement("span");
  searechTitle2.textContent = "Search by text";
  searchByText.className = "searchers";
  searchByText.type = "text";
  if (menuCategory !== "films") {
    searchByText.placeholder = `Search by name`;
  } else {
    searchByText.placeholder = `Search by title`;
  }

  searchByText.addEventListener("input", () => {
    const searchText = searchByText.value.toLowerCase();
    const searchRowByText = tbody.querySelectorAll("tr");
    searchRowByText.forEach((row) => {
      const nameOrTitleCell = row.querySelector("td:nth-child(2)");
      const nameOrTitleText = nameOrTitleCell.textContent.toLowerCase();

      if (nameOrTitleText.includes(`${searchText}`)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
      if (searchText === "") {
        displayPages();
      }
    });
  });

  tableWrapper.append(table);
  table.append(thead);
  tableWrapper.before(searchBox);
  searchBox.append(searchTitle1, searchById, searechTitle2, searchByText);

  createTbody(data, tbody);
  createdPagination();
  currentValuePlaceholder();
}

function createTbody(data, tbody) {
  data.forEach((element, index) => {
    const rowTbody = document.createElement("tr");

    // tworzenie komórek ID
    const idCell = document.createElement("td");
    idCell.textContent = index + 1;
    rowTbody.append(idCell);

    // tworzenie trzech wybranych komórek
    const headersKey = Object.keys(data[0]).slice(0, 3);
    headersKey.forEach((key) => {
      const cell = document.createElement("td");
      cell.textContent = element[key];
      rowTbody.append(cell);

    });

    // tworzenie komórek created
    const createdCell = document.createElement("td");
    const changedDate = formatDate(element.created);
    createdCell.textContent = changedDate;

    // tworzenie komórek action
    const actionCell = document.createElement("td");
    actionCell.className = "action-cell";

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", () => {
      rowTbody.remove();

      const rowsToDisplay = document.querySelectorAll("tbody tr");
      totalRows = rowsToDisplay.length;
      totalPages = Math.ceil(totalRows / rowsPerPage);

      if (rowsToDisplay.length === 0 && currentPage > 1) {
        currentPage--;
      }
      displayPages();
      currentValuePlaceholder();

      if (totalRows === 0) {
        const paginationToRemove = document.querySelector(
          ".pagination-wrapper"
        );
        paginationToRemove.remove();
        main.append(emptyInfo);
      }
    });

    const detailsButton = document.createElement("button");
    detailsButton.className = "details-button";
    detailsButton.addEventListener("click", () => {
      main.style = "opacity: 0.2";
      createModalTable(element);
    });

    // tworzenie checkboxów
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "delete-all";
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        rowTbody.classList.add("remove-all");
      } else {
        rowTbody.classList.remove("remove-all");
      }
      checkboxesSupport();
    });

    actionCell.append(deleteButton, detailsButton, checkbox);
    rowTbody.append(createdCell, actionCell);
    tbody.append(rowTbody);
    table.append(tbody);
    currentValuePlaceholder();
  });
}

// obsługa checkboxów
let removeAllButton;

function checkboxesSupport() {
  const allRowsForDeleting = document.querySelectorAll(".remove-all");
  const somRowSelected = allRowsForDeleting.length > 0;
  if (somRowSelected && !removeAllButton) {
    const tbody = document.querySelector("tbody");
    removeAllButton = document.createElement("button");
    removeAllButton.textContent = "Remove all";
    removeAllButton.className = "remove-all-button";
    table.before(removeAllButton);
  } else if (!somRowSelected && removeAllButton) {
    removeAllButton.remove();
    removeAllButton = null;
  }

  removeAllButton.addEventListener("click", () => {
    allRowsForDeleting.forEach((row) => row.remove());
    currentValuePlaceholder();
    if (removeAllButton) removeAllButton.remove();
    removeAllButton = null;

    const rowsToDisplay = document.querySelectorAll("tbody tr");
    totalRows = rowsToDisplay.length;
    totalPages = Math.ceil(totalRows / rowsPerPage);

    if (rowsToDisplay.length === 0 && currentPage > 1) {
      currentPage--;
    }
    displayPages();
    currentValuePlaceholder();
  });
}

// tworzenie modala
function createModalTable(data) {
  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = "Close";
  
  closeButton.addEventListener("click", () => {
    modalWindow.remove();
    main.style = "opacity:1";
  });
  
  const modalWindow = document.createElement("div");
  modalWindow.className = "modal-window";
  
  // tabela w modalu
  const modalTable = document.createElement("table");
  modalTable.className = ".modal-table";
  const modalThead = document.createElement("thead");
  modalThead.className = "modal-thead";
  const modalTbody = document.createElement("tbody");
  modalTbody.className = "modal-tbody";

  const headerModalTable = document.createElement("tr");
  headerModalTable.className = "modal-header-tr";
  const headerKeyCell = document.createElement("th");
  headerKeyCell.textContent = ` KEY `;
  headerKeyCell.className = "modal-th";
  const headerValueCell = document.createElement("th");
  headerValueCell.textContent = "VALUE";
  headerValueCell.className = "modal-th";
  headerModalTable.append(headerKeyCell, headerValueCell);
  modalThead.append(headerModalTable);
  modalTable.append(modalThead, modalTbody);

  // tworzenie body tabeli modalu
  Object.entries(data).forEach(([key, value]) => {
    const rowModalTbody = document.createElement("tr");
    rowModalTbody.className = "modal-tr";
    const keyCellModalTbody = document.createElement("td");
    keyCellModalTbody.innerText = key;
    keyCellModalTbody.className = "modal-td";
    const valueCellModalTbody = document.createElement("td");
    valueCellModalTbody.className = "modal-td";
    valueCellModalTbody.textContent = value;
    rowModalTbody.append(keyCellModalTbody, valueCellModalTbody);
    modalTbody.append(rowModalTbody);
  });

  
  modalWindow.append(closeButton, modalTable);
  document.body.append(modalWindow);
  }


// PAGINACJA

function createdPagination() {
  const displayedPagination = document.querySelector(".pagination-wrapper");
  if (displayedPagination) displayedPagination.remove();
  const rowsToDisplay = document.querySelectorAll("tbody tr");

  const pagination = document.createElement("div");
  pagination.className = "pagination-wrapper";

  const select = document.createElement("select");
  const option10 = document.createElement("option");
  option10.value = "10";
  option10.textContent = "10";
  const option20 = document.createElement("option");
  option20.value = "20";
  option20.textContent = "20";
  select.append(option10, option20);
  rowsPerPage = 10;
  totalRows = rowsToDisplay.length;
  totalPages = Math.ceil(totalRows / rowsPerPage);
  select.value = 10;
  inputSite.type = "number";
  inputSite.placeholder = "1";
  inputSite.value = currentPage;
  inputSite.className = "input-site-number";
  inputSiteInfo.className = "input-site-info";
  inputSiteInfo.textContent = `  z  ${totalPages}`;

  main.append(pagination);
  pagination.append(leftArrow, inputSite, inputSiteInfo, rightArrow, select);

  displayPages();

  select.addEventListener("change", () => {
    rowsPerPage = parseInt(select.value);
    totalPages = Math.ceil(totalRows / rowsPerPage);

    const firstVisibleRow = (currentPage - 1) * rowsPerPage + 1;
    currentPage = Math.ceil(firstVisibleRow / rowsPerPage);

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    displayPages();
  });

  inputSite.addEventListener("input", () => {
    let inputPage = parseInt(inputSite.value);
    if (isNaN(inputPage)) {
      inputPage = currentPage;
    } else if (inputPage < 1) {
      inputPage = 1;
    } else if (inputPage > totalPages) {
      inputPage = totalPages;
    }
    console.log(inputPage);
    currentPage = inputPage;
    displayPages();
  });
}

leftArrow.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
  }
  displayPages();
});

rightArrow.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
  }
  displayPages();
});

function disableArrows() {
  leftArrow.disabled = currentPage === 1;
  leftArrow.disabled
    ? (leftArrow.style.opacity = "0.5")
    : (leftArrow.style.opacity = "1");
  rightArrow.disabled = currentPage === totalPages;
  rightArrow.disabled
    ? (rightArrow.style.opacity = "0.5")
    : (rightArrow.style.opacity = "1");
}
function displayPages() {
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const rowsToDisplay = document.querySelectorAll("tbody tr");

  rowsToDisplay.forEach((row, index) => {
    if (index >= start && index < end) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  if (document.activeElement !== inputSite) {
    inputSite.value = currentPage;
  }

  inputSiteInfo.textContent = `  z  ${totalPages}`;
  disableArrows();
  
}

function formatDate(dateFromCreated) {
  const date = new Date(dateFromCreated);
  const day = String(date.getDay()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}



function currentValuePlaceholder() {
  const currentLengthTable = document.querySelectorAll("tbody tr").length;
  searchById.placeholder = `1 form ${currentLengthTable}`;
}

// ukryta funkcja
const vaderAudio = new Audio("sound/Voicy_Darth Vader Father.mp3");
const yodaAudio = new Audio("sound/Voicy_Yoda_ Feel Force.mp3");

let inputLetters = [];

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase(); // Zamiana klawisza na małe litery

  inputLetters.push(key);

  if (inputLetters.join("").includes("vader")) {
    vaderAudio.play(); 
    inputLetters = []; 
  }
  
  if (inputLetters.join("").includes("yoda")) {
    yodaAudio.play(); 
    inputLetters = []; 
  }
  
  if (inputLetters.length > 5) {
    inputLetters = []; 
  }
  
});

