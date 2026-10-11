export function startLoader() {
    const lockScreen = document.getElementById("loadingScreen");
    const overlay = document.getElementById("overlay");
    const display = document.getElementById("passcodeDisplay");
    const status = document.getElementById("passcodeStatus");
    const keypad = document.getElementById("passcodeKeypad");

    if (!lockScreen || !overlay || !display || !status || !keypad) return;

    const passcode = "2006";
    let entered = "";
    let unlocked = false;

    function render() {
        display.querySelectorAll("span").forEach((slot, index) => {
            slot.textContent = entered[index] ? "✦" : "";
            slot.classList.toggle("is-filled", Boolean(entered[index]));
        });
    }

    function resetWithError() {
        lockScreen.classList.add("is-wrong");
        status.textContent = "That is not the year. Try again ✦";
        entered = "";
        render();
        setTimeout(() => lockScreen.classList.remove("is-wrong"), 450);
    }

    function unlock() {
        unlocked = true;
        status.textContent = "The stars are ready for you…";
        lockScreen.classList.add("is-unlocking");
        window.dispatchEvent(new CustomEvent("unlockBirthday"));

        setTimeout(() => {
            lockScreen.style.display = "none";
            overlay.classList.add("is-revealed");
            overlay.style.opacity = "1";
            overlay.style.pointerEvents = "auto";
        }, 900);
    }

    function enterDigit(digit) {
        if (unlocked || entered.length === 4) return;

        entered += digit;
        render();

        if (entered.length === 4) {
            setTimeout(() => entered === passcode ? unlock() : resetWithError(), 180);
        }
    }

    keypad.addEventListener("click", (event) => {
        const key = event.target.closest("button");
        if (!key) return;

        if (key.dataset.action === "delete") {
            entered = entered.slice(0, -1);
            render();
            return;
        }

        enterDigit(key.dataset.digit);
    });

    window.addEventListener("keydown", (event) => {
        if (unlocked) return;
        if (/^\d$/.test(event.key)) enterDigit(event.key);
        if (event.key === "Backspace") {
            entered = entered.slice(0, -1);
            render();
        }
    });

    render();
}
