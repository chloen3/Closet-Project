const apiUrl = 'https://api.jsonbin.io/v3/b/67918f13ad19ca34f8f2de27'; // bin URL

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



function showModal(index) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const item = items[index];
    const modal = document.getElementById('item-modal');
    const modalDetails = document.getElementById('modal-details');

    if (!item || !item.images || item.images.length === 0) {
        alert('No images available for this item.');
        return;
    }

    let currentImageIndex = 0; // Track the current image index

    function updateImage() {
        modalDetails.innerHTML = `
            <div class="image-gallery">
                <img src="${item.images[currentImageIndex]}" alt="Photo ${currentImageIndex + 1}" class="gallery-image">
            </div>
            <button class="nav-arrow left-arrow" onclick="previousImage()">&#9664;</button>
            <button class="nav-arrow right-arrow" onclick="nextImage()">&#9654;</button>
            <h2>${item.name}</h2>
            <p>${item.price.startsWith('$') ? item.price : `$${item.price}`}</p>
            <p>${item.description}</p>
            <button class="buy-btn" onclick="buyItem(${index})">Buy Now</button>
        `;
    }

    // Functions for navigating images
    window.previousImage = function () {
        currentImageIndex = (currentImageIndex - 1 + item.images.length) % item.images.length; // Wrap around to the last image
        updateImage();
    };

    window.nextImage = function () {
        currentImageIndex = (currentImageIndex + 1) % item.images.length; // Wrap around to the first image
        updateImage();
    };

    // Function for Buy Now button
    window.buyItem = function () {
        alert(`You have chosen to buy "${item.name}" for ${item.price}!`);
    };

    // Initialize modal with the first image
    updateImage();
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('item-modal');
    modal.style.display = 'none';
}


function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const description = document.getElementById('item-description').value.trim() || 'No description provided';
    const rentChecked = document.getElementById('rent').checked;
    const buyChecked = document.getElementById('buy').checked;
    const rentPrice = document.getElementById('rent-price').value.trim();
    const buyPrice = document.getElementById('buy-price').value.trim();
    const imageInput = document.getElementById('item-images').files[0];
    const ownerId = localStorage.getItem('userId') || 'guest';

    if (!name || !imageInput) {
        alert('Please provide an item name and an image.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('rent_price', rentChecked ? rentPrice : '');
    formData.append('buy_price', buyChecked ? buyPrice : '');
    formData.append('image', imageInput);
    formData.append('owner_id', ownerId);

    fetch('/add_item', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        alert('Item added successfully!');
        window.location.href = 'home.html';
    }).catch(error => {
        console.error('Error:', error);
    });
}




function toggleRentPrice() {
    const rentPriceInput = document.getElementById('rent-price');
    const rentCheckbox = document.getElementById('rent');
    rentPriceInput.style.display = rentCheckbox.checked ? 'inline-block' : 'none';
}

function toggleBuyPrice() {
    const buyPriceInput = document.getElementById('buy-price');
    const buyCheckbox = document.getElementById('buy');
    buyPriceInput.style.display = buyCheckbox.checked ? 'inline-block' : 'none';
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



