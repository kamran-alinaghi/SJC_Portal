const usePassButton = document.getElementById("username-pass-change");
const securityContainer = document.getElementById("security-container");
const closeButton = document.getElementById("close-button");
const saveButton = document.getElementById("save-button");
const cancleButton = document.getElementById("cancle-button");


const usernameInput = document.getElementById("username");
const newusernameInput = document.getElementById("newusername");
const oldpassInput = document.getElementById("oldpass");
const newpassInput = document.getElementById("newpass");
const confirmpassInput = document.getElementById("confirmpass");

usePassButton.onclick = function () { securityContainer.style.display = "block"; };
closeButton.onclick = function () { securityContainer.style.display = "none"; };
cancleButton.onclick = function () { securityContainer.style.display = "none"; };
saveButton.onclick = function () {
    if (newpassInput.value == confirmpassInput.value) {
        const data = {
            OldUsername: usernameInput.value,
            OldPassword: oldpassInput.value,
            NewUsername: newusernameInput.value,
            NewPassword: newpassInput.value
        }
        UpdateUser(data);
    }
    else { alert("Passwords don't match!"); }
}

function UpdateUser(data) {
    $.post("/apis/UpdateUser",
        JSON.stringify(data),
        function (data, status) {
            if (status == "success")
            {
                window.location.reload();
            }
        });
}

