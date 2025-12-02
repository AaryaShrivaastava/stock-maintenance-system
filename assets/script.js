// assets/script.js

document.addEventListener("DOMContentLoaded", () => {
  // Initial data
  let products = [
    { id: 1, name: "Laptop HP Pavilion", sku: "LAP001", category: "Electronics", quantity: 15, minStock: 10, maxStock: 50, price: 45000, supplier: "Tech Distributors" },
    { id: 2, name: "Office Chair Ergonomic", sku: "CHR001", category: "Furniture", quantity: 8, minStock: 15, maxStock: 40, price: 8500, supplier: "Furniture Pro" },
    { id: 3, name: "Printer Canon MX490", sku: "PRT001", category: "Electronics", quantity: 5, minStock: 8, maxStock: 25, price: 12000, supplier: "Office Supplies Ltd" },
    { id: 4, name: "Desk Lamp LED", sku: "LMP001", category: "Accessories", quantity: 25, minStock: 20, maxStock: 60, price: 1500, supplier: "Lighting World" },
    { id: 5, name: "Wireless Mouse", sku: "MOU001", category: "Accessories", quantity: 3, minStock: 15, maxStock: 50, price: 800, supplier: "Tech Distributors" }
  ];

  const categories = ["All", "Electronics", "Furniture", "Accessories", "Stationery"];

  // State variables
  let searchTerm = "";
  let filterCategory = "All";
  let modalMode = "add"; // "add" or "edit"
  let currentProductId = null;

  // DOM elements
  const inventoryTabBtn = document.getElementById("inventoryTabBtn");
  const analyticsTabBtn = document.getElementById("analyticsTabBtn");
  const inventoryTab = document.getElementById("inventoryTab");
  const analyticsTab = document.getElementById("analyticsTab");

  const totalProductsEl = document.getElementById("totalProducts");
  const lowStockCountEl = document.getElementById("lowStockCount");
  const overstockCountEl = document.getElementById("overstockCount");
  const totalValueEl = document.getElementById("totalValue");

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productsTableBody = document.getElementById("productsTableBody");

  const lowStockList = document.getElementById("lowStockList");
  const categoryDistribution = document.getElementById("categoryDistribution");

  const openAddModalBtn = document.getElementById("openAddModalBtn");
  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const submitProductBtn = document.getElementById("submitProductBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");

  const productNameInput = document.getElementById("productName");
  const productSkuInput = document.getElementById("productSku");
  const productCategorySelect = document.getElementById("productCategory");
  const productQuantityInput = document.getElementById("productQuantity");
  const productMinStockInput = document.getElementById("productMinStock");
  const productMaxStockInput = document.getElementById("productMaxStock");
  const productPriceInput = document.getElementById("productPrice");
  const productSupplierInput = document.getElementById("productSupplier");

  // Helpers
  const getLowStockItems = () => products.filter(p => p.quantity <= p.minStock);
  const getOverstockItems = () => products.filter(p => p.quantity >= p.maxStock);
  const getTotalValue = () => products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  const getStockStatus = product => {
    if (product.quantity <= product.minStock) return "low";
    if (product.quantity >= product.maxStock) return "overstock";
    return "normal";
  };

  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Tab switching
  function showTab(tabName) {
    if (tabName === "inventory") {
      inventoryTab.classList.remove("hidden");
      analyticsTab.classList.add("hidden");
      inventoryTabBtn.classList.add("border-indigo-600", "text-indigo-600");
      inventoryTabBtn.classList.remove("text-gray-600");
      analyticsTabBtn.classList.remove("border-indigo-600", "text-indigo-600");
      analyticsTabBtn.classList.add("text-gray-600");
    } else {
      inventoryTab.classList.add("hidden");
      analyticsTab.classList.remove("hidden");
      analyticsTabBtn.classList.add("border-indigo-600", "text-indigo-600");
      analyticsTabBtn.classList.remove("text-gray-600");
      inventoryTabBtn.classList.remove("border-indigo-600", "text-indigo-600");
      inventoryTabBtn.classList.add("text-gray-600");
    }
  }

  inventoryTabBtn.addEventListener("click", () => showTab("inventory"));
  analyticsTabBtn.addEventListener("click", () => showTab("analytics"));

  // Modal functions
  function openModal(mode, productId = null) {
    modalMode = mode;
    currentProductId = productId;

    // Populate category options
    productCategorySelect.innerHTML = categories
      .filter(c => c !== "All")
      .map(cat => `<option value="${cat}">${cat}</option>`)
      .join("");

    if (mode === "edit" && productId !== null) {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      modalTitle.textContent = "Edit Product";
      submitProductBtn.textContent = "Update Product";

      productNameInput.value = product.name;
      productSkuInput.value = product.sku;
      productCategorySelect.value = product.category;
      productQuantityInput.value = product.quantity;
      productMinStockInput.value = product.minStock;
      productMaxStockInput.value = product.maxStock;
      productPriceInput.value = product.price;
      productSupplierInput.value = product.supplier || "";
    } else {
      modalTitle.textContent = "Add New Product";
      submitProductBtn.textContent = "Add Product";

      productNameInput.value = "";
      productSkuInput.value = "";
      productCategorySelect.value = "Electronics";
      productQuantityInput.value = "";
      productMinStockInput.value = "";
      productMaxStockInput.value = "";
      productPriceInput.value = "";
      productSupplierInput.value = "";
    }

    productModal.classList.remove("hidden");
  }

  function closeModal() {
    productModal.classList.add("hidden");
    currentProductId = null;
  }

  openAddModalBtn.addEventListener("click", () => openModal("add"));
  cancelModalBtn.addEventListener("click", closeModal);

  // Click outside modal to close
  productModal.addEventListener("click", e => {
    if (e.target === productModal) {
      closeModal();
    }
  });

  // Handle add/update
  submitProductBtn.addEventListener("click", () => {
    const name = productNameInput.value.trim();
    const sku = productSkuInput.value.trim();
    const category = productCategorySelect.value;
    const quantity = productQuantityInput.value.trim();
    const minStock = productMinStockInput.value.trim();
    const maxStock = productMaxStockInput.value.trim();
    const price = productPriceInput.value.trim();
    const supplier = productSupplierInput.value.trim();

    if (!name || !sku || !quantity || !price) {
      alert("Please fill in all required fields (Name, SKU, Quantity, Price).");
      return;
    }

    const quantityNum = parseInt(quantity, 10) || 0;
    const minStockNum = minStock === "" ? 0 : parseInt(minStock, 10);
    const maxStockNum = maxStock === "" ? 0 : parseInt(maxStock, 10);
    const priceNum = parseFloat(price) || 0;

    if (modalMode === "add") {
      const newId =
        products.length === 0
          ? 1
          : Math.max.apply(
              null,
              products.map(p => p.id)
            ) + 1;

      const newProduct = {
        id: newId,
        name,
        sku,
        category,
        quantity: quantityNum,
        minStock: minStockNum,
        maxStock: maxStockNum,
        price: priceNum,
        supplier
      };

      products.push(newProduct);
    } else if (modalMode === "edit" && currentProductId !== null) {
      products = products.map(p =>
        p.id === currentProductId
          ? {
              ...p,
              name,
              sku,
              category,
              quantity: quantityNum,
              minStock: minStockNum,
              maxStock: maxStockNum,
              price: priceNum,
              supplier
            }
          : p
      );
    }

    closeModal();
    renderAll();
  });

  // Delete handler using event delegation
  productsTableBody.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const id = parseInt(btn.getAttribute("data-id"), 10);

    if (action === "edit") {
      openModal("edit", id);
    } else if (action === "delete") {
      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (confirmed) {
        products = products.filter(p => p.id !== id);
        renderAll();
      }
    }
  });

  // Search and filter
  searchInput.addEventListener("input", e => {
    searchTerm = e.target.value;
    renderTable();
  });

  categoryFilter.addEventListener("change", e => {
    filterCategory = e.target.value;
    renderTable();
  });

  // Rendering functions
  function renderStats() {
    totalProductsEl.textContent = products.length.toString();
    lowStockCountEl.textContent = getLowStockItems().length.toString();
    overstockCountEl.textContent = getOverstockItems().length.toString();
    totalValueEl.textContent = "₹" + getTotalValue().toLocaleString();
  }

  function renderCategoryFilter() {
    categoryFilter.innerHTML = categories
      .map(cat => `<option value="${cat}">${cat}</option>`)
      .join("");
    categoryFilter.value = filterCategory;
  }

  function renderTable() {
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-4 text-center text-gray-500">
            No products found.
          </td>
        </tr>
      `;
      return;
    }

    productsTableBody.innerHTML = filtered
      .map(product => {
        const status = getStockStatus(product);
        let statusBadge = "";

        if (status === "low") {
          statusBadge = `
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              ⚠️ Low Stock
            </span>
          `;
        } else if (status === "overstock") {
          statusBadge = `
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
              Overstock
            </span>
          `;
        } else {
          statusBadge = `
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Normal
            </span>
          `;
        }

        return `
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">${product.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.sku}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                ${product.category}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.quantity}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              ${statusBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${product.price.toLocaleString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.supplier || "-"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                data-action="edit"
                data-id="${product.id}"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                data-action="delete"
                data-id="${product.id}"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function renderAnalytics() {
    // Low stock list
    const lowStockItems = getLowStockItems();
    if (lowStockItems.length === 0) {
      lowStockList.innerHTML = `<p class="text-gray-600">No items with low stock.</p>`;
    } else {
      lowStockList.innerHTML = lowStockItems
        .map(
          product => `
        <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p class="font-semibold text-gray-800">${product.name}</p>
            <p class="text-sm text-gray-600">
              Current: ${product.quantity} | Minimum: ${product.minStock}
            </p>
          </div>
          <span class="text-red-600 font-bold">Action Required</span>
        </div>
      `
        )
        .join("");
    }

    // Category distribution
    const totalQty = products.reduce((sum, p) => sum + p.quantity, 0) || 1;
    categoryDistribution.innerHTML = categories
      .filter(c => c !== "All")
      .map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const totalCategoryQty = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
        const percent = (totalCategoryQty / totalQty) * 100;

        return `
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-700 font-medium">${category}</span>
            <span class="text-gray-600">${totalCategoryQty} units</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-indigo-600 h-3 rounded-full"
              style="width: ${percent}%;"
            ></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  function renderAll() {
    renderStats();
    renderCategoryFilter();
    renderTable();
    renderAnalytics();
  }

  // Initial render
  renderAll();
  showTab("inventory");
});
