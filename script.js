function loadItems() {
    const featuredItems = document.getElementById('featured-items');
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const userId = localStorage.getItem('userId'); // Current user's phone number

    featuredItems.innerHTML = ''; // Clear previous items

    items.forEach((item, index) => {
        const priceWithDollar = item.price.startsWith('$') ? item.price : `$${item.price}`;
        const firstImage = item.images && item.images.length > 0 ? item.images[0] : 'placeholder.png';

        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        itemCard.innerHTML = `
            <img src="${firstImage}" alt="${item.name}" onclick="showModal(${index})">
            <h3>${item.name}</h3>
            <div class="item-footer">
                <p>${priceWithDollar}</p>
                <button onclick="addToCart(${index})">Add to Cart</button>
            </div>
            ${
                item.ownerId === userId
                    ? `<button class="delete-btn" onclick="deleteItem(${index})">Delete</button>`
                    : ''
            }
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
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const description = document.getElementById('item-description').value || 'No description available.';
    const imageInput = document.getElementById('item-images');
    const userId = localStorage.getItem('userId'); // Use phone number as userId

    if (!name || !price || imageInput.files.length === 0) {
        alert('Please fill in all fields and upload at least one image!');
        return;
    }

    const files = Array.from(imageInput.files);
    const readerPromises = files.map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const targetSize = 300; // Fixed size
                    canvas.width = targetSize;
                    canvas.height = targetSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, targetSize, targetSize);

                    const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Compress image
                    resolve(resizedBase64);
                };
            };
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readerPromises).then(images => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.push({
            name,
            price,
            description,
            images,
            ownerId: userId // Store phone number as the owner ID
        });
        localStorage.setItem('items', JSON.stringify(items));
        alert('Item added successfully!');
        window.location.href = 'home.html';
    });
}



function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.splice(index, 1); // Remove item at the specified index
    localStorage.setItem('items', JSON.stringify(items));
    loadItems(); // Refresh the items list
}


