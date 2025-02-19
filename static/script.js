

document.addEventListener("DOMContentLoaded", function() {
    loadItems();
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


let currentItem = null;
let currentImageIndex = 0;

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
            document.getElementById('modal-price').innerText = item.buy_price ? `Buy: $${item.buy_price}` : 'Not for sale';

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
    alert(`Proceeding to purchase: ${currentItem.name}`);
}




function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const description = document.getElementById('item-description').value.trim() || 'No description provided';
    const rentChecked = document.getElementById('rent').checked;
    const buyChecked = document.getElementById('buy').checked;
    const rentPrice = rentChecked ? document.getElementById('rent-price').value.trim() : "";
    const buyPrice = buyChecked ? document.getElementById('buy-price').value.trim() : "";
    const imageInput = document.getElementById('item-images').files[0];
    const ownerId = localStorage.getItem('userId') || 'guest';

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
    formData.append('owner_id', ownerId);

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




function deleteItem(itemId) {
    fetch(`/delete_item/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Item deleted successfully!');
        loadItems(); // Reload the items list
    })
    .catch(error => console.error('Error deleting item:', error));
}



