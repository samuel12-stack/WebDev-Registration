
const form = document.getElementById("regform");
const memberList = document.getElementById("memberList");
const count = document.getElementById("count");
const successMsg = document.getElementById("successMsg");
const themeButton = document.getElementById("theme");

const fields = [
    ["name", "nameError"],
    ["email", "emailError"],
    ["password", "passwordError"],
    ["confirm-password", "confirmError"],
    ["gender", "genderError"],
    ["dob", "dobError"],
    ["country", "countryError"],
    ["phone", "phoneError"],
    ["bio", "bioError"]
];

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function validateField(id) {
    const value = getValue(id);

    if (id === "name" && value.length < 2) {
        return "Enter your full name.";
    }

    if (id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            return "Enter a valid email address.";
        }
    }

    if (id === "password" &&
        document.getElementById(id).value.length < 8) {
        return "Password must be at least 8 characters.";
    }

    if (id === "confirm-password" &&
        document.getElementById(id).value !==
        document.getElementById("password").value) {
        return "Passwords do not match.";
    }

    if (id === "gender" && value === "") {
        return "Please select your gender.";
    }

    if (id === "dob") {
        if (!value) {
            return "Enter your date of birth.";
        }

        const today = new Date().toISOString().split("T")[0];

        if (value > today) {
            return "Date of birth cannot be in the future.";
        }
    }

    if (id === "country" && value.length < 2) {
        return "Enter your country.";
    }

    if (id === "phone") {
        const digits = value.replace(/\D/g, "");

        if (digits.length < 7 || digits.length > 15) {
            return "Enter a valid phone number.";
        }
    }

    if (id === "bio" && value.length < 10) {
        return "Tell us a little more about yourself.";
    }

    return "";
}

function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(
        fields.find(field => field[0] === id)[1]
    );

    error.textContent = message;
    input.classList.toggle("invalid", Boolean(message));

    if (message) {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}

function updateCount() {
    count.textContent =
        memberList.querySelectorAll(".member-item").length;
}

function addMember() {
    const emptyNote = document.getElementById("emptyNote");

    if (emptyNote) {
        emptyNote.remove();
    }

    const item = document.createElement("li");
    item.className = "member-item";

    const info = document.createElement("div");
    info.className = "info";

    const name = document.createElement("strong");
    name.textContent = getValue("name");

    const details = document.createElement("span");
    details.textContent =
        getValue("email") + " • " + getValue("country");

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove";
    removeButton.textContent = "Remove";

    info.append(name, details);
    item.append(info, removeButton);
    memberList.appendChild(item);

    updateCount();
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    fields.forEach(function (field) {
        const message = validateField(field[0]);

        showError(field[0], message);

        if (message) {
            valid = false;
        }
    });

    if (!valid) {
        successMsg.classList.add("hidden");

        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    addMember();

    successMsg.textContent =
        "Member registered successfully! Welcome to WebDev.";
    successMsg.classList.remove("hidden");

    form.reset();

    fields.forEach(function (field) {
        showError(field[0], "");
    });
});

fields.forEach(function (field) {
    const id = field[0];
    const input = document.getElementById(id);

    function checkField() {
        const errorId = field[1];
        const error = document.getElementById(errorId);

        if (error.textContent !== "") {
            showError(id, validateField(id));
        }

        if (id === "password" &&
            document.getElementById("confirmError").textContent !== "") {
            showError("confirm-password", validateField("confirm-password"));
        }
    }

    input.addEventListener("input", checkField);
    input.addEventListener("change", function () {
        if (id === "gender" || id === "dob") {
            showError(id, validateField(id));
        }
    });
});

memberList.addEventListener("click", function (event) {
    if (!event.target.matches(".remove")) {
        return;
    }

    event.target.closest(".member-item").remove();
    updateCount();

    if (count.textContent === "0") {
        const emptyNote = document.createElement("li");
        emptyNote.id = "emptyNote";
        emptyNote.className = "empty";
        emptyNote.textContent =
            "No members yet. Register someone to begin.";

        memberList.appendChild(emptyNote);
    }
});

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    themeButton.textContent =
        document.body.classList.contains("dark")
            ? "Light Mode"
            : "Dark Mode";
});