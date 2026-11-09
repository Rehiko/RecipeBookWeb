import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

gsap.registerPlugin(ScrollTrigger);

/* =========================
   INTRO
========================= */
const intro = document.getElementById("intro");
const introOverlay = document.querySelector(".intro-overlay");
const introTitle = document.querySelector(".intro-title");
const introSub = document.querySelector(".intro-sub");
const pageContent = document.getElementById("pageContent");
const heroText = document.querySelector(".hero-text");

if (intro && introOverlay && introTitle && introSub && pageContent && heroText) {
  const introTl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      intro.style.pointerEvents = "none";
    }
  });

  introTl
    .to(introOverlay, { opacity: 0.35, duration: 1.6 }, 0)
    .to(introSub, { opacity: 1, y: 0, duration: 0.8 }, 0.45)
    .to(introTitle, { opacity: 1, y: 0, duration: 1 }, 0.65)
    .to({}, { duration: 0.45 })
    .to(introSub, { opacity: 0, y: -10, duration: 0.45 }, "+=0.05")
    .to(
      intro,
      {
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
          intro.style.display = "none";
          ScrollTrigger.refresh();
        }
      },
      "-=0.05"
    );
}

/* =========================
   REVEAL ON SCROLL
========================= */
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

/* =========================
   THREE.JS
========================= */
const section3D = document.getElementById("scroll3d");
const canvas = document.getElementById("c3d");
const ingredientOverlay = document.getElementById("ingredientOverlay");
const ingredientEls = document.querySelectorAll(".ingredient");

if (section3D && canvas) {
 try {
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
  camera.position.set(0, 0.2, 7.2);

  const ambient = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambient);

  const dir1 = new THREE.DirectionalLight(0xfff2df, 1.5);
  dir1.position.set(4, 6, 5);
  scene.add(dir1);

  const dir2 = new THREE.DirectionalLight(0xc95050, 0.55);
  dir2.position.set(-4, 2, 3);
  scene.add(dir2);

  /* POT GROUP */
  const potGroup = new THREE.Group();
  scene.add(potGroup);

  const potGeometry = new THREE.CylinderGeometry(1.3, 1.65, 1.5, 64, 1, true);
  const potMaterial = new THREE.MeshStandardMaterial({
    color: "#8f2f2f",
    roughness: 0.72,
    metalness: 0.06,
    side: THREE.DoubleSide
  });

  const pot = new THREE.Mesh(potGeometry, potMaterial);
  potGroup.add(pot);

  const bottomGeometry = new THREE.CircleGeometry(1.3, 64);
  const bottomMaterial = new THREE.MeshStandardMaterial({
    color: "#632020",
    roughness: 0.84
  });

  const potBottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  potBottom.rotation.x = -Math.PI / 2;
  potBottom.position.y = -0.75;
  potGroup.add(potBottom);

  const rimGeometry = new THREE.TorusGeometry(1.3, 0.05, 18, 80);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: "#d9b37a",
    roughness: 0.45,
    metalness: 0.15
  });

  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.75;
  potGroup.add(rim);

  /* INGREDIENTS */
  

  function resizeRenderer() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    potGroup.scale.setScalar(Math.min(1, w / h / 1.1));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeRenderer);
  resizeRenderer();

  function tick() {
    potGroup.rotation.y += 0.003;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();

  /* MAIN SCROLL ANIMATION */
  const potTl = gsap.timeline({
    scrollTrigger: {
      trigger: section3D,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2
    }
  });

  potTl
    .to(potGroup.rotation, {
      y: Math.PI * 1.4,
      x: Math.PI * 0.08,
      duration: 1
    })
    .to(potGroup.position, {
      y: -0.12,
      duration: 1
    }, 0)
    .to(camera.position, {
      z: 6,
      duration: 0.8
    }, 0.15)
    .to(camera.position, {
      z: 5.2,
      duration: 0.8
    }, 0.75);

/* INGREDIENT DROP */
ScrollTrigger.create({
  trigger: section3D,
  start: "top 35%",
  once: true,
  onEnter: () => {
    console.log("ingredient animation started", ingredientEls.length);

    gsap.set(ingredientEls, {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.9,
      rotation: 0
    });

    const tl = gsap.timeline();
    
    tl.to(".ingredient-1", {
      x: window.innerWidth * 0.42,
      y: window.innerHeight * 0.42,
      opacity: 1,
      rotation: 140,
      scale: 1,
      duration: 1.2,
      ease: "power2.inOut"
    }, 0);

    tl.to(".ingredient-2", {
      x: -window.innerWidth * 0.38,
      y: window.innerHeight * 0.38,
      opacity: 1,
      rotation: -130,
      scale: 1,
      duration: 1.2,
      ease: "power2.inOut"
    }, 0.08);

    tl.to(".ingredient-3", {
      x: window.innerWidth * 0.45,
      y: window.innerHeight * 0.18,
      opacity: 1,
      rotation: 110,
      scale: 1,
      duration: 1.25,
      ease: "power2.inOut"
    }, 0.16);

    tl.to(".ingredient-4", {
      x: -window.innerWidth * 0.42,
      y: window.innerHeight * 0.18,
      opacity: 1,
      rotation: -100,
      scale: 1,
      duration: 1.25,
      ease: "power2.inOut"
    }, 0.24);

    tl.to(".ingredient-5", {
      x: window.innerWidth * 0.44,
      y: -window.innerHeight * 0.10,
      opacity: 1,
      rotation: 150,
      scale: 1,
      duration: 1.15,
      ease: "power2.inOut"
    }, 0.32);

    tl.to(".ingredient-6", {
      x: -window.innerWidth * 0.40,
      y: -window.innerHeight * 0.14,
      opacity: 1,
      rotation: -150,
      scale: 1,
      duration: 1.15,
      ease: "power2.inOut"
    }, 0.40);

    tl.to(ingredientEls, {
      opacity: 0,
      scale: 0.2,
      duration: 0.35,
      stagger: 0.03,
      ease: "power2.out"
    }, 1.15);
  }
});
 } catch (error) {
   // Devices without WebGL must still support recipes, audio and navigation.
   canvas.hidden = true;
   section3D.classList.add('without-webgl');
   const fallback = document.createElement('img');
   fallback.src = 'images/borshchuk.png';
   fallback.alt = 'Illustrated bowl of borscht';
   fallback.className = 'object-fallback';
   canvas.after(fallback);
 }
}
/* =========================
   RECIPES PREVIEW SECTION
========================= */
const recipeCards = document.querySelectorAll(".recipe-card");
const previewRecipeTitle = document.getElementById("previewRecipeTitle");
const previewRecipeText = document.getElementById("previewRecipeText");

const previewRecipeData = [
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

    if (previewRecipeTitle && previewRecipeText && previewRecipeData[index]) {
      previewRecipeTitle.textContent = previewRecipeData[index].title;
      previewRecipeText.textContent = previewRecipeData[index].text;
    }
  });
});

/* =========================
   MENU
========================= */
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

document.querySelectorAll("#menuPanel a").forEach((link) => {
  link.addEventListener("click", () => {
    menuPanel.classList.remove("active");
  });
});

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

/* =========================
   SOUND
========================= */
const soundToggle = document.getElementById("soundToggle");
const soundToggleFloat = document.getElementById("soundToggleFloat");
const bgMusic = document.getElementById("bgMusic");
const pageFlipSound = document.getElementById("pageFlipSound");

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
  updateSoundButtons(false);
}

async function startMusicOnce() {
  if (!bgMusic) return;

  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      updateSoundButtons(true);
    }
  } catch (error) {
    console.log("Autoplay blocked:", error);
  }

  document.removeEventListener("click", startMusicOnce);
  document.removeEventListener("touchstart", startMusicOnce);
  document.removeEventListener("keydown", startMusicOnce);
}

document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("touchstart", startMusicOnce, { once: true });
document.addEventListener("keydown", startMusicOnce, { once: true });

async function toggleMusic() {
  if (!bgMusic) return;

  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      updateSoundButtons(true);
    } else {
      bgMusic.pause();
      updateSoundButtons(false);
    }
  } catch (error) {
    console.log("Audio toggle blocked:", error);
  }
}

if (soundToggle) {
  soundToggle.addEventListener("click", toggleMusic);
}

if (soundToggleFloat) {
  soundToggleFloat.addEventListener("click", toggleMusic);
}

function playPageFlipSound() {
  if (!pageFlipSound) return;

  try {
    pageFlipSound.pause();
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
  } catch (error) {
    console.log("Page flip sound error:", error);
  }
}

/* =========================
   INTERACTIVE RECIPES
========================= */
const interactiveRecipeData = {
  borscht: {
    cuisine: "Ukrainian cuisine",
    title: "Borscht",
    short: "Classic beet soup with layers of home, time, and family routine.",
    ingredients: "Beetroot, Cabbage, Potato, Carrot, Onion, Broth",
    memory: "This dish feels like coming back home after a long journey.",
    audio: "audio/borshch.mp3",
    image: "images/borshchuk.png",
    similarTo: "hotpot"
  },
  pampushky: {
    cuisine: "Ukrainian cuisine",
    title: "Pampushky",
    short: "Soft garlic buns served warm, bringing comfort and the feeling of a shared family table.",
    ingredients: "Flour, Yeast, Milk, Garlic, Oil, Salt",
    memory: "Pampushky feel like warm kitchen air and bread taken straight from the oven.",
    audio: "audio/pampushku_Audio_mixdown.mp3",
    image: "images/pampushky.png",
    similarTo: "baozi"
  },
  varenyky: {
    cuisine: "Ukrainian cuisine",
    title: "Varenyky",
    short: "Filled dumplings shaped by hand, carrying everyday tradition and home ritual.",
    ingredients: "Flour, Egg, Water, Potato, Cheese, Onion",
    memory: "Varenyky feel like many hands working together around one table.",
    audio: "audio/Varenuku_audio_mixdown.mp3",
    image: "images/varenyky.png",
    similarTo: "dumplings"
  },
  holubtsi: {
    cuisine: "Ukrainian cuisine",
    title: "Holubtsi",
    short: "Stuffed cabbage rolls cooked slowly for family gatherings and special meals.",
    ingredients: "Cabbage, Rice, Meat, Onion, Carrot, Tomato",
    memory: "Holubtsi feel like care, patience, and recipes passed between generations.",
    audio: "audio/Holubzi_audio_mixdown.mp3",
    image: "images/holubtsi.png",
    similarTo: "springrolls"
  },
  hotpot: {
    cuisine: "Chinese cuisine",
    title: "Hotpot",
    short: "A shared dish where ingredients cook at the table and conversation lasts for hours.",
    ingredients: "Broth, Beef, Mushrooms, Cabbage, Tofu, Noodles",
    memory: "Hotpot feels like gathering close, sharing warmth, and eating without rushing.",
    audio: "audio/hot_pot_audio_mixdown.mp3",
    image: "images/hotpot.png",
    similarTo: "borscht"
  },
  baozi: {
    cuisine: "Chinese cuisine",
    title: "Baozi",
    short: "Soft steamed buns filled with comfort, warmth, and familiar everyday flavour.",
    ingredients: "Flour, Yeast, Pork, Soy, Ginger, Garlic",
    memory: "Baozi feel like a warm morning and food made with care.",
    audio: "audio/baozi_audio_mixdown.mp3",
    image: "images/baozi.png",
    similarTo: "pampushky"
  },
  dumplings: {
    cuisine: "Chinese cuisine",
    title: "Jiaozi",
    short: "Folded by hand, these dumplings connect family ritual, patience, and celebration.",
    ingredients: "Wrappers, Pork, Cabbage, Chives, Ginger, Soy",
    memory: "Jiaozi feel like festive gatherings and many careful hands cooking together.",
    audio: "audio/jiaozi_audio_mixdown.mp3",
    image: "images/dumplings.png",
    similarTo: "varenyky"
  },
  springrolls: {
    cuisine: "Chinese cuisine",
    title: "Spring Rolls",
    short: "Rolled, crisp, and made for sharing, often part of festive meals and celebrations.",
    ingredients: "Wrappers, Cabbage, Carrot, Mushrooms, Noodles, Soy",
    memory: "Spring rolls feel lively, celebratory, and full of movement around the table.",
    audio: "audio/springRolls_audio_mixdown.mp3",
    image: "images/springrolls.png",
    similarTo: "holubtsi"
  }
};

const recipeKeys = Object.keys(interactiveRecipeData);
let currentInteractiveRecipeKey = "borscht";
let currentIndex = recipeKeys.indexOf(currentInteractiveRecipeKey);

const recipeCuisine = document.getElementById("recipeCuisine");
const recipeMainTitle = document.getElementById("recipeMainTitle");
const recipeShort = document.getElementById("recipeShort");
const recipeIngredients = document.getElementById("recipeIngredients");
const recipeMemory = document.getElementById("recipeMemory");
const similarDishBtn = document.getElementById("similarDishBtn");
const recipeCenterImage = document.getElementById("recipeCenterImage");
const storyAudioBtn = document.getElementById("storyAudioBtn");
const storyAudioText = document.getElementById("storyAudioText");
const storyAudio = document.getElementById("storyAudio");
const storyAudioSource = document.getElementById("storyAudioSource");
const recipeTabs = document.querySelectorAll(".recipe-tab");
const recipeStoryCard = document.querySelector(".recipe-story-card");
const interactiveArrowBtn = document.getElementById("interactiveArrowBtn");

function resetStoryAudioUI() {
  if (storyAudioBtn) storyAudioBtn.classList.remove("is-playing");
  if (storyAudioText) storyAudioText.textContent = "Play story";
}

function formatIngredients(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("<br>");
}

function renderInteractiveRecipe(recipeKey) {
  const recipe = interactiveRecipeData[recipeKey];
  if (!recipe) return;

  currentInteractiveRecipeKey = recipeKey;
  currentIndex = recipeKeys.indexOf(recipeKey);

  if (recipeCuisine) recipeCuisine.textContent = recipe.cuisine;
  if (recipeMainTitle) recipeMainTitle.textContent = recipe.title;
  if (recipeShort) recipeShort.textContent = recipe.short;
  if (recipeIngredients) recipeIngredients.innerHTML = formatIngredients(recipe.ingredients);
  if (recipeMemory) recipeMemory.textContent = recipe.memory;

  if (similarDishBtn && recipe.similarTo && interactiveRecipeData[recipe.similarTo]) {
    similarDishBtn.textContent = `Similar dish: ${interactiveRecipeData[recipe.similarTo].title}`;
  }

  if (storyAudio && storyAudioSource) {
    storyAudio.pause();
    storyAudio.currentTime = 0;
    storyAudioSource.src = recipe.audio;
    storyAudio.load();
    resetStoryAudioUI();
  }

  if (recipeCenterImage) {
    recipeCenterImage.src = recipe.image;
    recipeCenterImage.alt = recipe.title;
  }

  recipeTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.recipe === recipeKey);
  });
}

function animateRecipeChange(nextKey, direction = 1) {
  if (!recipeStoryCard) {
    renderInteractiveRecipe(nextKey);
    return;
  }

  const rotateOut = direction > 0 ? -75 : 75;
  const rotateIn = direction > 0 ? 75 : -75;

  recipeStoryCard.classList.add("is-flipping");

  gsap.timeline({
    onComplete: () => {
      recipeStoryCard.classList.remove("is-flipping");
    }
  })
    .to(recipeStoryCard, {
      duration: 0.28,
      rotateY: rotateOut,
      x: direction > 0 ? -10 : 10,
      scale: 0.985,
      opacity: 0.78,
      ease: "power2.in"
    })
    .add(() => {
      renderInteractiveRecipe(nextKey);
    })
    .set(recipeStoryCard, {
      rotateY: rotateIn,
      x: direction > 0 ? 10 : -10
    })
    .to(recipeStoryCard, {
      duration: 0.42,
      rotateY: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      ease: "power3.out"
    });
}

recipeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const nextKey = tab.dataset.recipe;
    const nextIndex = recipeKeys.indexOf(nextKey);
    const direction = nextIndex > currentIndex ? 1 : -1;

    playPageFlipSound();
    animateRecipeChange(nextKey, direction);
  });
});

if (interactiveArrowBtn) {
  interactiveArrowBtn.addEventListener("click", () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= recipeKeys.length) nextIndex = 0;

    const nextKey = recipeKeys[nextIndex];

    playPageFlipSound();
    playFullSceneAnimation();

    setTimeout(() => {
      animateRecipeChange(nextKey, 1);
    }, 260);
  });
}

if (similarDishBtn) {
  similarDishBtn.addEventListener("click", () => {
    const currentRecipe = interactiveRecipeData[currentInteractiveRecipeKey];
    if (!currentRecipe || !currentRecipe.similarTo) return;

    const nextKey = currentRecipe.similarTo;
    const nextIndex = recipeKeys.indexOf(nextKey);
    const direction = nextIndex > currentIndex ? 1 : -1;

    playPageFlipSound();
    animateRecipeChange(nextKey, direction);
  });
}

if (storyAudioBtn && storyAudio) {
  storyAudioBtn.addEventListener("click", async () => {
    try {
      if (storyAudio.paused) {
        await storyAudio.play();
        storyAudioBtn.classList.add("is-playing");
        if (storyAudioText) storyAudioText.textContent = "Pause story";
      } else {
        storyAudio.pause();
        storyAudioBtn.classList.remove("is-playing");
        if (storyAudioText) storyAudioText.textContent = "Play story";
      }
    } catch (error) {
      console.log("Story audio error:", error);
    }
  });

  storyAudio.addEventListener("ended", resetStoryAudioUI);
  storyAudio.addEventListener("error", () => {
    console.log("Story audio failed to load");
    resetStoryAudioUI();
  });
}

renderInteractiveRecipe(currentInteractiveRecipeKey);

/* =========================
   RECIPE UNIVERSE
========================= */
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
  const item = recipeUniverseData[cuisineKey]?.[recipeIndex];
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
    btn.className = `recipe-item ${index === currentRecipeUniverse ? "active" : ""}`;
    btn.innerHTML = `
      <strong>${item.title}</strong>
      <span>${item.short}</span>
    `;

    btn.addEventListener("click", () => {
      currentRecipeUniverse = index;
      document.querySelectorAll(".recipe-item").forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");
      updateRecipeStage(cuisineKey, index);
    });

    recipeList.appendChild(btn);
  });
}

cuisineSwitches.forEach((btn) => {
  btn.addEventListener("click", () => {
    cuisineSwitches.forEach((el) => el.classList.remove("active"));
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
    const targetIndex = recipeUniverseData[otherCuisine].findIndex((item) => item.id === targetId);

    if (targetIndex !== -1) {
      currentCuisineUniverse = otherCuisine;
      currentRecipeUniverse = targetIndex;

      cuisineSwitches.forEach((el) => {
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

/* =========================
   DRAGON
========================= */
const dragon = document.getElementById("dragonGif");
const dragonSection = document.getElementById("interactiveRecipes");
const textBlock = document.querySelector(".recipe-story-card");

if (dragon && dragonSection) {
  gsap.set(dragon, {
    x: -250,
    y: 0,
    opacity: 0,
    scaleX: -1,
    rotation: 0
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: dragonSection,
      start: "top 75%",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.to(dragon, {
          scaleX: self.direction === 1 ? -1 : 1,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    }
  })
    .to(dragon, {
      opacity: 1,
      x: window.innerWidth * 0.22,
      ease: "none"
    })
    .to(dragon, {
      x: window.innerWidth * 0.52,
      ease: "none"
    })
    .to(dragon, {
      x: window.innerWidth * 0.82,
      ease: "none"
    })
    .to(dragon, {
      x: window.innerWidth + 250,
      opacity: 0,
      ease: "none"
    });
}

if (dragon && textBlock) {
  gsap.to(dragon, {
    opacity: 0.28,
    ease: "none",
    scrollTrigger: {
      trigger: textBlock,
      start: "top 78%",
      end: "bottom 25%",
      scrub: true
    }
  });
}

/* =========================
   LANTERNS + SAKURA FOR RECIPES
========================= */
const lanterns = document.querySelectorAll(".lantern");
const sakuraLeft = document.querySelector(".sakura-left");
const sakuraRight = document.querySelector(".sakura-right");
const petalsLayer = document.getElementById("petalsLayer");

const petalImages = [
  "images/petals/petal1.png",
  "images/petals/petal2.png",
  "images/petals/petal3.png",
  "images/petals/petal4.png",
  "images/petals/petal5.png",
  "images/petals/petal6.png",
  "images/petals/petal7.png",
  "images/petals/petal8.png",
  "images/petals/petal9.png",
  "images/petals/petal10.png",
  "images/petals/petal11.png"
];

function createPetal() {
  if (!petalsLayer) return;

  const petal = document.createElement("img");
  petal.className = "petal";
  petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];

  const startX = Math.random() * window.innerWidth;
  const drift = gsap.utils.random(-120, 120);
  const rotate = gsap.utils.random(-180, 180);
  const duration = gsap.utils.random(5, 9);

  petalsLayer.appendChild(petal);

  gsap.set(petal, {
    x: startX,
    y: -40,
    opacity: 1,
    scale: gsap.utils.random(1.2, 2.2),
    rotation: gsap.utils.random(-20, 20)
  });

  gsap.to(petal, {
    y: window.innerHeight + 300,
    x: startX + drift,
    rotation: rotate,
    duration: duration,
    ease: "none",
    onComplete: () => petal.remove()
  });

  gsap.to(petal, {
    x: `+=${gsap.utils.random(-60, 60)}`,
    repeat: -1,
    yoyo: true,
    duration: gsap.utils.random(1, 2),
    ease: "sine.inOut"
  });
}

function startPetalRain() {
  for (let i = 0; i < 45; i++) {
    setTimeout(() => {
      createPetal();
    }, i * 120);
  }
}

function playFullSceneAnimation() {
  if (!lanterns.length) return;

  const tl = gsap.timeline();

  gsap.killTweensOf(lanterns);

  gsap.set(lanterns, {
    y: -260,
    opacity: 0,
    rotate: 0
  });

  tl.to(lanterns, {
    y: 520,
    opacity: 1,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    onStart: () => startPetalRain()
  });

  tl.to(lanterns, {
    y: -300,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power2.in"
  }, "+=0.4");
}

/* =========================
   BOOK PREVIEW + BOOK SAKURA
========================= */
const openBookPreviewBtn = document.getElementById("openBookPreview");
const bookPreviewSection = document.getElementById("bookPreviewSection");
const bookSakuraLeft = document.querySelector(".global-book-sakura-left");
const bookSakuraRight = document.querySelector(".global-book-sakura-right");
const bookPetalsLayer = document.getElementById("globalBookPetals");

let flipbookReady = false;

function initFlipbook() {
  if (flipbookReady) return;
  if (typeof window.$ === "undefined") return;
  if (!window.$("#flipbook").length) return;
  if (typeof window.$.fn.turn !== "function") return;
  flipbookReady = true;
}

function createBookPetal() {
  if (!bookPetalsLayer) return;

  const petal = document.createElement("img");
  petal.className = "global-book-petal";
  petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];

  const startX = Math.random() * window.innerWidth;
  const drift = gsap.utils.random(-200, 200);
  const duration = gsap.utils.random(5, 9);

  bookPetalsLayer.appendChild(petal);

  gsap.set(petal, {
    x: startX,
    y: -40,
    opacity: 1,
    scale: gsap.utils.random(1.2, 2.2),
    rotation: gsap.utils.random(-20, 20)
  });

  gsap.to(petal, {
    y: window.innerHeight + 300,
    x: startX + drift,
    duration: duration,
    ease: "none",
    onComplete: () => petal.remove()
  });

  gsap.to(petal, {
    x: `+=${gsap.utils.random(-60, 60)}`,
    repeat: -1,
    yoyo: true,
    duration: gsap.utils.random(1, 2),
    ease: "sine.inOut"
  });
}

function startBookPetalRain() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => createBookPetal(), i * 60);
  }
}

function playBookSakuraAnimation() {
  if (!bookSakuraLeft || !bookSakuraRight) return;

  gsap.killTweensOf([bookSakuraLeft, bookSakuraRight]);

  gsap.set(bookSakuraLeft, {
    x: 0,
    opacity: 0,
    rotate: -8
  });

  gsap.set(bookSakuraRight, {
    x: 0,
    opacity: 0,
    rotate: 8
  });

  const tl = gsap.timeline();

  tl.to(bookSakuraLeft, {
    x: 380,
    opacity: 1,
    duration: 1,
    ease: "power3.out"
  });

  tl.to(bookSakuraRight, {
    x: -380,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    onStart: startBookPetalRain
  }, "-=0.7");

  tl.to({}, { duration: 1.2 }); // трошки побули на екрані

  tl.to(bookSakuraLeft, {
    x: 0,
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut"
  }, "-=0.2");

  tl.to(bookSakuraRight, {
    x: 0,
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut"
  }, "<");
}

function openBookPreviewSection() {
  if (!bookPreviewSection) return;

  bookPreviewSection.classList.add("active");

  setTimeout(() => {
    initFlipbook();
    playBookSakuraAnimation();

    bookPreviewSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 120);
}

if (openBookPreviewBtn) {
  openBookPreviewBtn.addEventListener("click", openBookPreviewSection);
}