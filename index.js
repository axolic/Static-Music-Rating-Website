// Initialize Supabase with your project's URL and anon key
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let albumsData = [];
let songsData = {};

// Fetch albums and songs data from Supabase
async function fetchData() {
    try {
        // Fetch albums data
        const albumsResponse = await supabase.from('albums').select('*');
        if (albumsResponse.error) throw albumsResponse.error;
        albumsData = albumsResponse.data;

        // Fetch songs data and organize by album_id
        const songsResponse = await supabase.from('songs').select('*');
        if (songsResponse.error) throw songsResponse.error;
        songsData = songsResponse.data.reduce((acc, song) => {
            if (!acc[song.album_id]) {
                acc[song.album_id] = [];
            }
            acc[song.album_id].push(song);
            return acc;
        }, {});

        displayAlbums(albumsData); // Display albums initially
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display albums on the page
function displayAlbums(albums) {
    const albumList = document.getElementById('album-list');
    albumList.innerHTML = ''; // Clear current list

    albums.forEach(album => {
        const albumCol = document.createElement('div');
        albumCol.className = 'col';

        const albumLink = document.createElement('a');
        albumLink.href = `/Static-Music-Rating-Website/album.html?album_id=${album.album_id}`;
        albumLink.style.textDecoration = 'none';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100 rounded';
        cardDiv.style.borderColor = 'rgba(0, 0, 0, 0.74)';

        const cardImgDiv = document.createElement('div');
        cardImgDiv.className = 'card-img-top';
        cardImgDiv.style.backgroundImage = `url('${album.cover}')`;

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = album.name;

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = `${album.rating}/100`;

        cardBodyDiv.appendChild(cardTitle);
        cardBodyDiv.appendChild(cardText);

        cardDiv.appendChild(cardImgDiv);
        cardDiv.appendChild(cardBodyDiv);

        albumLink.appendChild(cardDiv);
        albumCol.appendChild(albumLink);

        albumList.appendChild(albumCol);
    });

    // Add "New Album" button at the end
    const newAlbumCol = document.createElement('button');
    newAlbumCol.className = 'btn btn-card col';
    newAlbumCol.dataset.bsToggle = 'modal';
    newAlbumCol.dataset.bsTarget = '#newAlbumModal';
    newAlbumCol.style.border = 'none';

    const newAlbumCard = document.createElement('div');
    newAlbumCard.className = 'card h-100 rounded';
    newAlbumCard.style.borderColor = 'rgba(216, 216, 216, 0.74)';

    const newAlbumCardImg = document.createElement('div');
    newAlbumCardImg.className = 'card-img-top';
    newAlbumCardImg.style.display = 'flex';
    newAlbumCardImg.style.justifyContent = 'center';
    newAlbumCardImg.style.alignItems = 'center';

    const newAlbumIcon = document.createElement('i');
    newAlbumIcon.className = 'bi bi-plus-square-dotted';
    newAlbumIcon.style.fontSize = '96px';

    newAlbumCardImg.appendChild(newAlbumIcon);

    const newAlbumCardBody = document.createElement('div');
    newAlbumCardBody.className = 'card-body';

    const newAlbumCardTitle = document.createElement('h5');
    newAlbumCardTitle.className = 'card-title';
    newAlbumCardTitle.textContent = 'New Album';

    newAlbumCardBody.appendChild(newAlbumCardTitle);

    newAlbumCard.appendChild(newAlbumCardImg);
    newAlbumCard.appendChild(newAlbumCardBody);

    newAlbumCol.appendChild(newAlbumCard);
    albumList.appendChild(newAlbumCol);
}

// Sort albums based on selected criteria
function sortAlbums(criteria) {
    let sortedAlbums = [...albumsData];
    if (criteria === 'artist') {
        sortedAlbums.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (criteria === 'rating_highest') {
        sortedAlbums.sort((a, b) => b.rating - a.rating);
    } else if (criteria === 'rating_lowest') {
        sortedAlbums.sort((a, b) => a.rating - b.rating);
    } else if (criteria === 'release_newest') {
        sortedAlbums.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (criteria === 'release_oldest') {
        sortedAlbums.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    }
    displayAlbums(sortedAlbums);
}

// Initialize data fetch when page loads
document.addEventListener('DOMContentLoaded', fetchData);
