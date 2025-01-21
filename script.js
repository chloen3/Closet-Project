function loadItems() {
    const featuredItems = document.getElementById('featured-items');
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

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
                ${!isAdmin ? `<button onclick="addToCart(${index})">Add to Cart</button>` : ''}
            </div>
            ${isAdmin ? `<button class="delete-btn" onclick="deleteItem(${index})">Delete</button>` : ''}
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


// Function to handle Add to Cart action
function addToCart(index) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(items[index]);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${items[index].name} has been added to your cart!`);
}

function addItem() {
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const imageInput = document.getElementById('item-images');

    if (!name || !price || imageInput.files.length === 0) {
        alert('Please fill in all fields and upload at least one image!');
        return;
    }

    const files = Array.from(imageInput.files); // Handle all uploaded images
    const readerPromises = files.map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const targetSize = 300; // Set fixed size for width and height
                    canvas.width = targetSize;
                    canvas.height = targetSize;

                    const ctx = canvas.getContext('2d');

                    // Calculate crop dimensions
                    const aspectRatio = img.width / img.height;
                    let cropWidth, cropHeight;

                    if (aspectRatio > 1) {
                        // Landscape orientation
                        cropHeight = img.height;
                        cropWidth = cropHeight * aspectRatio;
                    } else {
                        // Portrait or square orientation
                        cropWidth = img.width;
                        cropHeight = cropWidth / aspectRatio;
                    }

                    // Crop and center the image
                    ctx.drawImage(
                        img,
                        (img.width - cropWidth) / 2, // x-offset for crop
                        (img.height - cropHeight) / 2, // y-offset for crop
                        cropWidth, // Crop width
                        cropHeight, // Crop height
                        0,
                        0,
                        targetSize,
                        targetSize
                    );

                    const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Compress image
                    resolve(resizedBase64); // Return the processed image
                };
            };
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readerPromises).then(images => {
        if (images.length === 0) {
            alert('Failed to process images. Please try again.');
            return;
        }

        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.push({
            name,
            price,
            description: document.getElementById('item-description').value || 'No description available.',
            images // Store all uploaded images
        });
        localStorage.setItem('items', JSON.stringify(items));

        alert('Item added successfully!');
        window.location.href = 'index.html';
    });
}

function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    if (index >= 0 && index < items.length) {
        items.splice(index, 1); // Remove item at the specified index
        localStorage.setItem('items', JSON.stringify(items));
        loadItems(); // Refresh the list
    } else {
        alert('Failed to delete item. Invalid index.');
    }
}

