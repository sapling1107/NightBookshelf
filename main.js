const books = [
  {
    id: "1",
    title: "戀與夜色",
    author: "某某",
    category: "bl",
    cover: "https://placehold.co/200x300?text=BL1",
    description: "一段都市夜色中悄然萌芽的戀情。",
    links: {
      bookwalker: "#",
      readmoo: "#",
      booksTw: "#"
    }
  },
  {
    id: "2",
    title: "極簡生活術",
    author: "某某",
    category: "practical",
    cover: "https://placehold.co/200x300?text=實用1",
    description: "讓你重新掌控生活的整理智慧。",
    links: {
      bookwalker: "#",
      readmoo: "#",
      booksTw: "#"
    }
  },
  {
    id: "3",
    title: "月光之下",
    author: "某某",
    category: "horror",
    cover: "https://placehold.co/200x300?text=靈異1",
    description: "一位少女遇上了夢境般的詭異事件⋯⋯",
    links: {
      bookwalker: "#",
      readmoo: "#",
      booksTw: "#"
    }
  }
];

const bookList = document.getElementById("book-list");
const bookPreview = document.getElementById("book-preview");
const previewContent = document.getElementById("preview-content");
const wishlistBtn = document.getElementById("wishlist-btn");
const wishlistSection = document.getElementById("wishlist");
const wishlistItems = document.getElementById("wishlist-items");
const backBtn = document.getElementById("back-btn");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function renderBooks(category) {
  bookList.innerHTML = "";
  bookList.classList.remove("hidden");
  bookPreview.classList.add("hidden");
  wishlistSection.classList.add("hidden");
  const filtered = books.filter(b => b.category === category);
  filtered.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    const img = document.createElement("img");
    img.src = book.cover;
    img.alt = book.title;
    img.addEventListener("click", () => showPreview(book));

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = book.title;

    const author = document.createElement("div");
    author.className = "author";
    author.textContent = book.author;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(author);
    bookList.appendChild(card);
  });
}

function showPreview(book) {
  previewContent.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>作者：</strong>${book.author}</p>
    <img src="${book.cover}" alt="${book.title}" style="max-width: 150px;" />
    <p>${book.description}</p>
    <p>
      <button onclick="addToWishlist('${book.id}')">
        ${wishlist.includes(book.id) ? "已在願望書單（再次點擊可移除）" : "加入願望書單"}
      </button>
    </p>
    <p>
      <a href="${book.links.bookwalker}" target="_blank">前往 BookWalker</a> |
      <a href="${book.links.readmoo}" target="_blank">Readmoo</a> |
      <a href="${book.links.booksTw}" target="_blank">博客來</a>
    </p>
  `;
  bookList.classList.add("hidden");
  bookPreview.classList.remove("hidden");
}

function addToWishlist(id) {
  const index = wishlist.indexOf(id);
  if (index === -1) {
    wishlist.push(id);
  } else {
    wishlist.splice(index, 1);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showWishlist();
}

function showWishlist() {
  wishlistItems.innerHTML = "";
  bookList.classList.add("hidden");
  bookPreview.classList.add("hidden");
  wishlistSection.classList.remove("hidden");

  const wishedBooks = books.filter(b => wishlist.includes(b.id));
  if (wishedBooks.length === 0) {
    wishlistItems.innerHTML = "<p style='text-align:center;color:#777'>書單目前是空的喔～</p>";
    return;
  }

  wishedBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    const img = document.createElement("img");
    img.src = book.cover;
    img.alt = book.title;
    img.title = "點擊查看";
    img.addEventListener("click", () => showPreview(book));

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = book.title;

    const author = document.createElement("div");
    author.className = "author";
    author.textContent = book.author;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "移除";
    removeBtn.style.marginTop = "0.3rem";
    removeBtn.onclick = () => {
      wishlist = wishlist.filter(id => id !== book.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      showWishlist();
    };

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(removeBtn);
    wishlistItems.appendChild(card);
  });
}

backBtn.addEventListener("click", () => {
  bookPreview.classList.add("hidden");
  wishlistSection.classList.add("hidden");
  bookList.classList.remove("hidden");
});

wishlistBtn.addEventListener("click", showWishlist);

document.querySelectorAll("[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.getAttribute("data-category");
    renderBooks(cat);
  });
});

renderBooks("bl");
