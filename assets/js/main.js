import * as THREE from "three";

import { scene, camera, renderer } from "./scene.js";
import { startLoader } from "./loader.js";
import { createStars } from "./stars.js";
import { createGalaxy } from "./galaxy.js";
import { initMusic } from "./music.js";

import {
    createCake,
    showCake,
    animateCake,
    celebrateCake,
    cake
} from "./cake.js";

startLoader();
const music = initMusic();

window.addEventListener("unlockBirthday", () => {
    music.play();
});

const stars = createStars(scene);
const { nebula, nebulaAura, milkyway } = createGalaxy(scene);

// Original cake
createCake(scene);

const overlay = document.getElementById("overlay");
const beginBtn = document.getElementById("beginBtn");
const cakeInstruction = document.getElementById("cakeInstruction");
const celebrationLayer = document.getElementById("celebrationLayer");
const balloonsLayer = document.getElementById("balloonsLayer");
const crackersLayer = document.getElementById("crackersLayer");
const celebrationMessage = document.getElementById("celebrationMessage");
const memoriesSection = document.getElementById("memoriesSection");

let letterSection;
let giftSection;
let starGameSection;
let finaleSection;

let cakeReady = false;
let celebrationStarted = false;
let targetPointerX = 0;
let targetPointerY = 0;
let smoothPointerX = 0;
let smoothPointerY = 0;

window.addEventListener("pointermove", (event) => {
    if (document.body.classList.contains("cake-moment")) return;

    targetPointerX =
        event.clientX / window.innerWidth - 0.5;

    targetPointerY =
        event.clientY / window.innerHeight - 0.5;
});

prepareMemories();
prepareLetter();
prepareGift();
prepareStarGame();
prepareFinale();


// =====================================
// BEGIN BUTTON
// =====================================

if (beginBtn) {
    beginBtn.addEventListener("click", () => {
        music.play();
        beginBtn.disabled = true;

        document.body.classList.add(
            "universe-to-cake"
        );

        if (overlay) {
            overlay.classList.add("is-leaving");
        }

        // Change scenes while the expanding star covers the screen
        setTimeout(() => {
            document.body.classList.add(
                "cake-moment"
            );

            stars.visible = false;
            nebula.visible = false;
            if (nebulaAura) nebulaAura.visible = false;
            milkyway.visible = false;

            if (overlay) {
                overlay.style.opacity = "0";
                overlay.style.pointerEvents = "none";
            }

            showCake();
        }, 680);

        // Remove the transition class after its animation
        setTimeout(() => {
            document.body.classList.remove(
                "universe-to-cake"
            );
        }, 1550);

        // Enable the cake after it has risen into place
        setTimeout(() => {
            cakeReady = true;

            if (cakeInstruction) {
                cakeInstruction.style.opacity = "1";
            }
        }, 2100);
    });
}


// =====================================
// ORIGINAL CAKE CLICK
// =====================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createCakeCelebration() {
    document
        .querySelector(".cake-celebration-pop")
        ?.remove();

    document.body.classList.add("wish-celebration");

    const celebration = document.createElement("div");
    celebration.className = "cake-celebration-pop";
    celebration.setAttribute("aria-hidden", "true");

    const colors = [
        "#e4b95d",
        "#8296c4",
        "#f6dadd",
        "#26346f",
        "#f8f4e6"
    ];

    // Create paper confetti
    for (let i = 0; i < 46; i++) {
        const piece = document.createElement("i");
        piece.className = "cake-confetti-piece";

        const moveX =
            (Math.random() - 0.5) *
            window.innerWidth *
            0.9;

        const moveY =
            -(180 + Math.random() *
            window.innerHeight * 0.65);

        piece.style.setProperty("--move-x", `${moveX}px`);
        piece.style.setProperty("--move-y", `${moveY}px`);
        piece.style.setProperty(
            "--rotation",
            `${Math.random() * 360}deg`
        );
        piece.style.setProperty(
            "--delay",
            `${Math.random() * 0.28}s`
        );
        piece.style.setProperty(
            "--confetti-color",
            colors[i % colors.length]
        );

        celebration.appendChild(piece);
    }

    // Create four hand-drawn cracker bursts
    const crackerPositions = [
        [22, 39, 0],
        [78, 38, 0.12],
        [16, 67, 0.2],
        [84, 65, 0.3]
    ];

    crackerPositions.forEach(([left, top, delay]) => {
        const cracker = document.createElement("span");
        cracker.className = "cake-cracker-burst";
        cracker.style.setProperty("--left", `${left}%`);
        cracker.style.setProperty("--top", `${top}%`);
        cracker.style.setProperty("--delay", `${delay}s`);
        celebration.appendChild(cracker);
    });

    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
        document.body.classList.remove("wish-celebration");
    }, 2400);
}

renderer.domElement.addEventListener("click", (event) => {

    function startMemoriesTransition() {
        document
            .querySelector(".page-turn-transition")
            ?.remove();
    
        const transition =
            document.createElement("div");
    
        transition.className =
            "page-turn-transition";
    
        transition.setAttribute(
            "aria-hidden",
            "true"
        );
    
        document.body.appendChild(transition);
    
        // Change scenes while the paper covers the screen
        setTimeout(() => {
            document.body.classList.remove(
                "cake-moment"
            );
    
            if (cake) {
                cake.visible = false;
            }
    
            if (cakeInstruction) {
                cakeInstruction.style.opacity = "0";
            }
    
            if (celebrationLayer) {
                celebrationLayer.style.display = "none";
            }
    
            if (memoriesSection) {
                memoriesSection.style.display = "block";
    
                requestAnimationFrame(() => {
                    memoriesSection.classList.add(
                        "is-visible"
                    );
                });
            }
        }, 650);
    
        setTimeout(() => {
            transition.remove();
        }, 1500);
    }
    if (!cakeReady || celebrationStarted || !cake) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(cake, true);

    if (intersects.length === 0) return;

    celebrationStarted = true;

    if (cakeInstruction) {
        cakeInstruction.style.opacity = "0";
    }
    
    celebrateCake();
    createCakeCelebration();
    
    setTimeout(() => {
        if (cakeInstruction) {
            const instruction = cakeInstruction.querySelector("span");
    
            if (instruction) {
                instruction.textContent = "Your wish is on its way ✦";
            }
    
            cakeInstruction.style.opacity = "1";
        }
    }, 350);
    
    setTimeout(() => {
        if (cakeInstruction) {
            cakeInstruction.style.opacity = "0";
        }
    
        startMemoriesTransition();
    }, 2600);
});


// =====================================
// CELEBRATION
// =====================================

function startCelebration() {

    if (celebrationLayer) {
        celebrationLayer.style.display = "block";
        celebrationLayer.style.opacity = "1";
        celebrationLayer.style.pointerEvents = "none";
    }

    createBalloons();
    createCrackers();

    setTimeout(() => {
        if (celebrationMessage) {
            celebrationMessage.style.opacity = "1";
        }
    }, 500);

    setTimeout(goToMemories, 5500);
}


// =====================================
// BALLOONS
// =====================================

function createBalloons() {

    if (!balloonsLayer) return;

    balloonsLayer.replaceChildren();

    const balloons = [
        { left: 7, bottom: 20, size: 56, color: "#29346f", delay: 80, drift: 18 },
        { left: 16, bottom: 65, size: 43, color: "#8297c4", delay: 250, drift: -14 },
        { left: 4, bottom: 80, size: 46, color: "#f1d6a6", delay: 410, drift: 16 },
        { left: 93, bottom: 21, size: 56, color: "#29346f", delay: 140, drift: -18 },
        { left: 84, bottom: 65, size: 43, color: "#8297c4", delay: 310, drift: 14 },
        { left: 96, bottom: 80, size: 46, color: "#f1d6a6", delay: 470, drift: -16 }
    ];

    balloons.forEach(({ left, bottom, size, color, delay, drift }) => {

        const balloon = document.createElement("div");
        const string = document.createElement("div");

        balloon.className = "balloon";

        balloon.style.cssText = `
            position: absolute;
            left: ${left}%;
            bottom: -150px;
            width: ${size}px;
            height: ${size * 1.24}px;
            border-radius: 50% 50% 46% 46%;
            opacity: 0;
            background: #f9f6e8;
            border: 3px solid ${color};
            box-shadow: inset 7px 6px 0 rgba(255,255,255,.8);
            transform: translateX(-50%) scale(.65);
        `;

        string.style.cssText = `
            position: absolute;
            top: 94%;
            left: 50%;
            width: 1px;
            height: 58px;
            background: ${color};
            transform-origin: top;
        `;

        balloon.appendChild(string);
        balloonsLayer.appendChild(balloon);

        setTimeout(() => {

            balloon.animate(
                [
                    {
                        bottom: "-150px",
                        opacity: 0,
                        transform: "translateX(-50%) scale(.65)"
                    },
                    {
                        bottom: `${bottom}%`,
                        opacity: .92,
                        transform: "translateX(-50%) scale(1)"
                    }
                ],
                {
                    duration: 1500,
                    easing: "cubic-bezier(.2,.85,.25,1)",
                    fill: "forwards"
                }
            );

            setTimeout(() => {

                balloon.animate(
                    [
                        {
                            transform:
                                "translateX(-50%) translateY(0) rotate(-2deg)"
                        },
                        {
                            transform:
                                `translateX(calc(-50% + ${drift}px)) translateY(-12px) rotate(2deg)`
                        },
                        {
                            transform:
                                "translateX(-50%) translateY(0) rotate(-2deg)"
                        }
                    ],
                    {
                        duration: 3600,
                        iterations: Infinity,
                        easing: "ease-in-out"
                    }
                );

            }, 1200);

        }, delay);
    });
}


// =====================================
// CRACKERS
// =====================================

function createCrackers() {

    if (!crackersLayer) return;

    crackersLayer.replaceChildren();

    const bursts = [
        [15, 28, 28],
        [85, 26, 30],
        [11, 63, 20],
        [89, 60, 20]
    ];

    bursts.forEach(([x, y, amount], index) => {
        setTimeout(
            () => createExplosion(x, y, amount),
            index * 620
        );
    });
}


function createExplosion(x, y, amount) {

    if (!crackersLayer) return;

    const colors = [
        "#26336e",
        "#8297c4",
        "#e9c978",
        "#f7f4e5"
    ];

    for (let i = 0; i < amount; i++) {

        const particle = document.createElement("span");

        const angle = Math.random() * Math.PI * 2;
        const distance = 46 + Math.random() * 105;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance + 28;

        const size = 2 + Math.random() * 3;

        const color =
            colors[Math.floor(Math.random() * colors.length)];

        particle.className = "cracker";

        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size * (1.5 + Math.random())}px;
            border-radius: 2px;
            opacity: 0;
            background: ${color};
            box-shadow: none;
            transform: translate(-50%, -50%);
        `;

        crackersLayer.appendChild(particle);

        particle.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translate(-50%, -50%) scale(.35)"
                },
                {
                    opacity: 1,
                    offset: .12
                },
                {
                    opacity: 0,
                    transform:
                        `translate(
                            calc(-50% + ${dx}px),
                            calc(-50% + ${dy}px)
                        ) scale(.7)`
                }
            ],
            {
                duration: 1250 + Math.random() * 350,
                easing: "cubic-bezier(.12,.7,.24,1)",
                fill: "forwards"
            }
        );

        setTimeout(() => particle.remove(), 1700);
    }
}


// =====================================
// GO TO MEMORIES
// =====================================

function goToMemories() {

    if (celebrationLayer) {
        celebrationLayer.style.opacity = "0";
    }

    setTimeout(() => {

        if (celebrationLayer) {
            celebrationLayer.style.display = "none";
        }

        if (memoriesSection) {
            memoriesSection.style.display = "block";

            requestAnimationFrame(() => {
                memoriesSection.classList.add("is-visible");
            });
        }

    }, 1000);
}


// =====================================
// MEMORIES
// =====================================

function prepareMemories() {

    if (!memoriesSection) return;

    memoriesSection.innerHTML = `
        <div
            class="scrapbook-scene"
            aria-labelledby="scrapbookTitle"
        >

            <div class="scrapbook-background" aria-hidden="true">
                <span>♥</span>
                <span>✦</span>
                <span>♥</span>
                <span>✦</span>
                <span>♥</span>
                <span>✦</span>
            </div>

            <header class="scrapbook-header">
                <p>CHAPTER TWO</p>

                <h1 id="scrapbookTitle">
                    Our Little Story
                </h1>

                <span>
                    Turn the pages of some beautiful moments.
                </span>
            </header>

            <div class="scrapbook-wrapper">

                <button
                    class="scrapbook-arrow scrapbook-arrow--previous"
                    id="scrapbookPrevious"
                    type="button"
                    aria-label="Previous scrapbook pages"
                >
                    ←
                </button>

                <div class="scrapbook-book" id="scrapbookBook">

                    <div class="scrapbook-spine" aria-hidden="true"></div>

                    <!-- SPREAD ONE -->
                    <section
                        class="scrapbook-spread is-active"
                        data-spread="0"
                    >

                        <article class="scrapbook-page scrapbook-page--left scrapbook-cover-page">

                            <div class="paper-tape paper-tape--top"></div>

                            <p class="scrapbook-small-title">
                                A COLLECTION OF
                            </p>

                            <h2>
                                Beautiful
                                <em>Memories</em>
                            </h2>

                            <div class="cover-heart">
                                ♥
                            </div>

                            <p class="cover-message">
                                Every photograph holds a little piece
                                of our story.
                            </p>

                            <div class="page-doodle page-doodle--hearts">
                                ♡ ♡ ♡
                            </div>

                            <span class="page-number">01</span>

                        </article>

                        <article class="scrapbook-page scrapbook-page--right scrapbook-note-page">

                            <div class="paper-label">
                                EDITOR'S NOTE
                            </div>

                            <div class="scrapbook-photo scrapbook-photo--portrait" data-photo-card="true">
                                <img src="./assets/photos/photo3.jpeg" alt="Sneha" class="scrapbook-img" data-caption="A radiant smile that lights up every single day ✨" />
                                <div class="photo-tap-hint">Tap to view full</div>
                            </div>

                            <p class="handwritten-note">
                                This little book is filled with moments
                                that became special simply because
                                you were part of them.
                            </p>

                            <div class="note-signature">
                                made with love ♥
                            </div>

                            <span class="page-number">02</span>

                        </article>

                    </section>

                    <!-- SPREAD TWO -->
                    <section
                        class="scrapbook-spread"
                        data-spread="1"
                        aria-hidden="true"
                    >

                        <article class="scrapbook-page scrapbook-page--left scrapbook-collage-page">

                            <p class="scrapbook-small-title">
                                THE MOMENTS
                            </p>

                            <h2>That Make Me Smile</h2>

                            <div class="collage-layout collage-layout--left">

                                <div class="scrapbook-photo scrapbook-photo--one" data-photo-card="true">
                                    <img src="./assets/photos/photo2.jpeg" alt="Sneha car selfie" class="scrapbook-img" data-caption="Spontaneous road trips, chill vibes and cool shades 🚗🕶️" />
                                </div>

                                <div class="scrapbook-photo scrapbook-photo--two" data-photo-card="true">
                                    <img src="./assets/photos/photo4.jpeg" alt="Sneha festive celebration" class="scrapbook-img" data-caption="Festival celebrations and golden nights 🌙💫" />
                                </div>

                            </div>

                            <p class="scrapbook-caption">
                                Some days quietly become memories
                                we never want to lose.
                            </p>

                            <div class="page-doodle page-doodle--star">
                                ✦
                            </div>

                            <span class="page-number">03</span>

                        </article>

                        <article class="scrapbook-page scrapbook-page--right scrapbook-pink-page">

                            <div class="paper-tape paper-tape--corner"></div>

                            <p class="scrapbook-small-title">
                                FAVOURITE DAYS
                            </p>

                            <div class="scrapbook-photo scrapbook-photo--large" data-photo-card="true">
                                <img src="./assets/photos/photo5.jpeg" alt="Sneha with roses" class="scrapbook-img" data-caption="A gorgeous bouquet of red roses for someone truly special 🌹❤️" />
                                <div class="photo-tap-hint">Tap to view full</div>
                            </div>

                            <p class="pink-page-note">
                                Happiness looks a little like this.
                            </p>

                            <div class="page-doodle page-doodle--flower">
                                ✿
                            </div>

                            <span class="page-number">04</span>

                        </article>

                    </section>

                    <!-- SPREAD THREE -->
                    <section
                        class="scrapbook-spread"
                        data-spread="2"
                        aria-hidden="true"
                    >

                        <article class="scrapbook-page scrapbook-page--left scrapbook-film-page">

                            <p class="scrapbook-small-title">
                                LITTLE MOMENTS
                            </p>

                            <h2>Our Story</h2>

                            <div class="scrapbook-filmstrip" id="scrapbookFilmstrip">

                                <div class="filmstrip-track" id="filmstripTrack">

                                    <div class="film-photo" data-photo-card="true">
                                        <img src="./assets/photos/photo6.jpeg" alt="Moments together" class="film-img" data-caption="Sweet filters & silly laughter together 💕" />
                                    </div>

                                    <div class="film-photo" data-photo-card="true">
                                        <img src="./assets/photos/photo7.jpeg" alt="Under fairy lights" class="film-img" data-caption="Lit up beneath the golden stars & fairy lights ✨" />
                                    </div>

                                    <div class="film-photo" data-photo-card="true">
                                        <img src="./assets/photos/photo8.jpeg" alt="Smiles together" class="film-img" data-caption="Cherished memories that last a lifetime 🌟" />
                                    </div>

                                    <!-- Cloned frames for seamless continuous reel on mobile -->
                                    <div class="film-photo film-photo--clone" data-photo-card="true">
                                        <img src="./assets/photos/photo6.jpeg" alt="Moments together" class="film-img" data-caption="Sweet filters & silly laughter together 💕" />
                                    </div>

                                    <div class="film-photo film-photo--clone" data-photo-card="true">
                                        <img src="./assets/photos/photo7.jpeg" alt="Under fairy lights" class="film-img" data-caption="Lit up beneath the golden stars & fairy lights ✨" />
                                    </div>

                                    <div class="film-photo film-photo--clone" data-photo-card="true">
                                        <img src="./assets/photos/photo8.jpeg" alt="Smiles together" class="film-img" data-caption="Cherished memories that last a lifetime 🌟" />
                                    </div>

                                </div>

                            </div>

                            <p class="film-caption">
                                Laughter, adventures and everything
                                in between.
                            </p>

                            <span class="page-number">05</span>

                        </article>

                        <article class="scrapbook-page scrapbook-page--right scrapbook-letter-page">

                            <div class="scrapbook-stamp">
                                SPECIAL
                                <span>♥</span>
                            </div>

                            <p class="scrapbook-small-title">
                                A NOTE TO REMEMBER
                            </p>

                            <h2>Dear Sneha,</h2>

                            <p class="scrapbook-writing">
                                There are people who make ordinary
                                moments feel brighter. You are one of
                                those people.
                            </p>

                            <p class="scrapbook-writing">
                                May every new memory be warmer,
                                happier and more beautiful than
                                the last.
                            </p>

                            <div class="scribbled-heart">
                                ♡
                            </div>

                            <span class="page-number">06</span>

                        </article>

                    </section>

                    <!-- SPREAD FOUR -->
                    <section
                        class="scrapbook-spread"
                        data-spread="3"
                        aria-hidden="true"
                    >

                        <article class="scrapbook-page scrapbook-page--left scrapbook-birthday-page">

                            <div class="birthday-post-label">
                                THE BIRTHDAY POST
                            </div>

                            <h2>
                                Happy
                                <em>Birthday</em>
                            </h2>

                            <div class="scrapbook-photo scrapbook-photo--birthday" data-photo-card="true">
                                <img src="./assets/photos/photo9.jpeg" alt="Sneha birthday portrait" class="scrapbook-img" data-caption="The Birthday Post — To Sneha on her special day! 🎂👑" />
                                <div class="photo-tap-hint">Tap to view full</div>
                            </div>

                            <p>
                                Today is completely yours.
                            </p>

                            <span class="page-number">07</span>

                        </article>

                        <article class="scrapbook-page scrapbook-page--right scrapbook-final-page">

                            <p class="scrapbook-small-title">
                                ONE LAST PAGE
                            </p>

                            <h2>
                                To many more
                                beautiful memories
                            </h2>

                            <div class="final-page-heart">
                                ♥
                            </div>

                            <p>
                                The best chapters are still waiting
                                to be written.
                            </p>

                            <div class="final-page-signature">
                                for Sneha, always
                            </div>

                            <span class="page-number">08</span>

                        </article>

                    </section>

                </div>

                <button
                    class="scrapbook-arrow scrapbook-arrow--next"
                    id="scrapbookNext"
                    type="button"
                    aria-label="Next scrapbook pages"
                >
                    →
                </button>

            </div>

            <div class="scrapbook-navigation">

                <div
                    class="scrapbook-progress"
                    id="scrapbookProgress"
                    aria-label="Scrapbook page progress"
                >
                    <span class="is-active"></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <p id="scrapbookPageText">
                    Pages 1–2 of 8
                </p>

            </div>

            <p class="scrapbook-mobile-hint">
                Swipe or use the arrows to turn the pages
            </p>

        </div>
    `;

    const book =
        document.getElementById("scrapbookBook");

    const previousButton =
        document.getElementById("scrapbookPrevious");

    const nextButton =
        document.getElementById("scrapbookNext");

    const pageText =
        document.getElementById("scrapbookPageText");

    const spreads = [
        ...memoriesSection.querySelectorAll(
            ".scrapbook-spread"
        )
    ];

    const progressDots = [
        ...memoriesSection.querySelectorAll(
            ".scrapbook-progress span"
        )
    ];

    let currentSpread = 0;
    let currentMobilePage = 0;
    let pageTurning = false;
    let touchStartX = 0;
    
    const mobileBookQuery =
        window.matchMedia("(max-width: 760px)");
    
    function isMobileBook() {
        return mobileBookQuery.matches;
    }
    
    function updateScrapbook(
        direction = "next",
        animate = true
    ) {
    
        const mobile = isMobileBook();
    
        const visibleSpread = mobile
            ? Math.floor(currentMobilePage / 2)
            : currentSpread;
    
        const showLeftPage =
            mobile && currentMobilePage % 2 === 0;
    
        spreads.forEach((spread, index) => {
    
            const isCurrent =
                index === visibleSpread;
    
            spread.classList.toggle(
                "is-active",
                isCurrent
            );
    
            spread.classList.toggle(
                "show-left-page",
                isCurrent && showLeftPage
            );
    
            spread.classList.toggle(
                "show-right-page",
                isCurrent && mobile && !showLeftPage
            );
    
            spread.setAttribute(
                "aria-hidden",
                String(!isCurrent)
            );
        });
    
        progressDots.forEach((dot, index) => {
    
            const activeIndex = mobile
                ? Math.floor(currentMobilePage / 2)
                : currentSpread;
    
            dot.classList.toggle(
                "is-active",
                index === activeIndex
            );
        });
    
        if (pageText) {
            if (mobile) {
                pageText.textContent =
                    `Page ${currentMobilePage + 1} of 8`;
            } else {
                const firstPage =
                    currentSpread * 2 + 1;
    
                pageText.textContent =
                    `Pages ${firstPage}–${firstPage + 1} of 8`;
            }
        }
    
        if (previousButton) {
            previousButton.disabled = mobile
                ? currentMobilePage === 0
                : currentSpread === 0;
        }
    
        const isLastPage = mobile
            ? currentMobilePage === 7
            : currentSpread === spreads.length - 1;
    
        if (nextButton) {
            nextButton.innerHTML = isLastPage
                ? `Open the letter <span>♥</span>`
                : `→`;
    
            nextButton.setAttribute(
                "aria-label",
                isLastPage
                    ? "Continue to the birthday letter"
                    : "Next scrapbook page"
            );
        }
    
        book?.classList.remove(
            "turning-next",
            "turning-previous"
        );
    
        if (!animate) {
            pageTurning = false;
            return;
        }
    
        requestAnimationFrame(() => {
            book?.classList.add(
                direction === "previous"
                    ? "turning-previous"
                    : "turning-next"
            );
        });
    
        setTimeout(() => {
            book?.classList.remove(
                "turning-next",
                "turning-previous"
            );
    
            pageTurning = false;
        }, 700);
    }
    
    function goToNextPage() {
    
        if (pageTurning) return;
    
        if (isMobileBook()) {
    
            if (currentMobilePage === 7) {
                showLetter();
                return;
            }
    
            pageTurning = true;
            currentMobilePage += 1;
            currentSpread =
                Math.floor(currentMobilePage / 2);
    
            updateScrapbook("next");
            return;
        }
    
        if (currentSpread === spreads.length - 1) {
            showLetter();
            return;
        }
    
        pageTurning = true;
        currentSpread += 1;
        currentMobilePage = currentSpread * 2;
    
        updateScrapbook("next");
    }
    
    function goToPreviousPage() {
    
        if (pageTurning) return;
    
        if (isMobileBook()) {
    
            if (currentMobilePage === 0) return;
    
            pageTurning = true;
            currentMobilePage -= 1;
            currentSpread =
                Math.floor(currentMobilePage / 2);
    
            updateScrapbook("previous");
            return;
        }
    
        if (currentSpread === 0) return;
    
        pageTurning = true;
        currentSpread -= 1;
        currentMobilePage = currentSpread * 2;
    
        updateScrapbook("previous");
    }
    
    previousButton?.addEventListener(
        "click",
        goToPreviousPage
    );
    
    nextButton?.addEventListener(
        "click",
        goToNextPage
    );
    
    book?.addEventListener("pointerdown", (event) => {
        touchStartX = event.clientX;
    });
    
    book?.addEventListener("pointerup", (event) => {
    
        const distance =
            event.clientX - touchStartX;
    
        if (Math.abs(distance) < 45) return;
    
        if (distance < 0) {
            goToNextPage();
        } else {
            goToPreviousPage();
        }
    });
    
    window.addEventListener("keydown", (event) => {
    
        if (
            !memoriesSection.classList.contains(
                "is-visible"
            )
        ) {
            return;
        }
    
        if (event.key === "ArrowRight") {
            goToNextPage();
        }
    
        if (event.key === "ArrowLeft") {
            goToPreviousPage();
        }
    });
    
    mobileBookQuery.addEventListener(
        "change",
        () => {
            currentMobilePage = currentSpread * 2;
            updateScrapbook("next", false);
        }
    );
    
    updateScrapbook("next", false);

    // =====================================
    // PHOTO LIGHTBOX VIEWER (NEVER CROP)
    // =====================================
    function setupPhotoLightbox() {
        let lightbox = document.getElementById("photoLightboxModal");
        if (!lightbox) {
            lightbox = document.createElement("div");
            lightbox.id = "photoLightboxModal";
            lightbox.className = "photo-lightbox-modal";
            lightbox.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" type="button" aria-label="Close photo preview">✕</button>
                    <div class="lightbox-img-wrapper">
                        <img src="" alt="Photo Preview" class="lightbox-img" />
                    </div>
                    <p class="lightbox-caption"></p>
                </div>
            `;
            document.body.appendChild(lightbox);

            const closeBtn = lightbox.querySelector(".lightbox-close");
            const backdrop = lightbox.querySelector(".lightbox-backdrop");
            const close = () => {
                lightbox.classList.remove("is-open");
                document.body.style.overflow = "";
            };

            closeBtn.addEventListener("click", close);
            backdrop.addEventListener("click", close);
            window.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
                    close();
                }
            });
        }

        const openLightbox = (imgEl) => {
            if (!imgEl || !imgEl.src) return;
            const lbImg = lightbox.querySelector(".lightbox-img");
            const lbCaption = lightbox.querySelector(".lightbox-caption");
            lbImg.src = imgEl.src;
            lbImg.alt = imgEl.alt || "Photo Preview";
            lbCaption.textContent = imgEl.getAttribute("data-caption") || imgEl.alt || "";
            lightbox.classList.add("is-open");
        };

        const allPhotos = document.querySelectorAll(
            ".scrapbook-img, .film-img, .passcode-main-photo"
        );
        allPhotos.forEach((img) => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", (e) => {
                e.stopPropagation();
                openLightbox(img);
            });
        });
    }

    setupPhotoLightbox();

    // =====================================
    // AUTOMATIC CONTINUOUS MOVING FILM (MOBILE)
    // =====================================
    function initAutoMovingFilm() {
        const track = document.getElementById("filmstripTrack");
        if (!track) return;

        let filmPos = 0;
        let isTouching = false;
        let isLightboxActive = false;
        const speed = 0.8; // Smooth cinematic scrolling speed

        // Pause when lightbox opens
        const lightbox = document.getElementById("photoLightboxModal");
        if (lightbox) {
            const observer = new MutationObserver(() => {
                isLightboxActive = lightbox.classList.contains("is-open");
            });
            observer.observe(lightbox, { attributes: true, attributeFilter: ["class"] });
        }

        track.addEventListener("touchstart", () => {
            isTouching = true;
        }, { passive: true });

        track.addEventListener("touchend", () => {
            setTimeout(() => {
                isTouching = false;
            }, 1200);
        });

        track.addEventListener("touchcancel", () => {
            isTouching = false;
        });

        function animateReel() {
            if (isMobileBook()) {
                if (!isTouching && !isLightboxActive) {
                    const halfWidth = track.scrollWidth / 2;
                    if (halfWidth > 0) {
                        filmPos += speed;
                        if (filmPos >= halfWidth) {
                            filmPos -= halfWidth;
                        }
                        track.style.transform = `translate3d(-${filmPos}px, 0, 0)`;
                    }
                }
            } else {
                track.style.transform = "";
                filmPos = 0;
            }
            requestAnimationFrame(animateReel);
        }

        requestAnimationFrame(animateReel);
    }

    initAutoMovingFilm();
}

// =====================================
// LETTER
// =====================================

function prepareLetter() {

    letterSection = document.createElement("section");

    letterSection.id = "letterSection";

    letterSection.setAttribute(
        "aria-label",
        "A birthday letter"
    );

    letterSection.innerHTML = `
        <div class="letter-scene">

            <div class="rose-petals" aria-hidden="true"></div>

            <div class="letter-question" id="letterQuestion">

                <p class="letter-kicker">ONE MORE THING</p>

                <h1>
                    Would you like to open a little letter?
                </h1>

                <p>
                    There is something written especially for you.
                </p>

                <div class="letter-choice">

                    <button
                        class="letter-yes"
                        id="letterYes"
                        type="button"
                    >
                        Yes, show me <span>♥</span>
                    </button>

                    <button
                        class="letter-no"
                        id="letterNo"
                        type="button"
                    >
                        No
                    </button>

                </div>

            </div>

            <div
                class="letter-reveal"
                id="letterReveal"
                aria-hidden="true"
            >

                <div class="envelope" aria-hidden="true">
                    <div class="envelope-flap"></div>
                    <div class="envelope-seal">♥</div>
                </div>

                <article class="love-letter">

                    <p class="letter-date">
                        FOR SNEHA ♥
                    </p>

                    <p>
                        Happy birthday 😔 bharwachoda. Budhi 20 saal hogaye hai fir bhi rotte rehti hai 💅🏻. Tarpor momo banano kotodur sikhle ota korei future chalaite hobe.
                    </p>

                    <p>
                        Btw , thnx for always being there everytime helping me, motivating me whenever I am down. Ik you are busy with your life and we don't spend time like the old days but I am still grateful you take out some time from your busy schedule to eat snacks with me in the evening.
                    </p>

                    <p>
                        Remember i am very proud of the way you have always been and still are. Never change 🗿 ar biyer aage ekta switzerland tour hobe okhane momo not allowed.
                    </p>

                    <p class="letter-signoff">
                        <em>With love ♥</em>
                    </p>

                    <button
                        class="gift-continue"
                        id="giftContinue"
                        type="button"
                    >
                        There is one more surprise
                        <span>→</span>
                    </button>

                </article>

            </div>

        </div>
    `;

    document.body.appendChild(letterSection);

    document
        .getElementById("letterYes")
        ?.addEventListener("click", openLetter);

    document
        .getElementById("letterNo")
        ?.addEventListener("pointerenter", moveNoButton);

    document
        .getElementById("letterNo")
        ?.addEventListener("click", moveNoButton);

    document
        .getElementById("giftContinue")
        ?.addEventListener("click", showGift);
}


function showLetter() {
    if (!letterSection) return;

    document
        .querySelector(".letter-page-transition")
        ?.remove();

    const transition =
        document.createElement("div");

    transition.className =
        "letter-page-transition";

    transition.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.appendChild(transition);

    // Change pages while the heart transition covers the screen
    setTimeout(() => {
        if (memoriesSection) {
            memoriesSection.style.display = "none";
        }

        letterSection.style.display = "block";

        requestAnimationFrame(() => {
            letterSection.classList.add(
                "is-visible"
            );
        });
    }, 720);

    setTimeout(() => {
        transition.remove();
    }, 1650);
}

function moveNoButton() {

    const noButton = document.getElementById("letterNo");
    const choices = noButton?.parentElement;

    if (!noButton || !choices) return;

    const maxX =
        Math.max(
            50,
            choices.clientWidth - noButton.offsetWidth
        );

    const maxY = 110;

    noButton.style.transform =
        `translate(
            ${Math.round((Math.random() - .5) * maxX)}px,
            ${Math.round((Math.random() - .5) * maxY)}px
        )`;
}


function openLetter() {

    const question =
        document.getElementById("letterQuestion");

    const reveal =
        document.getElementById("letterReveal");

    if (!question || !reveal) return;

    question.classList.add("is-hidden");

    reveal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        reveal.classList.add("is-open");
    }, 280);
}


// =====================================
// GIFT
// =====================================

function prepareGift() {

    giftSection = document.createElement("section");

    giftSection.id = "giftSection";

    giftSection.setAttribute(
        "aria-label",
        "A special birthday gift"
    );

    giftSection.innerHTML = `
        <div class="gift-scene">

            <div class="gift-sparkles" aria-hidden="true"></div>

            <header class="gift-header">
                <p>A LITTLE SURPRISE FOR YOU</p>
                <h1>Open your gift</h1>
                <span>Made with love, just for Sneha ♥</span>
            </header>

            <button
                class="gift-box"
                id="giftBox"
                type="button"
                aria-label="Open your gift box"
            >

                <span class="gift-lid"></span>
                <span class="gift-ribbon gift-ribbon--vertical"></span>
                <span class="gift-ribbon gift-ribbon--horizontal"></span>
                <span class="gift-bow">♥</span>
                <small>Tap to open</small>

            </button>

            <div
                class="gift-reveal"
                id="giftReveal"
                aria-hidden="true"
            >

                <div
                    class="gift-artwork"
                    aria-label="A blooming bouquet and teddy bear gift"
                >

                    <div class="gift-light" aria-hidden="true"></div>

                    <div
                        class="flower-bouquet"
                        aria-hidden="true"
                    >

                        <span class="stem stem--1"></span>
                        <span class="stem stem--2"></span>
                        <span class="stem stem--3"></span>
                        <span class="stem stem--4"></span>
                        <span class="stem stem--5"></span>

                        <span class="leaf leaf--1"></span>
                        <span class="leaf leaf--2"></span>
                        <span class="leaf leaf--3"></span>

                        <span class="rose rose--1"></span>
                        <span class="rose rose--2"></span>
                        <span class="rose rose--3"></span>
                        <span class="rose rose--4"></span>
                        <span class="rose rose--5"></span>

                    </div>

                    <div
                        class="gift-teddy"
                        aria-hidden="true"
                    >
                        <i class="teddy-ear teddy-ear--left"></i>
                        <i class="teddy-ear teddy-ear--right"></i>

                        <i class="teddy-face">
                            <b></b>
                            <em></em>
                        </i>

                        <i class="teddy-body">
                            <b>♥</b>
                        </i>
                    </div>

                    <span class="butterfly butterfly--1" aria-hidden="true">♥</span>
                    <span class="butterfly butterfly--2" aria-hidden="true">♥</span>
                    <span class="butterfly butterfly--3" aria-hidden="true">♥</span>

                </div>

                <p class="gift-caption">
                    A little bouquet, a little teddy,
                    and a whole lot of love for you.
                </p>

                <button
                    class="finale-continue"
                    id="finaleContinue"
                    type="button"
                >
                    One last wish <span>✦</span>
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(giftSection);

    document
        .getElementById("giftBox")
        ?.addEventListener("click", openGift);

        document
        .getElementById("finaleContinue")
        ?.addEventListener("click", showStarGame);
}


function showGift() {
    if (!giftSection) return;

    document
        .querySelector(".gift-page-transition")
        ?.remove();

    const transition =
        document.createElement("div");

    transition.className =
        "gift-page-transition";

    transition.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.appendChild(transition);

    // Change sections while the wrapping paper covers the screen
    setTimeout(() => {
        if (letterSection) {
            letterSection.style.display = "none";
        }

        giftSection.style.display = "block";

        requestAnimationFrame(() => {
            giftSection.classList.add(
                "is-visible"
            );
        });
    }, 760);

    setTimeout(() => {
        transition.remove();
    }, 1750);
}


function openGift() {

    const giftBox =
        document.getElementById("giftBox");

    const reveal =
        document.getElementById("giftReveal");

    if (!giftBox || !reveal) return;

    giftBox.classList.add("is-open");

    setTimeout(() => {

        reveal.setAttribute(
            "aria-hidden",
            "false"
        );

        reveal.classList.add("is-visible");

    }, 780);
}
// =====================================
// CATCH 20 STARS
// =====================================

function prepareStarGame() {

    starGameSection =
        document.createElement("section");

    starGameSection.id = "starGameSection";

    starGameSection.setAttribute(
        "aria-label",
        "Catch twenty birthday stars"
    );

    const starPositions = [
        [10, 25],
        [24, 18],
        [39, 28],
        [56, 19],
        [73, 26],
        [89, 20],
        [16, 44],
        [31, 39],
        [48, 48],
        [65, 39],
        [83, 45],
        [8, 64],
        [24, 60],
        [40, 68],
        [58, 61],
        [76, 67],
        [92, 60],
        [22, 79],
        [50, 77],
        [80, 80]
    ];

    starGameSection.innerHTML = `
        <div class="star-game-scene">

            <div
                class="star-game-nebula"
                aria-hidden="true"
            ></div>

            <header class="star-game-header">

                <p>ONE STAR FOR EVERY YEAR</p>

                <h1>Catch 20 Stars</h1>

                <span>
                    Tap every glowing star to complete
                    your birthday constellation.
                </span>

            </header>

            <div
                class="star-counter"
                id="starCounter"
                aria-live="polite"
            >
                <strong id="caughtStarCount">0</strong>
                <span>/ 20</span>
            </div>

            <div
                class="catching-stars-field"
                id="catchingStarsField"
            >

                ${starPositions.map(
                    ([left, top], index) => `
                        <button
                            class="catching-star"
                            type="button"
                            data-star="${index + 1}"
                            style="
                                --star-left: ${left}%;
                                --star-top: ${top}%;
                                --star-delay: ${(
                                    index * 0.13
                                ).toFixed(2)}s;
                            "
                            aria-label="Catch star ${index + 1}"
                        >
                            <span>✦</span>
                        </button>
                    `
                ).join("")}

            </div>

            <p
                class="star-game-status"
                id="starGameStatus"
                aria-live="polite"
            >
                Twenty little stars are waiting for you.
            </p>

            <div
                class="star-game-complete"
                id="starGameComplete"
                aria-hidden="true"
            >

                <div
                    class="completed-heart"
                    aria-hidden="true"
                >
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                </div>

                <p class="star-complete-kicker">
                    ALL TWENTY FOUND
                </p>

                <h2>You completed the constellation</h2>

                <p>
                    All 20 stars caught! Now make one last birthday wish ✨
                </p>

                <button
                    class="star-finale-button"
                    id="starFinaleButton"
                    type="button"
                >
                    One final birthday wish
                    <span>→</span>
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(starGameSection);

    const starButtons = [
        ...starGameSection.querySelectorAll(
            ".catching-star"
        )
    ];

    const countDisplay =
        document.getElementById("caughtStarCount");

    const status =
        document.getElementById("starGameStatus");

    const completeMessage =
        document.getElementById("starGameComplete");

    let caughtStars = 0;

    const starMessages = [
        "😔 tumi ekta bc",
        "😔 ek plate momo lgao",
        "😔 amar gift ki dekhtesis ja ja momo songe kotha bol hushh",
        "👉🏻👈🏻 chol hotwheels gift kor amk",
        "ek phool doh phool sneha beautiful 😔",
        "ek kachori doh samosa sneha par nhi bharosa",
        "chol party dehh",
        "😔 biriyani hobe na skkye party lgbe",
        "chal chal shuu",
        "Sneha ko Google Maps ki zarurat nahi, kyunki woh khud hi hamesha lost in overthinking rehti hai. 😭",
        "Sneha ka naam sunke Alexa bhi bolti hai, \"Sorry, main itna drama handle nahi kar sakti.\" 💀",
        "Sneha ka full form: Sabse Nautanki Ekdam High-level Aafat. 💀",
        "Sneha itni slow hai ki Internet Explorer bhi usko bolta hai, \"Jaldi kar behen!\" 😭",
        "Sneha jab selfie leti hai toh camera bolta hai, \"Please try again later.\" 📸💀",
        "Ek gulab, do gulab, Sneha ka koi nahi jawaab! 🌹",
        "Ek noor, do noor, Sneha ka chehra kohinoor! 💎",
        "Chaand bhi sharma jaaye, Jab Sneha muskuraaye! 💗",
        "Sneha, tu woh notification hai jise log bina padhe swipe kar dete hain. 😭",
        "Ek kela, do kela, Sneha ka logic akela; dhoondhne nikle NASA wale, mila na ek bhi dhela. 😂",
        "Ek bandar, do bandar, Sneha ke dimaag ke andar; dono bole bhaag chalo, yahan toh khaali hai andar! 💀"
    ];

    starButtons.forEach((star) => {

        star.addEventListener("click", () => {

            if (
                star.classList.contains("is-caught")
            ) {
                return;
            }

            star.classList.add("is-caught");

            star.disabled = true;
            caughtStars += 1;

            if (countDisplay) {
                countDisplay.textContent =
                    String(caughtStars);
            }

            const starNumber =
    Number(star.dataset.star);

const currentMessage =
    starMessages[starNumber - 1];

if (status) {
    status.textContent = currentMessage;
}

starGameSection
    .querySelector(".caught-star-message")
    ?.remove();

const messagePopup =
    document.createElement("div");

messagePopup.className =
    "caught-star-message";

messagePopup.innerHTML = `
    <span>✦</span>
    <p>${currentMessage}</p>
`;

starGameSection
    .querySelector(".star-game-scene")
    ?.appendChild(messagePopup);

requestAnimationFrame(() => {
    messagePopup.classList.add("is-visible");
});

const displayDuration = Math.max(2600, currentMessage.length * 48);

setTimeout(() => {
    messagePopup.classList.remove("is-visible");

    setTimeout(() => {
        messagePopup.remove();
    }, 350);
}, displayDuration);

            if (caughtStars === 20) {

                starGameSection.classList.add(
                    "is-complete"
                );

                if (status) {
                    status.textContent =
                        "Every star has found its place ♥";
                }

                setTimeout(() => {

                    completeMessage?.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    completeMessage?.classList.add(
                        "is-visible"
                    );

                }, 800);
            }
        });
    });

    document
        .getElementById("starFinaleButton")
        ?.addEventListener("click", showFinale);
}


function showStarGame() {

    if (!starGameSection) return;

    document
        .querySelector(".star-game-transition")
        ?.remove();

    const transition =
        document.createElement("div");

    transition.className =
        "star-game-transition";

    transition.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.appendChild(transition);

    setTimeout(() => {

        if (giftSection) {
            giftSection.style.display = "none";
        }
        if (starGameSection) {
            starGameSection.style.display = "none";
        }

        starGameSection.style.display = "block";

        requestAnimationFrame(() => {
            starGameSection.classList.add(
                "is-visible"
            );
        });

    }, 760);

    setTimeout(() => {
        transition.remove();
    }, 1750);
}

// =====================================
// FINALE
// =====================================

function prepareFinale() {

    finaleSection = document.createElement("section");

    finaleSection.id = "finaleSection";

    finaleSection.setAttribute(
        "aria-label",
        "Final birthday wish"
    );

    const lanterns = [
        [7, 78, 4.4],
        [15, 58, 5.3],
        [24, 85, 4.1],
        [34, 67, 5.7],
        [45, 91, 4.2],
        [57, 72, 5],
        [68, 88, 4.4],
        [78, 56, 5.6],
        [88, 80, 4.2],
        [95, 66, 5]
    ];

    finaleSection.innerHTML = `
        <div class="finale-scene">

            <div class="finale-stars" aria-hidden="true"></div>

            <div
                class="lantern-sky"
                aria-hidden="true"
            >
                ${lanterns.map(
                    ([x, y, delay]) =>
                        `<i
                            class="sky-lantern"
                            style="--x:${x}%; --y:${y}%; --delay:-${delay}s"
                        ></i>`
                ).join("")}
            </div>

            <div
                class="heart-sky"
                id="heartSky"
                aria-hidden="true"
            ></div>

            <div class="finale-message">

                <p>ONCE AGAIN</p>

                <h1>
                    A very happy
                    <br>
                    birthday
                </h1>

                <h2>
                    Sneha <span>♥</span>
                </h2>

                <div class="finale-line"></div>

                <small>
                    May every wish in your heart find its way to you.
                </small>

            </div>

            <footer class="finale-footer">
                Made with <span>♥</span> for Sneha
            </footer>

        </div>
    `;

    document.body.appendChild(finaleSection);

    createHeartStars();
}


function createHeartStars() {

    const heartSky =
        document.getElementById("heartSky");

    if (!heartSky) return;

    for (let i = 0; i < 92; i++) {

        const t =
            (i / 92) * Math.PI * 2;

        const x =
            16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        const star =
            document.createElement("i");

        star.className = "heart-star";

        star.textContent =
            i % 4 === 0 ? "✦" : "•";

        star.style.left =
            `${50 + x * 2.4}%`;

        star.style.top =
            `${48 - y * 2.1}%`;

        star.style.animationDelay =
            `${-(i * .11)}s`;

        heartSky.appendChild(star);
    }
}


function showFinale() {
    if (!finaleSection) return;

    document
        .querySelector(".finale-page-transition")
        ?.remove();

    const transition =
        document.createElement("div");

    transition.className =
        "finale-page-transition";

    transition.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.appendChild(transition);

    // Reveal the finale while the starlight covers the screen
    setTimeout(() => {
        if (giftSection) {
            giftSection.style.display = "none";
        }

        finaleSection.style.display = "block";

        requestAnimationFrame(() => {
            finaleSection.classList.add(
                "is-visible"
            );
        });
    }, 860);

    setTimeout(() => {
        transition.remove();
    }, 1900);
}

// =====================================
// ANIMATION LOOP
// =====================================

let lastFrameTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const delta = Math.min((now - lastFrameTime) * 0.001, 0.1);
    lastFrameTime = now;
    const t = now * 0.001;

    smoothPointerX += (targetPointerX - smoothPointerX) * 0.025;
    smoothPointerY += (targetPointerY - smoothPointerY) * 0.025;

    if (stars && stars.userData && stars.userData.update) {
        stars.userData.update(t, delta);
    }

    if (nebula) {
        nebula.rotation.z += 0.00003;
        nebula.position.x = Math.sin(t * 0.12) * 0.35 + smoothPointerX * 2.8;
        nebula.position.y = Math.cos(t * 0.1) * 0.2 - smoothPointerY * 1.8;
    }

    if (nebulaAura) {
        nebulaAura.rotation.z -= 0.00002;
        nebulaAura.position.x = 15 + Math.sin(t * 0.08) * 0.4 + smoothPointerX * 2.0;
        nebulaAura.position.y = -10 + Math.cos(t * 0.07) * 0.25 - smoothPointerY * 1.4;
    }

    if (milkyway) {
        milkyway.rotation.z -= 0.000008;
        milkyway.position.y = 3 + Math.cos(t * 0.05) * 0.25 - smoothPointerY * 1.5;
        milkyway.position.x = smoothPointerX * 2.2;
    }

    // Original cake animation
    animateCake();

    renderer.render(scene, camera);
}

animate();
