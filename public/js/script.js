upgradesList = [
    {
        name: "Flux Capacitor",
        imgUrl: "images/upgrades/flux-cap.png",
        linkUrl: ""
    },

    {
        name: "Flame Decals",
        imgUrl: "images/upgrades/flame.jpg",
        linkUrl: ""
    },

    {
        name: "Bumper Stickers",
        imgUrl: "images/upgrades/bumper_sticker.jpg",
        linkUrl: ""
    },

    {
        name: "Hub Caps",
        imgUrl: "images/upgrades/hub-cap.jpg",
        linkUrl: ""
    }
];

reviewsList = [
    {
        review: "So fast it's almost like travelling in time.",
        note: "4/5"
    },

    {
        review: "Coolest ride on the road.",
        note: "4/5"
    },

    {
        review: "I'm feeling McFly!",
        note: "5/5"
    },

    {
        review: "The most futuristic ride of our day.",
        note: "4.5/5"
    },

    {
        review: "80's livin and I love it!",
        note: "5/5"
    }
];

//Added reviews in the DMC Delorean Reviews
const reviews = document.getElementById('reviews');

reviewsList.forEach(function(item) {
    const li = document.createElement('li');
    li.textContent = `"${item.review}" (${item.note})`;
    reviews.appendChild(li);
});

//Added upgrade in the Delorean upgrades
const upgradesContainer = document.getElementById('upgrades');

upgradesList.forEach(function(item) {
    const upgradeDiv = document.createElement('div');
    const upgradeImg = document.createElement('img');
    upgradeImg.src = item.imgUrl;

    const upgradeName = document.createElement('p');
    
    const upgradeLink = document.createElement('a');
    upgradeLink.href = item.linkUrl; // URL do link
    upgradeLink.textContent = item.name;
    upgradeLink.target = '_blank'; // Abre o link em uma nova aba (opcional)

    upgradeName.appendChild(upgradeLink);

    upgradeDiv.appendChild(upgradeImg);
    upgradeDiv.appendChild(upgradeName);
    upgradesContainer.appendChild(upgradeDiv);
});
