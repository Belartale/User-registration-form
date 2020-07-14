let form = document.getElementById("r-form");
let userName = document.getElementById("full-name");
let phone = document.getElementById("phone");
let email = document.getElementById("email");
let psw = document.getElementById("psw");
let psw2 = document.getElementById("psw-r");
let country = document.getElementById("country");
let postCode = document.getElementById("postcode");
let userText = document.getElementById("add-text");
let pswStrength = document.querySelector(".psw-strength");
//let inputs = document.querySelectorAll("input");
let validForm = document.querySelector("p.valid-form");
let invalidForm = document.querySelector("p.invalid-form");

form.addEventListener(
    "submit",
    (e) => {
        e.preventDefault();
        if (
            !(
                userName.classList.contains("valid") &&
                phone.classList.contains("valid") &&
                email.classList.contains("valid") &&
                psw.classList.contains("valid") &&
                psw2.classList.contains("valid") &&
                country.classList.contains("valid") &&
                postCode.classList.contains("valid")
            )
        ) {
            invalidForm.classList.remove("hidden");
            validForm.classList.add("hidden");
        } else {
            registrationUser();
            //! saveState(userText.value); //где-то косяк, перебивает выполн addUser и потом не работает
            invalidForm.classList.add("hidden");
            validForm.classList.remove("hidden");

            let user = {
                userName: userName.value,
                phone: phone.value,
                email: email.value,
                psw: psw.value,
                country: country.value,
                postCode: postCode.value,
                userText: userText.value,
            };
            addUser(user);

            setTimeout(() => {
                form.onclick((location.href = "profile.html"));
            }, 1000);
        }
    },
    false
);

userName.addEventListener(
    "input",
    (e) => {
        if (userName.value.length > 1) {
            userName.className = "valid";
        } else {
            userName.className = "error";
        }
    },
    false
);

phone.addEventListener("input", () => {
    let validPhone = /[0][0-9]{9}/.test(phone.value);
    if (validPhone) {
        phone.className = "valid";
    } else {
        phone.className = "error";
    }
});

email.addEventListener("input", () => {
    if (email.validity.valid) {
        email.className = "valid";
    } else {
        email.className = "error";
    }
});
email.oncut = email.oncopy = email.onpaste = () => {
    return false;
};

let checkRepeatPassword = function () {
    if (psw.value == psw2.value) {
        psw2.className = "valid";
    } else {
        psw2.className = "error";
    }
};

psw.onkeyup = checkRepeatPassword;
psw2.onkeyup = checkRepeatPassword;

psw.addEventListener(
    "input",
    (e) => {
        if (
            /[0-9]{1,}/.test(psw.value) &&
            /[a-zA-Z]{1,}/.test(psw.value) &&
            psw.value.length >= 7
        ) {
            psw.className = "valid";
        } else {
            psw.className = "error";
        }

        if (!psw.value.length) {
            pswStrength.className = "psw-strength";
        } else if (psw.value.length < 5) {
            pswStrength.className = "psw-strength weak-password";
        } else if (psw.value.length < 7) {
            pswStrength.className = "psw-strength middle-password";
        } else {
            pswStrength.className = "psw-strength strong-password";
        }
    },
    false
);

country.addEventListener("input", () => {
    if (country.value.length > 0) {
        country.className = "valid";
    } else {
        country.className = "error";
    }
});

postCode.addEventListener("input", () => {
    if (postCode.value.length > 4) {
        postCode.className = "valid";
    } else {
        postCode.className = "error";
    }
});

userText.addEventListener("input", () => {
    document.getElementById("char-count").innerHTML = userText.value.length;
});

//!     OOP

let messageUserOrAdmin = document.querySelector("p.messageUserOrAdmin");

let isAdmin = false;

class User {
    constructor(userName, phone, email, psw, country, postCode, userText) {
        this.userName = userName;
        this.phone = phone;
        this.email = email;
        this.psw = psw;
        this.country = country;
        this.postCode = postCode;
        this.userText = userText;
    }
}

class CommonUser extends User {
    constructor(
        userName,
        phone,
        email,
        psw,
        country,
        postCode,
        userText,
        isAdmin
    ) {
        super(userName, phone, email, psw, country, postCode, userText);
        this.isAdmin = isAdmin;
    }
}

class AdminUser extends User {
    constructor(
        userName,
        phone,
        email,
        psw,
        country,
        postCode,
        userText,
        isAdmin
    ) {
        super(userName, phone, email, psw, country, postCode, userText);
        this.isAdmin = isAdmin;
    }
}

function registrationUser() {
    if (isAdmin) {
        let beAdmin = new AdminUser(
            userName.value,
            phone.value,
            email.value,
            psw.value,
            country.value,
            postCode.value,
            userText.value,
            isAdmin
        );
        messageUserOrAdmin.innerHTML = `${beAdmin.userName} you is admin`;
        console.log(`${beAdmin.userName} you is admin`);
        console.log(beAdmin);

        addCookie(beAdmin);
        addStorageJson(beAdmin);
    } else {
        let beUser = new CommonUser(
            userName.value,
            phone.value,
            email.value,
            psw.value,
            country.value,
            postCode.value,
            userText.value,
            isAdmin
        );
        messageUserOrAdmin.innerHTML = `${beUser.userName} you don't admin`;
        console.log(`${beUser.userName} you don't admin`);
        console.log(beUser);

        addCookie(beUser);
        addStorageJson(beUser);
    }
}

function addCookie(user) {
    let valueAdminAccess = user.isAdmin;
    let adminAccess = `${valueAdminAccess}; path=valueAdminAccess; max-age=30`;
    document.cookie = adminAccess;
    console.log(document.cookie);
}

function addStorageJson(objectUser) {
    localStorage.userInJson = JSON.stringify({
        userName: objectUser.userName,
        phone: objectUser.phone,
        email: objectUser.email,
        country: objectUser.country,
    });
    let userInJson = JSON.parse(localStorage.userInJson);
    console.log(
        userInJson.userName,
        userInJson.phone,
        userInJson.email,
        userInJson.country
    );
}

function saveState(valueInput) {
    let eventJson = JSON.stringify(valueInput);
    history.pushState(
        { page: eventJson },
        "valueInput",
        "page=registrationForm"
    );
    console.log(history);
}

window.addEventListener("load", () => {
    console.log(window.location.href);
});

function addUser(user) {
    fetch("http://localhost:3000/users", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("POST = yes", data);
            //getAllUsers();
        });

    fetch("http://localhost:3000/logged", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            data = otherValue.value;
        });
}

function getAllUsers() {
    fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((data) => {
            users = data;
            console.log(users);
        });
}
/////////////////////// profile.html
let otherValue = document.getElementById(`add-text-two`);
let userInfa = document.getElementById(`user-infa`);

function getUserInfa() {
    fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((data) => {
            getUsInfa = data;
            console.log(getUsInfa.userText);
        });
}
getUserInfa();

() => {
    userInfa.innerHTML = userText.value;
};
