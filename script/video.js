console.log('Video script loaded');
// Get hour minutes and seconds
function getTimeString(time) {
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minute ${remainingSecond} seconds ago`
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    console.log(buttons);
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
}
// 1- Fetch, Load and Show categories on html

// Create load categories
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error));
};
// Create load videos
const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then((data) => displayVideos(data.videos))
        .catch((error) => console.log(error));
};

const loadCategoriesVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(res => res.json())
        .then((data) => {
            // SHobaike active class remove koro
            removeActiveClass();
            // id er class k active koro
            const activeBtn = document.getElementById(`btn-${id}`);
            activeBtn.classList.add('active');
            displayVideos(data.category);
        })
        .catch((error) => console.log(error));
}
const loadDetails = async (videoID) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);
};

const displayDetails = (video) => {
    console.log(video);
    const detailsContainer = document.getElementById('modal-content');
    detailsContainer.innerHTML = `
    <img src=${video.thumbnail} alt="">    </img>
    <p>${video.description}</p>
    `

    // Way 1
    // document.getElementById('showModalData').click();

    // Way 2
    document.getElementById('customModal').showModal();
}
// Create Display videos
const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = "";
    if (videos.length == 0) {
        videoContainer.classList.remove('grid');
        videoContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="./assets/icon.png" alt=""></img>
        <h2 class='text-center text-2xl font-bold'>
            No content Here in this category!
        </h2>
        </div>
        `;
        return;
    }
    else {
        videoContainer.classList.add('grid');
    }
    videos.forEach(video => {
        console.log(video);
        const card = document.createElement('div');
        card.classList = 'card card-compact';
        card.innerHTML = `
        <figure class='h-[200px] relative'>
        <img
            src= ${video.thumbnail}
            class='h-full w-full object-cover'
            alt="Shoes" />
            ${video.others.posted_date?.length == 0
                ? ""
                : `<span class="absolute text-xs right-2 bottom-2 bg-black text-white rounded p-1">${getTimeString(video.others.posted_date)}</span>`
            }
        </figure>
        <div class="px-0 py-2 flex gap-2">
            <div>
                <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture}/>
            </div>
            <div>
                <h2 class="font-bold">${video.title}</h2>
                <div class="flex">
                    <p class="text-gray-400">${video.authors[0].profile_name}</p>
                    ${video.authors[0].verified === true ? `<img class="w-5 " src="https://img.icons8.com/?size=100&id=SRJUuaAShjVD&format=png&color=000000" />` : ""}
                </div>
                <p> 
                <button onclick="loadDetails('${video.video_id}')" class='btn btn-sm btn-error'>        
                View Details
                </button>
                </p>
            </div>
            
        </div>
        `;
        videoContainer.append(card);
    });
};

// Create Display categories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories');

    categories.forEach(item => {
        console.log(item);

        // create a button
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoriesVideos(${item.category_id})" class="btn category-btn">
        ${item.category}        
        </button>
        `

        // add Button to categories container
        categoryContainer.append(buttonContainer);
    });
};
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    loadVideos(e.target.value)
})
loadCategories()
loadVideos();