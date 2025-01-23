const apiUrl = 'https://api.jsonbin.io/v3/b/67918caeacd3cb34a8d15f8d'; // Replace with your bin URL
const apiKey = '$2a$10$Cwmf/bMI8Y.R5eTUpY8wpOXWJjjzNdjnAc7dar1BFwQRKAs0yrws2'; // Find this in your JSONBin account settings

// Fetch items from JSONBin
function loadItems() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey // Required to access your JSONBin
        }
    })
    .then(response => response.json())
    .then(data => {
        const featuredItems = document.getElementById('featured-items');
        const items = data.record.items; // Access the "items" array

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
    })
    .catch(error => console.error('Error loading items:', error));
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
    const imageInput = document.getElementById('item-images');
    const userId = localStorage.getItem('userId'); // For owner tracking

    if (!name) {
        alert('Please provide an item name.');
        return;
    }

    const files = Array.from(imageInput.files);
    const readerPromises = files.map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readerPromises).then(images => {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => response.json())
        .then(data => {
            const items = data.record.items;

            // Add new item
            items.push({
                name,
                description,
                rentPrice: rentChecked ? rentPrice : null,
                buyPrice: buyChecked ? buyPrice : null,
                images,
                ownerId: userId
            });

            // Update JSONBin
            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                },
                body: JSON.stringify({ items })
            })
            .then(() => {
                alert('Item added successfully!');
                window.location.href = 'home.html';
            })
            .catch(error => console.error('Error saving item:', error));
        });
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



function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.splice(index, 1); // Remove item at the specified index
    localStorage.setItem('items', JSON.stringify(items));
    loadItems(); // Refresh the items list
}


