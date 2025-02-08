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
if (reviews) {
    reviewsList.forEach(function (item) {
        const li = document.createElement('li');
        li.textContent = `"${item.review}" (${item.note})`;
        reviews.appendChild(li);
    });
}

//Added upgrade in the Delorean upgrades
const upgradesContainer = document.getElementById('upgrades');
if (upgradesContainer) {
    upgradesList.forEach(function (item) {
        const upgradeDiv = document.createElement('div');
        const upgradeImg = document.createElement('img');
        upgradeImg.src = item.imgUrl;

        const upgradeName = document.createElement('p');
        const upgradeLink = document.createElement('a');
        upgradeLink.href = item.linkUrl;
        upgradeLink.textContent = item.name;
        upgradeLink.target = '_blank';

        upgradeName.appendChild(upgradeLink);

        upgradeDiv.appendChild(upgradeImg);
        upgradeDiv.appendChild(upgradeName);
        upgradesContainer.appendChild(upgradeDiv);
    }); 
}


// Show and hide password
document.addEventListener("DOMContentLoaded", function () {
    const pswBtn = document.querySelector('#pswbtn');
    if (pswBtn) {
        pswBtn.addEventListener("click", function() {
            const pswdInput = document.getElementById("password");
            const type = pswdInput.getAttribute("type");
            if (type === "password") {
                pswdInput.setAttribute("type", "text");
                pswBtn.innerHTML = 'Hide Password';
            } else {
                pswdInput.setAttribute("type", "password");
                pswBtn.innerHTML = 'Show Password';
            }
        });
    }
});

// // Validation password
const form = document.querySelector("#passwordAuth");
if (form) {
    form.addEventListener("submit", function(event) {
        const password = document.getElementById("password").value;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

        if (!passwordPattern.test(password)) {
            alert("Password must be at least 12 characters long, include one uppercase letter, one number, and one special character.");
            event.preventDefault(); // Impede o envio do formulário
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const noticeMessage = body.getAttribute("data-notice");
    const errorMessage = body.getAttribute("data-error");

    if (noticeMessage) {
        alert(noticeMessage);
    }

    if (errorMessage) {
        alert(errorMessage);
    }
});

// Register validation
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const noticeMessage = body.getAttribute("data-notice");
    const errorMessage = body.getAttribute("data-error");

    if (noticeMessage) {
        alert(noticeMessage);
    }

    if (errorMessage) {
        alert(errorMessage);
    }

    // Verifica se há mensagem de erro específica de e-mail já registrado
    const emailError = body.getAttribute("data-email-error");
    if (emailError) {
        alert(emailError); // Exibe o alerta de erro específico
    }
});
