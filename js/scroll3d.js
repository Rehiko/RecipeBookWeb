import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

gsap.registerPlugin(ScrollTrigger);

// =========================
// INTRO
// =========================
const intro = document.getElementById("intro");
const introOverlay = document.querySelector(".intro-overlay");
const introTitle = document.querySelector(".intro-title");
const introSub = document.querySelector(".intro-sub");
const pageContent = document.getElementById("pageContent");
const heroText = document.querySelector(".hero-text");

const introTl = gsap.timeline({
  defaults: { ease: "power3.out" },
  onComplete: () => {
    if (intro) intro.style.pointerEvents = "none";
  }
});

introTl
  .to(introOverlay, {
    opacity: 0.35,
    duration: 1.6
  }, 0)
  .to(introSub, {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, 0.45)
  .to(introTitle, {
    opacity: 1,
    y: 0,
    duration: 1
  }, 0.65)
  .to({}, { duration: 0.45 })
  .to(introSub, {
    opacity: 0,
    y: -10,
    duration: 0.45
  }, "+=0.05")
  .to(intro, {
    opacity: 0,
    duration: 0.9,
    onStart: () => {
      gsap.to(pageContent, {
        opacity: 1,
        duration: 0.9,
        ease: "power2.out"
      });

      gsap.to(heroText, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.15,
        ease: "power3.out"
      });
    },
    onComplete: () => {
      if (intro) intro.style.display = "none";
      ScrollTrigger.refresh();
    }
  }, "-=0.05");

// =========================
// REVEAL ON SCROLL
// =========================
gsap.utils.toArray(".reveal").forEach((item) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: item,
      start: "top 84%",
      once: true
    }
  });
});

// =========================
// THREE.JS
// =========================
const section = document.getElementById("scroll3d");
const canvas = document.getElementById("c3d");

if (section && canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6.3);

  const ambient = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambient);

  const dir1 = new THREE.DirectionalLight(0xfff2df, 1.3);
  dir1.position.set(4, 6, 5);
  scene.add(dir1);

  const dir2 = new THREE.DirectionalLight(0xc95050, 0.5);
  dir2.position.set(-4, 2, 3);
  scene.add(dir2);

  // book-like block instead of dark cube
  const geometry = new THREE.BoxGeometry(2.2, 3, 0.55);
  const materials = [
    new THREE.MeshStandardMaterial({ color: "#b33535", roughness: 0.75 }),
    new THREE.MeshStandardMaterial({ color: "#b33535", roughness: 0.75 }),
    new THREE.MeshStandardMaterial({ color: "#efe2cf", roughness: 0.82 }),
    new THREE.MeshStandardMaterial({ color: "#d6c2aa", roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: "#efe2cf", roughness: 0.78 }),
    new THREE.MeshStandardMaterial({ color: "#efe2cf", roughness: 0.78 })
  ];

  const book = new THREE.Mesh(geometry, materials);
  scene.add(book);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  function tick() {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  gsap.to(book.rotation, {
    y: Math.PI * 2.2,
    x: Math.PI * 0.16,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });

  gsap.to(book.position, {
    y: -0.35,
    z: -0.5,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });
}

// =========================
// RECIPE INTERACTION
// =========================
const recipeCards = document.querySelectorAll(".recipe-card");
const recipeTitle = document.getElementById("recipeTitle");
const recipeText = document.getElementById("recipeText");

const recipeData = [
  {
    title: "Jiaozi",
    text: "A family recipe shaped around the table. Folding dumplings becomes part of the memory, not just the preparation. This section can later expand into ingredients, story, and visuals."
  },
  {
    title: "Borscht",
    text: "A dish connected to warmth, routine, and home. In the website, this can become a recipe page with ingredients, steps, and a personal memory connected to family cooking."
  },
  {
    title: "Spring Rolls",
    text: "A recipe that adds movement, crisp texture, and a familiar shared-plate feeling. It can represent celebration, table rituals, and food passed between people."
  },
  {
    title: "Varenyky",
    text: "A hand-shaped comfort food where making the recipe becomes a social act. This can be presented as both recipe instructions and a story about care, repetition, and tradition."
  }
];

recipeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const index = Number(card.dataset.recipe);

    recipeCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");

    if (recipeTitle && recipeText && recipeData[index]) {
      recipeTitle.textContent = recipeData[index].title;
      recipeText.textContent = recipeData[index].text;
    }
  });
});

// =========================
// MENU
// =========================
const menuOpen = document.getElementById("menuOpen");
const menuPanel = document.getElementById("menuPanel");
const menuClose = document.getElementById("menuClose");

if (menuOpen && menuPanel) {
  menuOpen.addEventListener("click", () => {
    menuPanel.classList.add("active");
  });
}

if (menuClose && menuPanel) {
  menuClose.addEventListener("click", () => {
    menuPanel.classList.remove("active");
  });
}

document.addEventListener("click", (e) => {
  if (
    menuPanel &&
    menuOpen &&
    menuPanel.classList.contains("active") &&
    !menuPanel.contains(e.target) &&
    !menuOpen.contains(e.target)
  ) {
    menuPanel.classList.remove("active");
  }
});

// =========================
// SOUND
// =========================
const soundToggle = document.getElementById("soundToggle");
const soundToggleFloat = document.getElementById("soundToggleFloat");
const bgMusic = document.getElementById("bgMusic");

function updateSoundButtons(isPlaying) {
  if (soundToggle) {
    soundToggle.textContent = isPlaying ? "Sound On" : "Sound Off";
  }
  if (soundToggleFloat) {
    soundToggleFloat.textContent = isPlaying ? "Mute" : "Play";
  }
}

if (bgMusic) {
  bgMusic.volume = 0.35;

  window.addEventListener("load", async () => {
    try {
      await bgMusic.play();
      updateSoundButtons(true);
    } catch (error) {
      updateSoundButtons(false);
      console.log("Autoplay blocked:", error);
    }
  });
}

async function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      updateSoundButtons(true);
    } catch (error) {
      console.log("Audio blocked:", error);
    }
  } else {
    bgMusic.pause();
    updateSoundButtons(false);
  }
}

if (soundToggle) {
  soundToggle.addEventListener("click", toggleMusic);
}

if (soundToggleFloat) {
  soundToggleFloat.addEventListener("click", toggleMusic);
}


// =========================
// RECIPE UNIVERSE
// =========================
const cuisineSwitches = document.querySelectorAll(".cuisine-switch");
const recipeList = document.getElementById("recipeList");

const recipeStageCuisine = document.getElementById("recipeStageCuisine");
const recipeStageTitle = document.getElementById("recipeStageTitle");
const recipeStageDesc = document.getElementById("recipeStageDesc");
const recipeStageIngredients = document.getElementById("recipeStageIngredients");
const recipeStageFeeling = document.getElementById("recipeStageFeeling");
const recipeStageStory = document.getElementById("recipeStageStory");
const linkedDishBtn = document.getElementById("linkedDishBtn");

const recipeUniverseData = {
  ukrainian: [
    {
      id: "borscht",
      title: "Borscht",
      short: "A dish of warmth and home.",
      desc: "A layered recipe that feels slow, familiar, and deeply domestic.",
      ingredients: "Beetroot, cabbage, potato, carrot, onion, broth",
      feeling: "Comfort, ritual, evening warmth",
      story: "It feels like coming back home and hearing familiar voices before you even enter the kitchen.",
      linkedTo: "hotpot",
      linkedLabel: "Hot Pot"
    },
    {
      id: "pampushky",
      title: "Pampushky",
      short: "Garlic bread rolls filled with atmosphere.",
      desc: "Soft, fragrant, and often remembered before they are even seen.",
      ingredients: "Flour, yeast, garlic, oil, butter, herbs",
      feeling: "Anticipation, warmth, hunger, tenderness",
      story: "The smell reaches the whole house first. It feels like someone is waiting for you with care already prepared.",
      linkedTo: "springrolls",
      linkedLabel: "Spring Rolls"
    },
    {
      id: "varenyky",
      title: "Varenyky",
      short: "Shaped slowly, usually together.",
      desc: "A handmade dish where imperfection becomes part of the memory.",
      ingredients: "Flour, water, salt, potato / cheese / cherry filling",
      feeling: "Togetherness, patience, care",
      story: "You remember the hands around the table as much as the taste itself.",
      linkedTo: "jiaozi",
      linkedLabel: "Jiaozi"
    },
    {
      id: "holubtsi",
      title: "Holubtsi",
      short: "A recipe that asks for time and people.",
      desc: "Rolled slowly, often for shared meals and meaningful occasions.",
      ingredients: "Cabbage, rice, minced meat, onion, tomato sauce",
      feeling: "Patience, depth, family rhythm",
      story: "Some dishes are not difficult because of ingredients, but because they carry the shape of a family working together.",
      linkedTo: "baozi",
      linkedLabel: "Baozi"
    }
  ],
  chinese: [
    {
      id: "baozi",
      title: "Baozi",
      short: "Soft steamed buns made with calm hands.",
      desc: "A recipe about repetition, stillness, and the comfort of steam.",
      ingredients: "Flour, yeast, pork or vegetable filling, scallion, ginger",
      feeling: "Stillness, gentleness, closeness",
      story: "The dough, the steam, the folding — all of it teaches you to slow down and stay present.",
      linkedTo: "holubtsi",
      linkedLabel: "Holubtsi"
    },
    {
      id: "jiaozi",
      title: "Jiaozi",
      short: "Dumplings shaped together at the table.",
      desc: "A social recipe where the making is as important as the eating.",
      ingredients: "Flour, pork or chicken, cabbage, garlic, ginger, scallion",
      feeling: "Belonging, laughter, repetition",
      story: "One person rolls, one fills, one folds — and the memory lives in the rhythm of everyone together.",
      linkedTo: "varenyky",
      linkedLabel: "Varenyky"
    },
    {
      id: "springrolls",
      title: "Spring Rolls",
      short: "Crisp, lively, shared.",
      desc: "A recipe with movement, lightness, and quick happy energy.",
      ingredients: "Wrappers, vegetables, noodles, seasoning, oil",
      feeling: "Playfulness, motion, celebration",
      story: "You remember the laughter and quick hands almost more than the taste.",
      linkedTo: "pampushky",
      linkedLabel: "Pampushky"
    },
    {
      id: "hotpot",
      title: "Hot Pot",
      short: "Steam, voices, and a crowded table.",
      desc: "Not one perfect plate, but a whole living meal shared in real time.",
      ingredients: "Broth, sliced meat, vegetables, tofu, noodles, mushrooms",
      feeling: "Gathering, movement, noise, warmth",
      story: "It feels alive — steam rising, people reaching, voices overlapping, and that strong feeling of being exactly where you belong.",
      linkedTo: "borscht",
      linkedLabel: "Borscht"
    }
  ]
};

let currentCuisineUniverse = "ukrainian";
let currentRecipeUniverse = 0;

function updateRecipeStage(cuisineKey, recipeIndex) {
  const item = recipeUniverseData[cuisineKey][recipeIndex];
  if (!item) return;

  if (recipeStageCuisine) {
    recipeStageCuisine.textContent = cuisineKey === "ukrainian" ? "Ukrainian cuisine" : "Chinese cuisine";
  }
  if (recipeStageTitle) recipeStageTitle.textContent = item.title;
  if (recipeStageDesc) recipeStageDesc.textContent = item.desc;
  if (recipeStageIngredients) recipeStageIngredients.textContent = item.ingredients;
  if (recipeStageFeeling) recipeStageFeeling.textContent = item.feeling;
  if (recipeStageStory) recipeStageStory.textContent = item.story;

  if (linkedDishBtn) {
    linkedDishBtn.textContent = item.linkedLabel;
    linkedDishBtn.dataset.linkedId = item.linkedTo;
  }

  gsap.fromTo(
    ".recipe-stage-frame",
    { opacity: 0.65, y: 18 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
  );
}

function renderRecipeList(cuisineKey) {
  if (!recipeList) return;
  recipeList.innerHTML = "";

  recipeUniverseData[cuisineKey].forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `recipe-item ${index === 0 ? "active" : ""}`;
    btn.innerHTML = `
      <strong>${item.title}</strong>
      <span>${item.short}</span>
    `;

    btn.addEventListener("click", () => {
      currentRecipeUniverse = index;
      document.querySelectorAll(".recipe-item").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      updateRecipeStage(cuisineKey, index);
    });

    recipeList.appendChild(btn);
  });
}

cuisineSwitches.forEach((btn) => {
  btn.addEventListener("click", () => {
    cuisineSwitches.forEach(el => el.classList.remove("active"));
    btn.classList.add("active");

    currentCuisineUniverse = btn.dataset.cuisine;
    currentRecipeUniverse = 0;

    renderRecipeList(currentCuisineUniverse);
    updateRecipeStage(currentCuisineUniverse, currentRecipeUniverse);
  });
});

if (linkedDishBtn) {
  linkedDishBtn.addEventListener("click", () => {
    const targetId = linkedDishBtn.dataset.linkedId;
    if (!targetId) return;

    const otherCuisine = currentCuisineUniverse === "ukrainian" ? "chinese" : "ukrainian";
    const targetIndex = recipeUniverseData[otherCuisine].findIndex(item => item.id === targetId);

    if (targetIndex !== -1) {
      currentCuisineUniverse = otherCuisine;
      currentRecipeUniverse = targetIndex;

      cuisineSwitches.forEach(el => {
        el.classList.toggle("active", el.dataset.cuisine === otherCuisine);
      });

      renderRecipeList(otherCuisine);
      updateRecipeStage(otherCuisine, targetIndex);

      const listItems = document.querySelectorAll(".recipe-item");
      if (listItems[targetIndex]) {
        listItems[targetIndex].classList.add("active");
      }

      document.getElementById("recipeUniverse")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

renderRecipeList(currentCuisineUniverse);
updateRecipeStage(currentCuisineUniverse, currentRecipeUniverse);

// =========================
// STORY AUDIO FIX
// =========================
const storyBtn = document.getElementById("storyAudioBtn");
const storyAudioEl = document.getElementById("storyAudio");
const storyText = document.getElementById("storyAudioText");

if (storyBtn && storyAudioEl) {
  storyBtn.addEventListener("click", async () => {
    try {
      if (storyAudioEl.paused) {
        await storyAudioEl.play();
        storyBtn.classList.add("is-playing");
        if (storyText) storyText.textContent = "Pause story";
      } else {
        storyAudioEl.pause();
        storyBtn.classList.remove("is-playing");
        if (storyText) storyText.textContent = "Play story";
      }
    } catch (e) {
      console.log("Audio error:", e);
    }
  });

  // reset when audio ends
  storyAudioEl.addEventListener("ended", () => {
    storyBtn.classList.remove("is-playing");
    if (storyText) storyText.textContent = "Play story";
  });
}


// =========================
// DRAGON WITH SMART DIRECTION
// =========================
const dragon = document.getElementById("dragonGif");
const dragonSection = document.getElementById("interactiveRecipes");

if (dragon && dragonSection) {
  gsap.set(dragon, {
    x: -250,
    opacity: 0,
    scaleX: 1, // летить вправо
    rotation: 0
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: dragonSection,
      start: "top 50%",
      end: "bottom top",
      scrub: 1.2,
      onUpdate: (self) => {
        // direction: 1 = вниз, -1 = вгору
        if (self.direction === 1) {
          gsap.to(dragon, {
            scaleX: -1,
            duration: 0.25,
            ease: "power2.out"
          });
        } else {
          gsap.to(dragon, {
            scaleX: 1,
            duration: 0.25,
            ease: "power2.out"
          });
        }
      }
    }
  })
  .to(dragon, {
    opacity: 1,
    x: window.innerWidth * 0.25,
    ease: "none"
  })
  .to(dragon, {
    x: window.innerWidth * 0.55,
    ease: "none"
  })
  .to(dragon, {
    x: window.innerWidth * 0.85,
    ease: "none"
  })
  .to(dragon, {
    x: window.innerWidth + 250,
    opacity: 0,
    ease: "none"
  });
}
