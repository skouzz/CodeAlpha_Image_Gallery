document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'VMh7fs0ZGoH2I0k6s6LyotjUWPz3OkfVhgvITvK91caW1DJC7nMRx73W';
    const gallery = document.querySelector('.gallery .images');
    const loadMoreButton = document.querySelector('.gallery .load-more');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const downloadButton = document.getElementById('download-button');
    let page = 1;
    const perPage = 10;
    let query = '';

    async function fetchImages() {
        try {
            const url = query 
                ? `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=${perPage}`
                : `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
            
            const response = await fetch(url, {
                headers: {
                    Authorization: apiKey
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayImages(data.photos);
            page++;
            if (data.photos.length < perPage) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            alert('Failed to fetch images. Check console for details.');
        }
    }

    function displayImages(photos) {
        if (page === 1) {
            gallery.innerHTML = ''; // Clear gallery on new search
        }
        photos.forEach(photo => {
            const listItem = document.createElement('li');
            listItem.classList.add('card');
            listItem.innerHTML = `
                <img src="${photo.src.large}" alt="img" class="img" data-src="${photo.src.large}" data-photographer="${photo.photographer}">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${photo.photographer}</span>
                    </div>
                    <button class="download-button" data-src="${photo.src.large}">
                        <i class="uil uil-import"></i>
                    </button>
                </div>
            `;
            gallery.appendChild(listItem);
        });
        addImageClickListeners();
        addDownloadButtonListeners(); // Add this line to attach listeners to download buttons
    }

    function addImageClickListeners() {
        const images = document.querySelectorAll('.gallery .images .img');
        images.forEach(image => {
            image.addEventListener('click', () => {
                const src = image.dataset.src;
                lightboxImage.src = src;
                downloadButton.href = src;
                downloadButton.download = src.split('/').pop(); // Set the filename to the last part of the URL
                lightbox.style.display = 'flex';
            });
        });
    }

    function addDownloadButtonListeners() {
        const downloadButtons = document.querySelectorAll('.gallery .download-button');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering the image click event
                const src = button.dataset.src;
                const a = document.createElement('a');
                a.href = src;
                a.download = src.split('/').pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });
    }

    function handleSearch() {
        query = searchInput.value.trim();
        page = 1; // Reset page number for new search
        fetchImages();
    }

    searchButton.addEventListener('click', handleSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    loadMoreButton.addEventListener('click', fetchImages);

    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    fetchImages(); // Initial fetch for curated images
});
