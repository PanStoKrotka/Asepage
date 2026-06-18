// const titleInput = document.getElementById('title');
// const urlInput = document.getElementById('url');
// const linkList = document.getElementById('linkList');

// // 2. Deklaracja tablicy na linki
// let links = [];

// // 3. Inicjalizacja pamięci w chmurze
// // NAPRAWIONO: Bezpośrednie użycie klasy RemoteStorage (bez .default)
// // ZMIEŃ "moj-unikalny-kod-123" na swój własny sekretny ciąg znaków!
// const remoteDB = new RemoteStorage({ userId: "29250407" });

// // Funkcja przełączania sekcji (zostaje bez zmian)
// function showSection(sectionId) {
//     document.getElementById('linki').classList.add('hidden');
//     document.getElementById('konwerter').classList.add('hidden');
//     document.getElementById(sectionId).classList.remove('hidden');
// }

// // 4. Ładowanie linków z chmury przy starcie
// async function loadLinks() {
//     try {
//         const savedLinks = await remoteDB.getItem('myLinks');
//         links = savedLinks ? JSON.parse(savedLinks) : [];
//         renderLinks();
//     } catch (error) {
//         console.error("Błąd podczas pobierania danych z chmury:", error);
//     }
// }

// // 5. Rysowanie linków w HTML
// function renderLinks() {
//     linkList.innerHTML = ''; 
//     links.forEach((link, index) => {
//         const li = document.createElement('li');
//         li.className = 'link-card';
//         li.innerHTML = `
//             <div class="link-info">
//                 <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>
//                 <br>
//                 <small style="color: #666;">${link.url}</small>
//             </div>
//             <button class="delete-btn" onclick="deleteLink(${index})">Usuń</button>
//         `;
//         linkList.appendChild(li);
//     });
// }

// // 6. Dodawanie nowego linku
// async function addLink() {
//     const title = titleInput.value.trim();
//     let url = urlInput.value.trim();
//     if (!title || !url) {
//         alert('Wypełnij oba pola!');
//         return;
//     }
//     if (!url.startsWith('http://') && !url.startsWith('https://')) {
//         url = 'https://' + url;
//     }
//     const newLink = { title, url };
//     links.push(newLink);
//     renderLinks();
//     try {
//         await remoteDB.setItem('myLinks', JSON.stringify(links));
//     } catch (error) {
//         console.error("Nie udało się zapisać linku:", error);
//     }
//     titleInput.value = '';
//     urlInput.value = '';
// }

// // 7. Usuwanie linku
// async function deleteLink(index) {
//     links.splice(index, 1);
//     renderLinks();
//     try {
//         await remoteDB.setItem('myLinks', JSON.stringify(links));
//     } catch (error) {
//         console.error("Nie udało się usunąć linku z chmury:", error);
//     }
// }
// // Uruchomienie pobierania na starcie
// loadLinks();
// 1. Definiowanie elementów strony



// const titleInput = document.getElementById('title');
// const urlInput = document.getElementById('url');
// const linkList = document.getElementById('linkList');

// let links = [];

// // === KONFIGURACJA GITHUB GIST ===
// // Wklej tutaj swoje dane z kroków 1 i 2:
// const GIST_ID = "48a9eaf63ba6b4dc5833a1de8f8f7048";
// const GITHUB_TOKEN = "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";

// const API_URL = `https://github.com{GIST_ID}`;
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const linkList = document.getElementById('linkList');

let links = [];

// === KONFIGURACJA GITHUB GIST ===
// Wklej tutaj swój token (musi zaczynać się od ghp_):
const GITHUB_TOKEN = "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";

// Funkcja przełączania sekcji menu
function showSection(sectionId) {
    document.getElementById('linki').classList.add('hidden');
    document.getElementById('konwerter').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
}

// 1. Pobieranie linków z pliku JSON przy starcie strony
async function loadLinks() {
    try {
        // NAPRAWIONO: Wpisaliśmy pełny, sztywny adres API bezpośrednio tutaj
        const response = await fetch("https://github.com", {
            method: 'GET',
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        
        if (!response.ok) throw new Error('Problem z pobraniem danych z GitHub Gist');
        
        const gist = await response.json();
        const fileContent = gist.files['links.json'].content;
        links = fileContent ? JSON.parse(fileContent) : [];
        
        renderLinks();
    } catch (error) {
        console.error("Błąd podczas pobierania pliku JSON:", error);
    }
}

// 2. Wyświetlanie linków na ekranie
function renderLinks() {
    linkList.innerHTML = ''; 
    links.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = 'link-card';
        li.innerHTML = `
            <div class="link-info">
                <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>
                <br>
                <small style="color: #666;">${link.url}</small>
            </div>
            <button class="delete-btn" onclick="deleteLink(${index})">Usuń</button>
        `;
        linkList.appendChild(li);
    });
}

// 3. Nadpisywanie pliku JSON nowymi danymi w chmurze
async function saveToGist() {
    try {
        // NAPRAWIONO: Tutaj też daliśmy sztywny, właściwy adres API
        const response = await fetch("https://github.com", {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'links.json': {
                        content: JSON.stringify(links, null, 2)
                    }
                }
            })
        });
        
        if (!response.ok) throw new Error('Nie udało się zapisać danych na GitHubie');
    } catch (error) {
        console.error("Błąd zapisu do pliku JSON:", error);
    }
}

// 4. Dodawanie nowego linku
async function addLink() {
    const title = titleInput.value.trim();
    let url = urlInput.value.trim();
    
    if (!title || !url) {
        alert('Wypełnij oba pola!');
        return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    links.push({ title, url });
    
    renderLinks();
    await saveToGist();
    
    titleInput.value = '';
    urlInput.value = '';
}

// 5. Usuwanie linku
async function deleteLink(index) {
    links.splice(index, 1);
    
    renderLinks();
    await saveToGist();
}

// Uruchomienie pobierania na starcie
loadLinks();


