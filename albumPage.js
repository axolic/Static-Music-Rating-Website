// Initialize Supabase client
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_KEY = 'your-supabase-key';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('album_id');

    if (!albumId) {
        console.error('No album_id found in the URL');
        return;
    }

    try {
        // Fetch album data from Supabase
        const { data: albumData, error: albumError } = await supabase
            .from('albums')
            .select('*')
            .eq('album_id', albumId)
            .single();

        if (albumError || !albumData) {
            console.error('Album not found or error fetching album:', albumError);
            return;
        }

        displayAlbumDetails(albumData);

        // Fetch song data for the album
        const { data: songsData, error: songsError } = await supabase
            .from('songs')
            .select('*')
            .eq('album_id', albumId);

        if (songsError) {
            console.error('Error fetching song data:', songsError);
            return;
        }

        displaySongs(songsData);
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayAlbumDetails(album) {
    const albumContainer = document.getElementById('album-container');
    const albumDiv = document.createElement('div');
    albumDiv.className = 'album_cover';

    const albumLink = document.createElement('a');
    albumLink.href = album.link;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card h-100 rounded';
    cardDiv.style.borderColor = 'rgba(0, 0, 0, 0.74)';

    const albumImage = document.createElement('img');
    albumImage.src = album.cover;
    albumImage.className = 'card-img-top';
    albumImage.alt = 'Album Cover';

    cardDiv.appendChild(albumImage);
    albumLink.appendChild(cardDiv);
    albumDiv.appendChild(albumLink);

    const albumInfoDiv = document.createElement('div');
    albumInfoDiv.className = 'album_info';

    const albumName = document.createElement('h5');
    albumName.textContent = album.name;

    const albumArtist = document.createElement('h5');
    albumArtist.textContent = album.artist;

    const albumDate = document.createElement('h5');
    albumDate.id = 'reversedDate';

    const albumRating = document.createElement('h2');
    albumRating.style.paddingTop = '10px';
    albumRating.textContent = `${album.rating}/100`;

    albumInfoDiv.appendChild(albumName);
    albumInfoDiv.appendChild(albumArtist);
    albumInfoDiv.appendChild(albumDate);
    albumInfoDiv.appendChild(albumRating);

    albumContainer.appendChild(albumDiv);
    albumContainer.appendChild(albumInfoDiv);

    formatReleaseDate(album.release_date);
    document.getElementById('edit-link').href = `/albums/${album.album_id}/edit`;
}

function formatReleaseDate(dateStr) {
    const parts = dateStr.split('-');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthName = monthNames[monthIndex];
    const reversedDate = `${parts[2]}. ${monthName} ${parts[0]}`;
    document.getElementById('reversedDate').textContent = reversedDate;
}

function displaySongs(songs) {
    const songList = document.getElementById('song-list');
    songs.forEach(song => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item tracklist d-flex justify-content-between';

        const songName = document.createElement('span');
        songName.textContent = song.name;

        const songRating = document.createElement('span');
        songRating.textContent = `${song.rating}/100`;

        listItem.appendChild(songName);
        listItem.appendChild(songRating);
        songList.appendChild(listItem);
    });
}
