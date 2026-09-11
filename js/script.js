/* ==========================================================================
   MUHAMMAD TALHA KHAN — PORTFOLIO
   All interaction logic. Organized top to bottom by feature.
   ========================================================================== */

(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer  = window.matchMedia("(pointer: fine)").matches;

    /* ----------------------------------------------------------------
       -1. THEME TOGGLE (light / dark)
       The <head> inline script already applies the saved theme before
       first paint to avoid a flash; this section just wires up the
       toggle button and keeps localStorage in sync.
    ---------------------------------------------------------------- */

    const themeToggle = document.querySelector("#themeToggle");

    function currentTheme() {
        return document.documentElement.getAttribute("data-theme") === "light"
            ? "light"
            : "dark";
    }

    function setTheme(theme) {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        try {
            localStorage.setItem("mtk-theme", theme);
        } catch (e) {
            /* ignore */
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-pressed",
                theme === "light" ? "true" : "false"
            );
        }
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-pressed",
            currentTheme() === "light" ? "true" : "false"
        );

        themeToggle.addEventListener("click", () => {
            setTheme(
                currentTheme() === "light"
                    ? "dark"
                    : "light"
            );
        });
    }

    /* ----------------------------------------------------------------
       0. PAGE ENTER / PRELOADER
    ---------------------------------------------------------------- */

    document.documentElement.classList.remove("is-leaving");

    function boot() {
        document.documentElement.classList.add("is-ready");

        const preloader = document.querySelector(".preloader");

        if (preloader) {
            let seenBefore = false;

            try {
                seenBefore = sessionStorage.getItem("mtk-visited");
            } catch (e) {
                /* ignore */
            }

            const delay = seenBefore ? 250 : 1150;

            window.setTimeout(() => {
                preloader.classList.add("is-hidden");
            }, reduceMotion ? 0 : delay);

            try {
                sessionStorage.setItem("mtk-visited", "1");
            } catch (e) {
                /* ignore */
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            boot
        );
    } else {
        boot();
    }

    /* ----------------------------------------------------------------
       1. PAGE TRANSITIONS
    ---------------------------------------------------------------- */

    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        if (
            !link ||
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            link.hasAttribute("download")
        ) {
            return;
        }

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.target === "_blank" ||
            link.hasAttribute("data-no-transition")
        ) {
            return;
        }

        const isExternal =
            /^https?:\/\//i.test(href) &&
            !href.includes(window.location.hostname);

        if (isExternal) {
            return;
        }

        e.preventDefault();

        document.documentElement.classList.add(
            "is-leaving"
        );

        window.setTimeout(() => {
            window.location.href = href;
        }, reduceMotion ? 0 : 260);
    });

    /* ----------------------------------------------------------------
       2. NAVBAR
    ---------------------------------------------------------------- */

    const header = document.querySelector("header");
    const navLinks = document.querySelector(".nav-links");
    const hamburger = document.querySelector(".hamburger");
    const scrim = document.querySelector(".nav-scrim");

    function onScroll() {
        if (!header) {
            return;
        }

        header.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );

        const backToTop =
            document.querySelector(".back-to-top");

        if (backToTop) {
            backToTop.classList.toggle(
                "is-visible",
                window.scrollY > 500
            );
        }
    }

    window.addEventListener(
        "scroll",
        onScroll,
        { passive: true }
    );

    onScroll();

    function closeMenu() {
        if (navLinks) {
            navLinks.classList.remove("is-open");
        }

        if (hamburger) {
            hamburger.classList.remove("is-open");
        }

        if (scrim) {
            scrim.classList.remove("is-open");
        }

        document.body.style.overflow = "";
    }

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            const open =
                navLinks.classList.toggle("is-open");

            hamburger.classList.toggle(
                "is-open",
                open
            );

            if (scrim) {
                scrim.classList.toggle(
                    "is-open",
                    open
                );
            }

            document.body.style.overflow =
                open ? "hidden" : "";
        });
    }

    if (scrim) {
        scrim.addEventListener(
            "click",
            closeMenu
        );
    }

    if (navLinks) {
        navLinks
            .querySelectorAll("a")
            .forEach((a) => {
                a.addEventListener(
                    "click",
                    closeMenu
                );
            });
    }

    /* ----------------------------------------------------------------
       3. BACK TO TOP
    ---------------------------------------------------------------- */

    const backToTop =
        document.querySelector(".back-to-top");

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion
                    ? "auto"
                    : "smooth"
            });
        });
    }

    /* ----------------------------------------------------------------
       4. SCROLL REVEAL
    ---------------------------------------------------------------- */

    const revealEls =
        document.querySelectorAll("[data-reveal]");

    if (revealEls.length) {
        if ("IntersectionObserver" in window) {

            const io =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach((entry) => {

                            if (entry.isIntersecting) {

                                const delay =
                                    entry.target.getAttribute(
                                        "data-reveal-delay"
                                    );

                                if (delay) {
                                    entry.target.style.transitionDelay =
                                        delay + "ms";
                                }

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                io.unobserve(
                                    entry.target
                                );
                            }
                        });

                    },
                    {
                        threshold: 0.14,
                        rootMargin:
                            "0px 0px -40px 0px"
                    }
                );

            revealEls.forEach((el) =>
                io.observe(el)
            );

        } else {

            revealEls.forEach((el) =>
                el.classList.add("is-visible")
            );
        }
    }

    /* ----------------------------------------------------------------
       5. ANIMATED COUNTERS
    ---------------------------------------------------------------- */

    function animateCounter(el) {

        const target =
            parseFloat(
                el.getAttribute("data-counter")
            );

        const suffix =
            el.getAttribute("data-suffix") || "";

        if (
            reduceMotion ||
            isNaN(target)
        ) {
            el.textContent =
                target + suffix;

            return;
        }

        const duration = 1200;
        const start = performance.now();

        function tick(now) {

            const p =
                Math.min(
                    1,
                    (now - start) / duration
                );

            const eased =
                1 - Math.pow(1 - p, 3);

            el.textContent =
                Math.round(
                    eased * target
                ) + suffix;

            if (p < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    const counterEls =
        document.querySelectorAll(
            "[data-counter]"
        );

    if (
        counterEls.length &&
        "IntersectionObserver" in window
    ) {

        const cIo =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            animateCounter(
                                entry.target
                            );

                            cIo.unobserve(
                                entry.target
                            );
                        }
                    });

                },
                {
                    threshold: 0.5
                }
            );

        counterEls.forEach((el) =>
            cIo.observe(el)
        );
    }

    /* ----------------------------------------------------------------
       6. SKILL PROGRESS BARS
    ---------------------------------------------------------------- */

    const bars =
        document.querySelectorAll(
            ".progress-bar[data-width]"
        );

    if (
        bars.length &&
        "IntersectionObserver" in window
    ) {

        const bIo =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            const el =
                                entry.target;

                            window.requestAnimationFrame(
                                () => {
                                    el.style.width =
                                        el.getAttribute(
                                            "data-width"
                                        ) + "%";
                                }
                            );

                            bIo.unobserve(el);
                        }
                    });

                },
                {
                    threshold: 0.4
                }
            );

        bars.forEach((el) =>
            bIo.observe(el)
        );

    } else {

        bars.forEach((el) => {
            el.style.width =
                el.getAttribute(
                    "data-width"
                ) + "%";
        });
    }

    /* ----------------------------------------------------------------
       7. HERO TYPING EFFECT
    ---------------------------------------------------------------- */

    const typedEyebrow =
        document.querySelector(
            "[data-typed-eyebrow]"
        );

    if (typedEyebrow) {

        const text =
            typedEyebrow.getAttribute(
                "data-typed-eyebrow"
            );

        if (reduceMotion) {

            typedEyebrow.textContent =
                text;

        } else {

            let i = 0;

            typedEyebrow.textContent = "";

            (function typeChar() {

                if (i <= text.length) {

                    typedEyebrow.textContent =
                        text.slice(0, i);

                    i++;

                    setTimeout(
                        typeChar,
                        38
                    );
                }

            })();
        }
    }

    const roleEl =
        document.querySelector(
            "[data-role-rotator]"
        );

    if (roleEl) {

        let roles = [];

        try {
            roles =
                JSON.parse(
                    roleEl.getAttribute(
                        "data-role-rotator"
                    )
                );
        } catch (e) {
            roles = [];
        }

        if (roles.length) {

            if (reduceMotion) {

                roleEl.textContent =
                    roles[0];

            } else {

                let roleIdx = 0;
                let charIdx = 0;
                let deleting = false;

                function step() {

                    const current =
                        roles[roleIdx];

                    if (!deleting) {

                        charIdx++;

                        roleEl.textContent =
                            current.slice(
                                0,
                                charIdx
                            );

                        if (
                            charIdx ===
                            current.length
                        ) {

                            deleting = true;

                            setTimeout(
                                step,
                                1500
                            );

                            return;
                        }

                    } else {

                        charIdx--;

                        roleEl.textContent =
                            current.slice(
                                0,
                                charIdx
                            );

                        if (charIdx === 0) {

                            deleting = false;

                            roleIdx =
                                (roleIdx + 1) %
                                roles.length;
                        }
                    }

                    setTimeout(
                        step,
                        deleting ? 35 : 65
                    );
                }

                step();
            }
        }
    }

    /* ----------------------------------------------------------------
       8. TILT CARDS
    ---------------------------------------------------------------- */

    if (
        finePointer &&
        !reduceMotion
    ) {

        document
            .querySelectorAll(".tilt")
            .forEach((card) => {

                let rect;

                card.addEventListener(
                    "mouseenter",
                    () => {
                        rect =
                            card.getBoundingClientRect();
                    }
                );

                card.addEventListener(
                    "mousemove",
                    (e) => {

                        if (!rect) {
                            rect =
                                card.getBoundingClientRect();
                        }

                        const px =
                            (
                                e.clientX -
                                rect.left
                            ) /
                            rect.width -
                            0.5;

                        const py =
                            (
                                e.clientY -
                                rect.top
                            ) /
                            rect.height -
                            0.5;

                        card.style.transform =
                            `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
                    }
                );

                card.addEventListener(
                    "mouseleave",
                    () => {
                        card.style.transform = "";
                    }
                );
            });
    }

    /* ----------------------------------------------------------------
       9. MAGNETIC BUTTONS
    ---------------------------------------------------------------- */

    if (
        finePointer &&
        !reduceMotion
    ) {

        document
            .querySelectorAll(".magnetic")
            .forEach((btn) => {

                btn.addEventListener(
                    "mousemove",
                    (e) => {

                        const rect =
                            btn.getBoundingClientRect();

                        const x =
                            e.clientX -
                            rect.left -
                            rect.width / 2;

                        const y =
                            e.clientY -
                            rect.top -
                            rect.height / 2;

                        btn.style.transform =
                            `translate(${x * 0.18}px, ${y * 0.35}px)`;
                    }
                );

                btn.addEventListener(
                    "mouseleave",
                    () => {
                        btn.style.transform = "";
                    }
                );
            });
    }

    /* ----------------------------------------------------------------
       10. CUSTOM CURSOR
    ---------------------------------------------------------------- */

    if (
        finePointer &&
        !reduceMotion
    ) {

        const dot =
            document.createElement("div");

        const ring =
            document.createElement("div");

        dot.className = "cursor-dot";
        ring.className = "cursor-ring";

        document.body.append(
            dot,
            ring
        );

        let mx =
            window.innerWidth / 2;

        let my =
            window.innerHeight / 2;

        let rx = mx;
        let ry = my;

        window.addEventListener(
            "mousemove",
            (e) => {

                mx = e.clientX;
                my = e.clientY;

                dot.style.transform =
                    `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
            }
        );

        (function loop() {

            rx +=
                (mx - rx) * 0.16;

            ry +=
                (my - ry) * 0.16;

            ring.style.transform =
                `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;

            requestAnimationFrame(loop);

        })();

        document
            .querySelectorAll(
                "a, button, .tilt, input, textarea, .filter-btn"
            )
            .forEach((el) => {

                el.addEventListener(
                    "mouseenter",
                    () =>
                        ring.classList.add(
                            "is-hover"
                        )
                );

                el.addEventListener(
                    "mouseleave",
                    () =>
                        ring.classList.remove(
                            "is-hover"
                        )
                );
            });
    }

    /* ----------------------------------------------------------------
       11. EXPERIENCE FILTER TABS
    ---------------------------------------------------------------- */

    const filterBtns =
        document.querySelectorAll(
            ".filter-btn"
        );

    if (filterBtns.length) {

        const cards =
            document.querySelectorAll(
                ".experience-card"
            );

        filterBtns.forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {

                    filterBtns.forEach((b) =>
                        b.classList.remove(
                            "active"
                        )
                    );

                    btn.classList.add(
                        "active"
                    );

                    const filter =
                        btn.getAttribute(
                            "data-filter"
                        );

                    cards.forEach((card) => {

                        const match =
                            filter === "all" ||
                            card.getAttribute(
                                "data-category"
                            ) === filter;

                        card.classList.toggle(
                            "is-hidden",
                            !match
                        );
                    });
                }
            );
        });
    }

    /* ----------------------------------------------------------------
       12. CONTACT FORM
    ---------------------------------------------------------------- */

    const contactForm =
        document.querySelector(
            "#contactForm"
        );

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (e) => {

                e.preventDefault();

                const name =
                    contactForm
                        .querySelector("#cName")
                        .value
                        .trim();

                const email =
                    contactForm
                        .querySelector("#cEmail")
                        .value
                        .trim();

                const message =
                    contactForm
                        .querySelector("#cMessage")
                        .value
                        .trim();

                const subject =
                    encodeURIComponent(
                        `Portfolio message from ${name}`
                    );

                const body =
                    encodeURIComponent(
                        `${message}\n\n— ${name} (${email})`
                    );

                window.location.href =
                    `mailto:talhakhan333000@gmail.com?subject=${subject}&body=${body}`;

                const success =
                    document.querySelector(
                        ".form-success"
                    );

                if (success) {
                    success.classList.add(
                        "is-visible"
                    );
                }
            }
        );
    }

    /* ----------------------------------------------------------------
       13. NETWORK CANVAS
    ---------------------------------------------------------------- */

    const canvas =
        document.querySelector(
            "#networkCanvas"
        );

    if (
        canvas &&
        !reduceMotion
    ) {

        const ctx =
            canvas.getContext("2d");

        let w;
        let h;
        let nodes = [];

        const NODE_COUNT_BASE = 60;

        let pointer = {
            x: null,
            y: null
        };

        function resize() {

            const parent =
                canvas.parentElement;

            w =
                canvas.width =
                    parent.offsetWidth;

            h =
                canvas.height =
                    parent.offsetHeight;
        }

        function initNodes() {

            const count =
                Math.min(
                    NODE_COUNT_BASE,
                    Math.floor(
                        (w * h) /
                        16000
                    )
                );

            nodes =
                Array.from(
                    { length: count },
                    () => ({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        vx: (Math.random() - 0.5) * 0.35,
                        vy: (Math.random() - 0.5) * 0.35,
                        r: Math.random() * 1.6 + 0.6
                    })
                );
        }

        resize();
        initNodes();

        window.addEventListener(
            "resize",
            () => {
                resize();
                initNodes();
            }
        );

        canvas.parentElement.addEventListener(
            "mousemove",
            (e) => {

                const rect =
                    canvas.getBoundingClientRect();

                pointer.x =
                    e.clientX -
                    rect.left;

                pointer.y =
                    e.clientY -
                    rect.top;
            }
        );

        canvas.parentElement.addEventListener(
            "mouseleave",
            () => {
                pointer.x = null;
                pointer.y = null;
            }
        );

        const primary =
            "111,100,245";

        const accent =
            "242,161,84";

        const linkDist =
            150;

        function draw() {

            ctx.clearRect(
                0,
                0,
                w,
                h
            );

            nodes.forEach((n) => {

                n.x += n.vx;
                n.y += n.vy;

                if (
                    n.x < 0 ||
                    n.x > w
                ) {
                    n.vx *= -1;
                }

                if (
                    n.y < 0 ||
                    n.y > h
                ) {
                    n.vy *= -1;
                }
            });

            for (
                let i = 0;
                i < nodes.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < nodes.length;
                    j++
                ) {

                    const a =
                        nodes[i];

                    const b =
                        nodes[j];

                    const dx =
                        a.x - b.x;

                    const dy =
                        a.y - b.y;

                    const dist =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                    if (
                        dist <
                        linkDist
                    ) {

                        ctx.strokeStyle =
                            `rgba(${primary},${(1 - dist / linkDist) * 0.35})`;

                        ctx.lineWidth = 1;

                        ctx.beginPath();

                        ctx.moveTo(
                            a.x,
                            a.y
                        );

                        ctx.lineTo(
                            b.x,
                            b.y
                        );

                        ctx.stroke();
                    }
                }

                if (
                    pointer.x !== null
                ) {

                    const dx =
                        nodes[i].x -
                        pointer.x;

                    const dy =
                        nodes[i].y -
                        pointer.y;

                    const dist =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                    if (
                        dist <
                        linkDist * 1.3
                    ) {

                        ctx.strokeStyle =
                            `rgba(${accent},${(1 - dist / (linkDist * 1.3)) * 0.5})`;

                        ctx.lineWidth = 1;

                        ctx.beginPath();

                        ctx.moveTo(
                            nodes[i].x,
                            nodes[i].y
                        );

                        ctx.lineTo(
                            pointer.x,
                            pointer.y
                        );

                        ctx.stroke();
                    }
                }
            }

            nodes.forEach((n) => {

                ctx.fillStyle =
                    `rgba(${primary},0.8)`;

                ctx.beginPath();

                ctx.arc(
                    n.x,
                    n.y,
                    n.r,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            });

            requestAnimationFrame(
                draw
            );
        }

        draw();
    }

    /* ----------------------------------------------------------------
       14. SITE SEARCH
    ---------------------------------------------------------------- */

    const SEARCH_INDEX = [

        {
            page: "index.html",
            id: "home-hero",
            title: "Home — Introduction",
            text: "Muhammad Talha Khan Computer Science student at SZABIST Islamabad building at the intersection of software engineering artificial intelligence and networking hands-on experience ML models systems projects enterprise network operations"
        },

        {
            page: "index.html",
            id: "about-details",
            title: "Personal Details",
            text: "Name Muhammad Talha Khan City Islamabad University SZABIST Islamabad Degree BS Computer Science Semester 7th Semester Expected Graduation 2027"
        },

        {
            page: "index.html",
            id: "about-objective",
            title: "Career Objective",
            text: "Software Engineer specializing in Artificial Intelligence Machine Learning innovative software solutions real-world problems MachineLearning SoftwareEngineering Networking WebDevelopment"
        },

        {
            page: "index.html",
            id: "highlights",
            title: "Featured Work",
            text: "DevPulse GitHub Developer Dashboard Network Administration Intern Ministry of Foreign Affairs Cisco Stock Price Prediction Linear Regression Decision Tree XGBoost 99.5% R2 score QuizVerse Python PySide6 SQLite Windows trivia game"
        },

        {
            page: "index.html",
            id: "site-footer",
            title: "Footer — Contact & Social",
            text: "Copyright 2026 Muhammad Talha Khan Email talhakhan333000@gmail.com LinkedIn"
        },

        {
            page: "experience.html",
            id: "exp-devpulse",
            title: "DevPulse — GitHub Developer Dashboard",
            text: "HTML CSS JavaScript GitHub REST API public profiles repository statistics language distribution caching themes"
        },

        {
            page: "experience.html",
            id: "exp-network-intern",
            title: "Network Administration Intern",
            text: "Ministry of Foreign Affairs MOFA internship network monitoring troubleshooting Cisco networking devices network security IT operations"
        },

        {
            page: "experience.html",
            id: "exp-stock-prediction",
            title: "Stock Price Prediction — ML Project",
            text: "Predictive models Python Linear Regression Decision Tree XGBoost R2 score 99.5% Machine Learning"
        },

        {
            page: "experience.html",
            id: "exp-quizverse",
            title: "QuizVerse — Windows Trivia Quiz Game",
            text: "QuizVerse Python PySide6 SQLite Windows desktop trivia game timed quizzes scoring streaks player profiles achievements leaderboard answer review question manager Pytest GitHub Actions PyInstaller"
        },

        {
            page: "experience.html",
            id: "exp-portfolio-website",
            title: "Personal Portfolio Website",
            text: "Responsive multi-page website HTML CSS JavaScript animation interaction systems on-site keyword search accessible professional UI design"
        },

        {
            page: "experience.html",
            id: "exp-study-group",
            title: "Programming Study Group Leader",
            text: "OOP study sessions classmates exams communication leadership skills academic leadership"
        },

        {
            page: "skills.html",
            id: "skills-programming",
            title: "Programming Languages",
            text: "C C++ Python Java JavaScript"
        },

        {
            page: "skills.html",
            id: "skills-webdev",
            title: "Web Development",
            text: "HTML5 CSS3 JavaScript Responsive Design Multi-Page Websites"
        },

        {
            page: "skills.html",
            id: "skills-ai",
            title: "AI & Data Science",
            text: "Machine Learning Linear Regression Decision Trees XGBoost Data Analysis Matplotlib Tableau"
        },

        {
            page: "skills.html",
            id: "skills-database",
            title: "Database",
            text: "SQL Database Design Normalization MySQL SQLite"
        },

        {
            page: "skills.html",
            id: "skills-networking",
            title: "Networking & Development Tools",
            text: "Cisco Packet Tracer Wireshark Git GitHub Visual Studio Code Pytest GitHub Actions PyInstaller Microsoft Office"
        },

        {
            page: "skills.html",
            id: "skills-desktop",
            title: "Desktop Development",
            text: "Python PySide6 Qt SQLite PyInstaller Windows desktop application development"
        },

        {
            page: "skills.html",
            id: "skills-soft",
            title: "Soft Skills",
            text: "Leadership Problem Solving Communication Presentation Skills Research Teamwork Time Management"
        },

        {
            page: "education.html",
            id: "edu-bs",
            title: "BS Computer Science — SZABIST",
            text: "Bachelor of Science Computer Science Shaheed Zulfikar Ali Bhutto Institute of Science and Technology Islamabad Pakistan 2023 2027 7th Semester Object-Oriented Programming Data Structures Algorithms Database Systems Web Engineering Artificial Intelligence Software Engineering"
        },

        {
            page: "education.html",
            id: "edu-ics",
            title: "Intermediate in Computer Science (ICS)",
            text: "Islamabad Model College for Boys Completed 2022 Computer Science Mathematics Physics Programming Fundamentals"
        },

        {
            page: "education.html",
            id: "edu-matric",
            title: "Matriculation",
            text: "Islamabad Model College for Boys Completed 2020 Computer Science"
        },

        {
            page: "contact.html",
            id: "contact-info",
            title: "Contact Information",
            text: "Name Muhammad Talha Khan Email talhakhan333000@gmail.com GitHub TalhaBytes Location Islamabad Pakistan LinkedIn"
        },

        {
            page: "contact.html",
            id: "contact-form",
            title: "Send a Message Form",
            text: "Contact form Name Email Message Send Message"
        }
    ];

    const PAGE_LABELS = {
        "index.html": "Home",
        "experience.html": "Experience",
        "skills.html": "Skills",
        "education.html": "Education",
        "contact.html": "Contact"
    };

    const searchToggle =
        document.querySelector(
            "#searchToggle"
        );

    const searchOverlay =
        document.querySelector(
            "#searchOverlay"
        );

    const searchInput =
        document.querySelector(
            "#searchInput"
        );

    const searchClose =
        document.querySelector(
            "#searchClose"
        );

    const searchResults =
        document.querySelector(
            "#searchResults"
        );

    function escapeHtml(str) {

        return str.replace(
            /[&<>"']/g,
            (c) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c])
        );
    }

    function highlightWords(
        text,
        words
    ) {

        let safe =
            escapeHtml(text);

        words.forEach((w) => {

            if (!w) {
                return;
            }

            const re =
                new RegExp(
                    "(" +
                    w.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    ) +
                    ")",
                    "gi"
                );

            safe =
                safe.replace(
                    re,
                    "<mark>$1</mark>"
                );
        });

        return safe;
    }

    function snippetAround(
        text,
        word
    ) {

        const lower =
            text.toLowerCase();

        const idx =
            lower.indexOf(
                word.toLowerCase()
            );

        if (idx === -1) {

            return (
                text.slice(0, 110) +
                (
                    text.length > 110
                        ? "…"
                        : ""
                )
            );
        }

        const start =
            Math.max(
                0,
                idx - 45
            );

        const end =
            Math.min(
                text.length,
                idx +
                word.length +
                65
            );

        return (
            (
                start > 0
                    ? "…"
                    : ""
            ) +
            text.slice(
                start,
                end
            ) +
            (
                end < text.length
                    ? "…"
                    : ""
            )
        );
    }

    function runSearch(query) {

        if (!searchResults) {
            return;
        }

        const q =
            query.trim();

        if (!q) {

            searchResults.innerHTML =
                '<p class="search-hint">Try “Python”, “QuizVerse”, “XGBoost”, or “SZABIST”.</p>';

            return;
        }

        const words =
            q
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean);

        const matches =
            SEARCH_INDEX
                .map((entry) => {

                    const haystack =
                        (
                            entry.title +
                            " " +
                            entry.text
                        ).toLowerCase();

                    const allWordsMatch =
                        words.every(
                            (w) =>
                                haystack.includes(w)
                        );

                    if (!allWordsMatch) {
                        return null;
                    }

                    const titleHit =
                        words.some(
                            (w) =>
                                entry.title
                                    .toLowerCase()
                                    .includes(w)
                        );

                    return {
                        entry,
                        titleHit
                    };
                })
                .filter(Boolean)
                .sort(
                    (a, b) =>
                        b.titleHit === a.titleHit
                            ? 0
                            : b.titleHit
                                ? 1
                                : -1
                )
                .slice(0, 8);

        if (!matches.length) {

            searchResults.innerHTML =
                '<div class="search-empty"><i class="fa-solid fa-magnifying-glass-minus"></i>No results found for “' +
                escapeHtml(q) +
                '”.</div>';

            return;
        }

        searchResults.innerHTML =
            matches
                .map(({ entry }) => {

                    const snippetSource =
                        snippetAround(
                            entry.text,
                            words[0]
                        );

                    return (
                        '<a class="search-result" href="' +
                        entry.page +
                        "#" +
                        entry.id +
                        '" data-search-id="' +
                        entry.id +
                        '">' +
                        '<span class="sr-page">' +
                        (
                            PAGE_LABELS[
                                entry.page
                            ] ||
                            entry.page
                        ) +
                        "</span>" +
                        '<div class="sr-title">' +
                        highlightWords(
                            entry.title,
                            words
                        ) +
                        "</div>" +
                        '<div class="sr-snippet">' +
                        highlightWords(
                            snippetSource,
                            words
                        ) +
                        "</div>" +
                        "</a>"
                    );
                })
                .join("");
    }

    function openSearch() {

        if (!searchOverlay) {
            return;
        }

        searchOverlay.classList.add(
            "is-open"
        );

        document.body.style.overflow =
            "hidden";

        runSearch("");

        window.setTimeout(
            () => {
                if (searchInput) {
                    searchInput.focus();
                }
            },
            60
        );
    }

    function closeSearch() {

        if (!searchOverlay) {
            return;
        }

        searchOverlay.classList.remove(
            "is-open"
        );

        document.body.style.overflow = "";

        if (searchInput) {
            searchInput.value = "";
        }
    }

    if (searchToggle) {
        searchToggle.addEventListener(
            "click",
            openSearch
        );
    }

    if (searchClose) {
        searchClose.addEventListener(
            "click",
            closeSearch
        );
    }

    if (searchOverlay) {

        searchOverlay.addEventListener(
            "click",
            (e) => {

                if (
                    e.target ===
                    searchOverlay
                ) {
                    closeSearch();
                }
            }
        );
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            (e) =>
                runSearch(
                    e.target.value
                )
        );
    }

    if (searchResults) {

        searchResults.addEventListener(
            "click",
            (e) => {

                const link =
                    e.target.closest(
                        "a.search-result"
                    );

                if (
                    !link ||
                    e.defaultPrevented ||
                    e.button !== 0 ||
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.altKey ||
                    link.hasAttribute(
                        "download"
                    )
                ) {
                    return;
                }

                sessionStorage.setItem(
                    "mtk-search-target",
                    link.getAttribute(
                        "data-search-id"
                    )
                );
            }
        );
    }

    document.addEventListener(
        "keydown",
        (e) => {

            const tag =
                (
                    e.target.tagName ||
                    ""
                ).toLowerCase();

            const typing =
                tag === "input" ||
                tag === "textarea";

            if (
                e.key === "/" &&
                !typing
            ) {

                e.preventDefault();
                openSearch();

            } else if (
                e.key === "Escape" &&
                searchOverlay &&
                searchOverlay.classList.contains(
                    "is-open"
                )
            ) {

                closeSearch();
            }
        }
    );

    /* ----------------------------------------------------------------
       Highlight a section selected from search.
    ---------------------------------------------------------------- */

    (function highlightSearchTarget() {

        const targetId =
            sessionStorage.getItem(
                "mtk-search-target"
            );

        if (!targetId) {
            return;
        }

        sessionStorage.removeItem(
            "mtk-search-target"
        );

        const el =
            document.getElementById(
                targetId
            );

        if (!el) {
            return;
        }

        window.setTimeout(
            () => {

                el.scrollIntoView({
                    behavior:
                        reduceMotion
                            ? "auto"
                            : "smooth",
                    block: "center"
                });

                el.classList.add(
                    "search-hit"
                );

                window.setTimeout(
                    () =>
                        el.classList.remove(
                            "search-hit"
                        ),
                    2400
                );
            },
            reduceMotion ? 50 : 500
        );
    })();

})();