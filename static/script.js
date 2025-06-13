document.addEventListener("DOMContentLoaded", function () {
    loadUser();
    loadItems();

    if (window.location.pathname === "/account") {
        loadUserItems();
    }

    const rentCheckbox = document.getElementById('rent');
    const buyCheckbox = document.getElementById('buy');
    if (rentCheckbox) rentCheckbox.addEventListener('change', toggleRentPrice);
    if (buyCheckbox) buyCheckbox.addEventListener('change', toggleBuyPrice);
});

function loadUser() {
    fetch('/me', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const nameSpan = document.getElementById("user-name");
        if (nameSpan) {
            nameSpan.textContent = data.name || "Guest";
        }
    })
    .catch(() => {
        const nameSpan = document.getElementById("user-name");
        if (nameSpan) {
            nameSpan.textContent = "Guest";
        }
    });
}

function loadItems() {
    fetch('/get_items')
        .then(response => response.json())
        .then(data => {
            const featuredItems = document.getElementById('featured-items');
            if (!featuredItems) return;
            featuredItems.innerHTML = '';

            data.items.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add('item-card');
                itemCard.innerHTML = `
                    <img src="${item.image_path}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>${item.rent_price ? `Rent: $${item.rent_price}` : ''}</p>
                    <p>${item.buy_price ? `Buy: $${item.buy_price}` : ''}</p>
                `;
                itemCard.addEventListener('click', () => showModal(item.id));
                featuredItems.appendChild(itemCard);
            });
        })
        .catch(error => console.error('Error:', error));
}

function showModal(itemId) {
    fetch(`/get_items`)
        .then(response => response.json())
        .then(data => {
            const item = data.items.find(i => i.id === itemId);
            if (!item) return alert('Item not found.');

            document.getElementById('modal-image').src = item.image_path;
            document.getElementById('modal-title').innerText = item.name;
            document.getElementById('modal-description').innerText = item.description;

            let priceText = item.rent_price && item.buy_price ?
                `Rent: $${item.rent_price} | Buy: $${item.buy_price}` :
                item.rent_price ? `Rent: $${item.rent_price}` :
                item.buy_price ? `Buy: $${item.buy_price}` : 'Not for sale';

            document.getElementById('modal-price').innerText = priceText;
            document.getElementById('confirm-purchase').onclick = () => notifySeller(item);
            document.getElementById('item-modal').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error fetching item details:', error);
            alert('Failed to load item details.');
        });
}

function closeModal(event) {
    const modal = document.getElementById('item-modal');
    if (!event || event.target === modal) modal.style.display = 'none';
}

function buyItem() {
    document.getElementById("confirmation-modal").style.display = "flex";
}

function closeConfirmationModal() {
    document.getElementById("confirmation-modal").style.display = "none";
}

function notifySeller(item) {
    fetch('/me', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const buyerName = data.name;
        const buyerEmail = data.email;

        fetch("/notify_seller", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                buyer_name: buyerName,
                buyer_email: buyerEmail,
                buyer_number: "Not Provided",
                item_name: item.name,
                seller_email: item.owner_email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Seller has been notified via email!");
                fetch(`/delete_item/${item.id}`, { method: "DELETE" })
                    .then(() => window.location.reload())
                    .catch(error => console.error("Error removing item:", error));
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        });
    });

    closeConfirmationModal();
}

function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const description = document.getElementById('item-description').value.trim() || 'No description provided';
    const rentChecked = document.getElementById('rent').checked;
    const buyChecked = document.getElementById('buy').checked;
    const rentPrice = rentChecked ? document.getElementById('rent-price').value.trim() : "";
    const buyPrice = buyChecked ? document.getElementById('buy-price').value.trim() : "";
    const imageInput = document.getElementById('item-images').files[0];

    if (!name || !imageInput) {
        alert('Please provide an item name and an image.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('rent_price', rentPrice);
    formData.append('buy_price', buyPrice);
    formData.append('image', imageInput);

    fetch('/add_item', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add item.');
        return response.json();
    })
    .then(() => {
        alert('Item added successfully!');
        setTimeout(() => window.location.href = '/home', 500);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add item. Please try again.');
    });
}

function toggleRentPrice() {
    const rentPriceInput = document.getElementById('rent-price');
    rentPriceInput.style.display = document.getElementById('rent').checked ? 'inline-block' : 'none';
}

function toggleBuyPrice() {
    const buyPriceInput = document.getElementById('buy-price');
    buyPriceInput.style.display = document.getElementById('buy').checked ? 'inline-block' : 'none';
}

function loadUserItems() {
    fetch('/me', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(user => {
        if (!user.email) return alert("You are not logged in.");

        fetch(`/get_user_items?owner_email=${encodeURIComponent(user.email)}`)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("user-items");
                if (!container) return;
                container.innerHTML = "";

                if (data.items.length === 0) {
                    container.innerHTML = "<p>You have not posted any items yet.</p>";
                    return;
                }

                data.items.forEach(item => {
                    const card = document.createElement("div");
                    card.classList.add("item-card");
                    card.innerHTML = `
                        <div class="delete-container">
                            <button class="delete-btn" onclick="deleteItem(${item.id})">✖</button>
                        </div>
                        <img src="${item.image_path}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        ${item.rent_price ? `<p>Rent: $${item.rent_price}</p>` : ''}
                        ${item.buy_price ? `<p>Buy: $${item.buy_price}</p>` : ''}
                    `;
                    container.appendChild(card);
                });
            });
    })
    .catch(() => alert("Failed to verify user login."));
}

function deleteItem(itemId) {
    fetch(`/delete_item/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(() => {
        alert('Item deleted successfully!');
        window.location.reload();
        loadItems();
    })
    .catch(error => console.error('Error deleting item:', error));
}
