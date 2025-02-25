

document.addEventListener("DOMContentLoaded", function() {
    loadItems();
});

document.addEventListener("DOMContentLoaded", function() {
    const userName = localStorage.getItem("userName") || "Guest";
    document.getElementById("user-name").textContent = userName;
});

function loadItems() {
    fetch('/get_items')
        .then(response => response.json())
        .then(data => {
            const featuredItems = document.getElementById('featured-items');
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

                // Make the whole item clickable
                itemCard.addEventListener('click', () => showModal(item.id));

                featuredItems.appendChild(itemCard);
            });
        })
        .catch(error => console.error('Error:', error));
}


// Function to display items on the page
function displayItems(items) {
    const featuredItems = document.getElementById('featured-items');
    featuredItems.innerHTML = ''; // Clear previous items

    items.forEach((item, index) => {
        const firstImage = item.images && item.images.length > 0 ? item.images[0] : 'placeholder.png';
        const rentPrice = item.rentPrice ? `Rent: $${item.rentPrice}` : '';
        const buyPrice = item.buyPrice ? `Buy: $${item.buyPrice}` : '';

        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        itemCard.innerHTML = `
            <img src="${firstImage}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            ${rentPrice ? `<p>${rentPrice}</p>` : ''}
            ${buyPrice ? `<p>${buyPrice}</p>` : ''}
        `;
        featuredItems.appendChild(itemCard);
    });
}


function showModal(itemId) {
    fetch(`/get_items`)
        .then(response => response.json())
        .then(data => {
            const item = data.items.find(i => i.id === itemId);
            if (!item) {
                alert('Item not found.');
                return;
            }

            // Set modal content
            document.getElementById('modal-image').src = item.image_path;
            document.getElementById('modal-title').innerText = item.name;
            document.getElementById('modal-description').innerText = item.description;
            let priceText = '';
            if (item.rent_price && item.buy_price) {
                priceText = `Rent: $${item.rent_price} | Buy: $${item.buy_price}`;
            } else if (item.rent_price) {
                priceText = `Rent: $${item.rent_price}`;
            } else if (item.buy_price) {
                priceText = `Buy: $${item.buy_price}`;
            } else {
                priceText = 'Not for sale';
            }
            document.getElementById('modal-price').innerText = priceText;

            // Store item info for confirmation modal
            document.getElementById('confirm-purchase').onclick = function() {
                notifySeller(item);
            };

            // Show modal
            document.getElementById('item-modal').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error fetching item details:', error);
            alert('Failed to load item details.');
        });
}



function closeModal(event) {
    const modal = document.getElementById('item-modal');

    // Close modal only if the click is outside the modal-content
    if (!event || event.target === modal) {
        modal.style.display = 'none';
    }
}


function buyItem() {
    document.getElementById("confirmation-modal").style.display = "flex";
}

function notifySeller(item) {
    alert(`Notification sent to seller: ${item.owner_email}`);
    closeConfirmationModal();
}

function closeConfirmationModal() {
    document.getElementById("confirmation-modal").style.display = "none";
}


function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const description = document.getElementById('item-description').value.trim() || 'No description provided';
    const rentChecked = document.getElementById('rent').checked;
    const buyChecked = document.getElementById('buy').checked;
    const rentPrice = rentChecked ? document.getElementById('rent-price').value.trim() : "";
    const buyPrice = buyChecked ? document.getElementById('buy-price').value.trim() : "";
    const imageInput = document.getElementById('item-images').files[0];
    const ownerEmail = localStorage.getItem('userEmail') || 'guest@gmail.com';

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
    formData.append('owner_email', ownerEmail);

    fetch('/add_item', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add item.');
        }
        return response.json();
    })
    .then(data => {
        alert('Item added successfully!');
        setTimeout(() => {
            window.location.href = '/home';
        }, 500);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add item. Please try again.');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('rent').addEventListener('change', toggleRentPrice);
    document.getElementById('buy').addEventListener('change', toggleBuyPrice);
});

function toggleRentPrice() {
    const rentPriceInput = document.getElementById('rent-price');
    rentPriceInput.style.display = document.getElementById('rent').checked ? 'inline-block' : 'none';
}

function toggleBuyPrice() {
    const buyPriceInput = document.getElementById('buy-price');
    buyPriceInput.style.display = document.getElementById('buy').checked ? 'inline-block' : 'none';
}

function loadUserItems() {
    const ownerEmail = localStorage.getItem("owner_email");
    if (!ownerEmail) {
        alert("You are not logged in.");
        return;
    }

    fetch(`/get_user_items?owner_email=${encodeURIComponent(ownerEmail)}`)
        .then(response => response.json())
        .then(data => {
            const userItemsContainer = document.getElementById("user-items");
            userItemsContainer.innerHTML = "";

            if (data.items.length === 0) {
                userItemsContainer.innerHTML = "<p>You have not posted any items yet.</p>";
                return;
            }

            data.items.forEach(item => {
                const itemCard = document.createElement("div");
                itemCard.classList.add("item-card");
                itemCard.innerHTML = `
                    <div class="delete-container">
                        <button class="delete-btn" onclick="deleteItem(${item.id})">✖</button>
                    </div>
                    <img src="${item.image_path}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    ${item.rent_price ? `<p>Rent: $${item.rent_price}</p>` : ''}
                    ${item.buy_price ? `<p>Buy: $${item.buy_price}</p>` : ''}
                `;
                userItemsContainer.appendChild(itemCard);
            });
        })
        .catch(error => console.error("Error fetching user items:", error));
}

// Load user's items on account page
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname === "/account") {
        loadUserItems();
    }
});



function deleteItem(itemId) {
    fetch(`/delete_item/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Item deleted successfully!');
        window.location.reload();
        loadItems(); // Reload the items list
    })
    .catch(error => console.error('Error deleting item:', error));
}



