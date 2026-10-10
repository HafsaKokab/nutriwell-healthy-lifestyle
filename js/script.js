/* =====================================================
   NutriWell — Main JavaScript
   Vanilla JS only. Organized by feature so each part
   can be explained independently during the viva.
   ===================================================== */

/* -----------------------------------------------------
   1. Mobile hamburger navigation
   Works the same way on every page because the header
   markup and class names are identical everywhere.
----------------------------------------------------- */
function setupNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the menu whenever a navigation link is clicked
  const links = navLinks.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* -----------------------------------------------------
   2. Daily Nutrition Tip generator (Home page)
----------------------------------------------------- */
const nutritionTips = [
  "Fill half your plate with vegetables at every meal for easy portion control.",
  "Drink a glass of water before meals — it supports digestion and hydration.",
  "Choose whole grains like oats and brown rice over refined grains.",
  "A handful of nuts makes a satisfying, nutrient-dense snack.",
  "Add a source of protein to breakfast to stay fuller for longer.",
  "Eating slowly gives your body time to recognise when it's full.",
  "Colourful meals usually mean a wider range of vitamins and minerals.",
  "Healthy fats from avocado, olive oil and fish support brain health.",
  "Plan your meals ahead of time to make healthier choices easier.",
  "Fibre-rich foods like beans and lentils support a healthy digestive system.",
];

function setupDailyTip() {
  const tipText = document.getElementById("tip-text");
  const tipButton = document.getElementById("tip-button");

  if (!tipText || !tipButton) return;

  // Show a random tip on page load
  let lastIndex = Math.floor(Math.random() * nutritionTips.length);
  tipText.textContent = nutritionTips[lastIndex];

  tipButton.addEventListener("click", function () {
    let newIndex = Math.floor(Math.random() * nutritionTips.length);
    // Avoid repeating the same tip twice in a row
    while (newIndex === lastIndex && nutritionTips.length > 1) {
      newIndex = Math.floor(Math.random() * nutritionTips.length);
    }
    lastIndex = newIndex;
    tipText.textContent = nutritionTips[newIndex];
  });
}

/* -----------------------------------------------------
   3. Accordion (About page — Nutrition Principles)
----------------------------------------------------- */
function setupAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  if (items.length === 0) return;

  items.forEach(function (item) {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    trigger.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      // Close every item first so only one is open at a time
      items.forEach(function (otherItem) {
        otherItem.classList.remove("is-open");
        otherItem.querySelector(".accordion-panel").style.maxHeight = null;
        otherItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });

      // Re-open the clicked item unless it was already open
      if (!isOpen) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* -----------------------------------------------------
   4. Animated statistics counter (About page)
----------------------------------------------------- */
function setupStatsAnimation() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length === 0) return;

  let hasAnimated = false;

  function animateStats() {
    statNumbers.forEach(function (statEl) {
      const target = parseInt(statEl.dataset.target, 10);
      const suffix = statEl.dataset.suffix || "";
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        statEl.textContent = current + suffix;
      }, 25);
    });
  }

  // Use IntersectionObserver to trigger the count-up once, when scrolled into view
  const statsSection = document.querySelector(".stats-grid");
  if (statsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateStats();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
  } else {
    animateStats();
  }
}

/* -----------------------------------------------------
   5. Food Explorer data + filtering (Nutrition page)
----------------------------------------------------- */
const foodItems = [
  { name: "Avocado", category: "Fruits", benefit: "Rich in healthy monounsaturated fats.", img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=80" },
  { name: "Blueberries", category: "Fruits", benefit: "Packed with antioxidants that fight inflammation.", img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=500&q=80" },
  { name: "Banana", category: "Fruits", benefit: "A quick source of energy and potassium.", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80" },
  { name: "Spinach", category: "Vegetables", benefit: "High in iron, folate and vitamin K.", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80" },
  { name: "Broccoli", category: "Vegetables", benefit: "A great source of fibre and vitamin C.", img: "images/expert/brocalii.png" },
  { name: "Carrots", category: "Vegetables", benefit: "Rich in beta-carotene for healthy eyesight.", img: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=500&q=80" },
  { name: "Grilled Chicken", category: "Protein", benefit: "Lean protein that supports muscle repair.", img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80" },
  { name: "Salmon", category: "Protein", benefit: "Loaded with omega-3 fatty acids.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80" },
  { name: "Almonds", category: "Protein", benefit: "A crunchy source of plant protein and vitamin E.", img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=500&q=80" },
  { name: "Oats", category: "Grains", benefit: "A slow-release carbohydrate rich in fibre.", img: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=500&q=80" },
  { name: "Brown Rice", category: "Grains", benefit: "A wholegrain source of steady energy.", img: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=500&q=80" },
  { name: "Quinoa", category: "Grains", benefit: "A complete plant protein and gluten-free grain.", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80" },
];

function createFoodCard(food) {
  const card = document.createElement("article");
  card.className = "food-card";
  card.setAttribute("data-category", food.category);

  card.innerHTML =
    '<img src="' + food.img + '" alt="' + food.name + '" loading="lazy">' +
    '<div class="food-card-body">' +
    '<span class="food-card-tag">' + food.category + '</span>' +
    "<h4>" + food.name + "</h4>" +
    "<p>" + food.benefit + "</p>" +
    "</div>";

  return card;
}

function setupFoodExplorer() {
  const grid = document.getElementById("food-grid");
  const filterBar = document.getElementById("food-filter-bar");

  if (!grid || !filterBar) return;

  function renderFoods(category) {
    grid.innerHTML = "";

    const filtered = category === "All"
      ? foodItems
      : foodItems.filter(function (food) { return food.category === category; });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="empty-state">No foods found in this category yet.</p>';
      return;
    }

    filtered.forEach(function (food) {
      grid.appendChild(createFoodCard(food));
    });
  }

  // Initial render — show everything
  renderFoods("All");

  const filterButtons = filterBar.querySelectorAll(".filter-btn");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderFoods(btn.dataset.category);
    });
  });
}

/* -----------------------------------------------------
   6. BMI Calculator (Nutrition page)
----------------------------------------------------- */
function setupBmiCalculator() {
  const form = document.getElementById("bmi-form");
  if (!form) return;

  const heightInput = document.getElementById("bmi-height");
  const weightInput = document.getElementById("bmi-weight");
  const heightError = document.getElementById("height-error");
  const weightError = document.getElementById("weight-error");

  const placeholder = document.getElementById("bmi-placeholder");
  const resultBox = document.getElementById("bmi-result-box");
  const valueEl = document.getElementById("bmi-value");
  const categoryEl = document.getElementById("bmi-category");
  const messageEl = document.getElementById("bmi-message");

  function getBmiCategory(bmi) {
    if (bmi < 18.5) {
      return { label: "Underweight", status: "status-under" };
    } else if (bmi < 25) {
      return { label: "Normal Weight", status: "status-normal" };
    } else if (bmi < 30) {
      return { label: "Overweight", status: "status-over" };
    } else {
      return { label: "Obesity", status: "status-obese" };
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the form from reloading the page

    // Reset error messages on every attempt
    heightError.textContent = "";
    weightError.textContent = "";

    const heightValue = heightInput.value.trim();
    const weightValue = weightInput.value.trim();
    let hasError = false;

    if (heightValue === "") {
      heightError.textContent = "Please enter your height.";
      hasError = true;
    } else if (isNaN(heightValue) || Number(heightValue) <= 0) {
      heightError.textContent = "Height must be a positive number.";
      hasError = true;
    }

    if (weightValue === "") {
      weightError.textContent = "Please enter your weight.";
      hasError = true;
    } else if (isNaN(weightValue) || Number(weightValue) <= 0) {
      weightError.textContent = "Weight must be a positive number.";
      hasError = true;
    }

    if (hasError) return;

    const heightInMeters = Number(heightValue) / 100;
    const weightInKg = Number(weightValue);
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const bmiRounded = bmi.toFixed(1);
    const category = getBmiCategory(bmi);

    valueEl.textContent = bmiRounded;
    categoryEl.textContent = category.label;
    categoryEl.className = "bmi-category " + category.status;
    messageEl.textContent = "Your BMI is " + bmiRounded + " — " + category.label + ".";

    placeholder.style.display = "none";
    resultBox.style.display = "block";
  });

  const resetButton = document.getElementById("bmi-reset");
  resetButton.addEventListener("click", function () {
    form.reset();
    heightError.textContent = "";
    weightError.textContent = "";
    resultBox.style.display = "none";
    placeholder.style.display = "block";
  });
}

/* -----------------------------------------------------
   7. Recipes — data, filtering and detail modal
----------------------------------------------------- */
const recipeItems = [
  // Breakfast Recipes
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    category: "Breakfast",
    description: "Creamy avocado on toasted wholegrain bread with a squeeze of lemon.",
    time: "10 min",
    difficulty: "Easy",
    img: "https://i.pinimg.com/1200x/e3/e3/e7/e3e3e7e27b065c072ae1eee6cf6d43c7.jpg",
    ingredients: ["2 slices wholegrain bread", "1 ripe avocado", "1/2 lemon, juiced", "Pinch of salt and pepper", "Chili flakes (optional)"],
    steps: ["Toast the bread slices until golden.", "Mash the avocado with lemon juice, salt and pepper.", "Spread the mixture evenly over the toast.", "Top with chili flakes and serve immediately."],
  },
  {
    id: "greek-yogurt-bowl",
    name: "Greek Yogurt Berry Bowl",
    category: "Breakfast",
    description: "Protein-rich Greek yogurt topped with fresh berries and granola.",
    time: "5 min",
    difficulty: "Easy",
    img: "https://i.pinimg.com/736x/18/0a/d7/180ad7c98b8e85b66548abc6d3df69a6.jpg",
    ingredients: ["1 cup Greek yogurt", "1/2 cup mixed berries", "2 tbsp granola", "1 tsp honey", "Mint leaves"],
    steps: ["Add Greek yogurt to a bowl.", "Top with fresh berries and granola.", "Drizzle with honey.", "Garnish with mint leaves and serve."],
  },
  {
    id: "overnight-oats",
    name: "Overnight Oats",
    category: "Breakfast",
    description: "Make-ahead breakfast with rolled oats soaked in milk overnight.",
    time: "5 min prep",
    difficulty: "Easy",
    img: "https://i.pinimg.com/1200x/0b/2b/41/0b2b41e90931fb0a5a9f4c95170d2be4.jpg",
    ingredients: ["1/2 cup rolled oats", "1/2 cup milk", "1 tbsp chia seeds", "1 tsp honey", "Fresh fruit"],
    steps: ["Mix oats, milk, and chia seeds in a jar.", "Add honey and stir well.", "Refrigerate overnight.", "Top with fresh fruit before serving."],
  },
  {
    id: "vegetable-omelette",
    name: "Vegetable Omelette",
    category: "Breakfast",
    description: "Fluffy eggs filled with fresh vegetables and herbs.",
    time: "15 min",
    difficulty: "Medium",
    img: "https://i.pinimg.com/736x/f1/b4/ba/f1b4ba1b0ba050543db755916a298526.jpg",
    ingredients: ["3 eggs", "1/4 cup bell peppers", "1/4 cup onions", "2 tbsp cheese", "Salt and pepper", "1 tbsp olive oil"],
    steps: ["Beat eggs with salt and pepper.", "Heat oil in a pan and sauté vegetables.", "Pour eggs into the pan.", "Add cheese, fold omelette and serve hot."],
  },

  // Lunch Recipes
  {
    id: "grilled-chicken-bowl",
    name: "Grilled Chicken Bowl",
    category: "Lunch",
    description: "Grilled chicken breast with brown rice and roasted vegetables.",
    time: "30 min",
    difficulty: "Medium",
    img: "https://i.pinimg.com/736x/75/e0/dc/75e0dca3880a06b58ca6fb2e3155a506.jpg",
    ingredients: ["1 chicken breast", "1 cup cooked brown rice", "1 cup mixed vegetables", "1 tbsp olive oil", "Salt, pepper and paprika"],
    steps: ["Season the chicken breast with salt, pepper and paprika.", "Grill the chicken for 6–7 minutes per side until cooked through.", "Roast the vegetables with olive oil until tender.", "Slice the chicken and serve over rice with vegetables."],
  },
  {
    id: "quinoa-salad",
    name: "Quinoa Chicken Bowl",
    category: "Lunch",
    description: "Nutritious quinoa bowl with grilled chicken and fresh vegetables.",
    time: "25 min",
    difficulty: "Medium",
    img: "https://i.pinimg.com/1200x/94/c2/5a/94c25a08acc669c75eda6dddae56a638.jpg",
    ingredients: ["1 cup cooked quinoa", "100g grilled chicken", "Cherry tomatoes", "Cucumber", "Avocado", "Lemon vinaigrette"],
    steps: ["Cook quinoa according to package instructions.", "Grill chicken and slice.", "Chop vegetables.", "Combine all ingredients and drizzle with vinaigrette."],
  },
  {
    id: "healthy-wrap",
    name: "Healthy Chicken Wrap",
    category: "Lunch",
    description: "Whole wheat wrap filled with grilled chicken and fresh vegetables.",
    time: "15 min",
    difficulty: "Easy",
    img: "images/expert/wrap.png",
    ingredients: ["1 whole wheat tortilla", "100g grilled chicken", "Lettuce", "Tomatoes", "Cucumber", "Hummus"],
    steps: ["Warm the tortilla slightly.", "Spread hummus on the tortilla.", "Add chicken and vegetables.", "Roll tightly and cut in half."],
  },
  {
    id: "lentil-bowl",
    name: "Lentil & Vegetable Bowl",
    category: "Lunch",
    description: "Protein-rich lentils with roasted seasonal vegetables.",
    time: "35 min",
    difficulty: "Medium",
    img: "https://i.pinimg.com/1200x/ed/4f/30/ed4f306f10e409dd0c129506dea437a7.jpg",
    ingredients: ["1 cup cooked lentils", "Mixed vegetables", "Olive oil", "Garlic", "Herbs", "Lemon juice"],
    steps: ["Cook lentils until tender.", "Roast vegetables with olive oil and herbs.", "Combine lentils and vegetables.", "Season with garlic and lemon juice."],
  },

  // Dinner Recipes
  {
    id: "salmon-vegetables",
    name: "Salmon & Vegetables",
    category: "Dinner",
    description: "Oven-baked salmon fillet served with roasted seasonal vegetables.",
    time: "25 min",
    difficulty: "Medium",
    img: "https://i.pinimg.com/1200x/51/0f/66/510f66373331d278bc9306b384c8b037.jpg",
    ingredients: ["1 salmon fillet", "1 cup broccoli florets", "1 cup carrots, sliced", "1 tbsp olive oil", "1 lemon", "Salt and pepper"],
    steps: ["Preheat the oven to 200°C.", "Place salmon and vegetables on a tray, drizzle with olive oil.", "Season with salt, pepper and a squeeze of lemon.", "Bake for 15–18 minutes until the salmon flakes easily."],
  },
  {
    id: "lemon-herb-fish",
    name: "Lemon Herb Fish",
    category: "Dinner",
    description: "Fresh fish fillet marinated in lemon and herbs, perfectly grilled.",
    time: "20 min",
    difficulty: "Medium",
    img: "https://i.pinimg.com/1200x/50/74/d7/5074d7cff7374048a1625c22bd1d8bab.jpg",
    ingredients: ["1 fish fillet", "2 lemons", "Fresh herbs", "Olive oil", "Garlic", "Salt and pepper"],
    steps: ["Marinate fish with lemon juice, herbs, and garlic.", "Heat olive oil in a pan.", "Cook fish for 4-5 minutes each side.", "Serve with lemon wedges."],
  },
  {
    id: "vegetable-stir-fry",
    name: "Vegetable Stir Fry",
    category: "Dinner",
    description: "Colorful mixed vegetables stir-fried with aromatic spices.",
    time: "15 min",
    difficulty: "Easy",
    img: "https://i.pinimg.com/1200x/94/05/4c/94054ce3b8689208bd928fb6e5dc6d18.jpg",
    ingredients: ["Mixed vegetables", "Soy sauce", "Garlic", "Ginger", "Sesame oil", "Green onions"],
    steps: ["Heat oil in a wok.", "Add garlic and ginger.", "Stir-fry vegetables for 5-7 minutes.", "Season with soy sauce and serve hot."],
  },
  {
    id: "lentil-soup",
    name: "Lentil Soup",
    category: "Dinner",
    description: "Hearty and nutritious soup made with red lentils and vegetables.",
    time: "30 min",
    difficulty: "Easy",
    img: "https://i.pinimg.com/1200x/61/8d/1b/618d1bbeb66202797527651c9f759c0e.jpg",
    ingredients: ["1 cup red lentils", "Onions", "Carrots", "Celery", "Vegetable broth", "Spices"],
    steps: ["Sauté onions, carrots, and celery.", "Add lentils and broth.", "Simmer for 20 minutes.", "Season and serve hot."],
  },

  // Juices & Smoothies
  {
    id: "berry-smoothie",
    name: "Berry Smoothie",
    category: "Juices & Smoothies",
    description: "A refreshing blend of mixed berries, yogurt and honey.",
    time: "5 min",
    difficulty: "Easy",
    img: "https://tse3.mm.bing.net/th/id/OIP.Nt9kiXNpMKOko7s1fwyuOQHaLG?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredients: ["1 cup mixed berries", "1/2 cup Greek yogurt", "1/2 cup milk", "1 tsp honey", "A few ice cubes"],
    steps: ["Add all ingredients to a blender.", "Blend until smooth and creamy.", "Pour into a glass and serve chilled."],
  },
  {
    id: "green-smoothie",
    name: "Green Detox Smoothie",
    category: "Juices & Smoothies",
    description: "Nutrient-rich green smoothie with spinach, apple, and ginger.",
    time: "5 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=700&q=80",
    ingredients: ["1 cup spinach", "1 apple", "1/2 cucumber", "Fresh ginger", "Coconut water", "Lemon juice"],
    steps: ["Wash and prepare all ingredients.", "Add to blender with coconut water.", "Blend until smooth.", "Add lemon juice and serve fresh."],
  },
  {
    id: "mango-smoothie",
    name: "Mango Yogurt Smoothie",
    category: "Juices & Smoothies",
    description: "Tropical mango smoothie with creamy yogurt and coconut.",
    time: "5 min",
    difficulty: "Easy",
    img: "images/expert/Mango_smoothie.png",
    ingredients: ["1 ripe mango", "1/2 cup yogurt", "1/4 cup coconut milk", "1 tsp honey", "Ice cubes"],
    steps: ["Peel and chop the mango.", "Add all ingredients to blender.", "Blend until creamy.", "Serve immediately with ice."],
  },
  {
    id: "cucumber-mint",
    name: "Cucumber Lemon Mint Drink",
    category: "Juices & Smoothies",
    description: "Refreshing and hydrating drink with cucumber, lemon, and mint.",
    time: "10 min",
    difficulty: "Easy",
    img: "images/expert/cucumber_lemonade.png",
    ingredients: ["1 cucumber", "2 lemons", "Fresh mint", "Water", "Ice cubes", "Honey (optional)"],
    steps: ["Slice cucumber and muddle with mint.", "Add lemon juice and water.", "Strain if desired.", "Serve over ice with honey."],
  },

  // Salads
  {
    id: "mediterranean-salad",
    name: "Mediterranean Salad",
    category: "Salads",
    description: "A crisp mix of cucumber, tomato, olives and feta cheese.",
    time: "15 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1512852939750-1305098529bf?auto=format&fit=crop&w=700&q=80",
    ingredients: ["1 cucumber, chopped", "2 tomatoes, chopped", "1/4 cup olives", "50g feta cheese", "1 tbsp olive oil", "1 tsp oregano"],
    steps: ["Chop the cucumber and tomatoes into bite-sized pieces.", "Combine with olives and crumbled feta in a bowl.", "Drizzle with olive oil and sprinkle with oregano.", "Toss gently and serve fresh."],
  },
  {
    id: "chickpea-salad",
    name: "Chickpea Salad",
    category: "Salads",
    description: "Protein-rich chickpea salad with fresh herbs and vegetables.",
    time: "15 min",
    difficulty: "Easy",
    img: "https://jessicainthekitchen.com/wp-content/uploads/2021/06/Mediterrean-Chickpea-Salad01972.jpg",
    ingredients: ["1 can chickpeas", "Cherry tomatoes", "Red onion", "Parsley", "Lemon juice", "Olive oil"],
    steps: ["Drain and rinse chickpeas.", "Chop vegetables and herbs.", "Mix all ingredients.", "Dress with lemon juice and olive oil."],
  },
  {
    id: "quinoa-garden-salad",
    name: "Quinoa Garden Salad",
    category: "Salads",
    description: "Nutritious quinoa salad with fresh garden vegetables.",
    time: "20 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=700&q=80",
    ingredients: ["1 cup cooked quinoa", "Mixed greens", "Cherry tomatoes", "Cucumber", "Carrots", "Balsamic vinaigrette"],
    steps: ["Cook quinoa and let cool.", "Prepare all vegetables.", "Combine quinoa with vegetables.", "Toss with vinaigrette and serve."],
  },
  {
    id: "avocado-salad",
    name: "Avocado Salad",
    category: "Salads",
    description: "Fresh avocado salad with lime dressing and mixed greens.",
    time: "10 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=700&q=80",
    ingredients: ["2 ripe avocados", "Mixed greens", "Cherry tomatoes", "Red onion", "Lime juice", "Olive oil"],
    steps: ["Slice avocados carefully.", "Prepare greens and vegetables.", "Arrange on plate.", "Drizzle with lime juice and olive oil."],
  },

  // Snacks
  {
    id: "fruit-nut-bowl",
    name: "Fruit & Nut Bowl",
    category: "Snacks",
    description: "Healthy mix of seasonal fruits with crunchy nuts.",
    time: "5 min",
    difficulty: "Easy",
    img: "https://tse3.mm.bing.net/th/id/OIP.nka6qDHJhVqc2rABsmq0xgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredients: ["Mixed seasonal fruits", "Almonds", "Walnuts", "Honey", "Mint leaves"],
    steps: ["Wash and chop fruits.", "Arrange in a bowl.", "Top with nuts.", "Drizzle with honey and garnish with mint."],
  },
  {
    id: "yogurt-berries",
    name: "Yogurt & Berries",
    category: "Snacks",
    description: "Creamy yogurt topped with fresh berries and granola.",
    time: "3 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80",
    ingredients: ["1 cup Greek yogurt", "Mixed berries", "Granola", "Honey"],
    steps: ["Add yogurt to bowl.", "Top with fresh berries.", "Sprinkle granola.", "Drizzle with honey."],
  },
  {
    id: "energy-bites",
    name: "Energy Bites",
    category: "Snacks",
    description: "No-bake energy balls made with dates, nuts, and seeds.",
    time: "15 min",
    difficulty: "Easy",
    img: "https://tse3.mm.bing.net/th/id/OIP.0HL0FeQ4C16rlPu8fMjmnAHaLG?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredients: ["1 cup dates", "1/2 cup almonds", "2 tbsp chia seeds", "1 tbsp coconut", "Cocoa powder"],
    steps: ["Soak dates until soft.", "Blend dates and almonds.", "Add seeds and coconut.", "Roll into balls and refrigerate."],
  },
  {
    id: "hummus-vegetables",
    name: "Hummus & Vegetables",
    category: "Snacks",
    description: "Fresh cut vegetables served with creamy homemade hummus.",
    time: "10 min",
    difficulty: "Easy",
    img: "https://daniliciousdishes.com/wp-content/uploads/2020/04/Creamy-Hummus-1-3-1.jpg",
    ingredients: ["Carrots", "Cucumber", "Bell peppers", "Hummus", "Olive oil", "Paprika"],
    steps: ["Cut vegetables into sticks.", "Prepare hummus.", "Arrange on plate.", "Garnish hummus with olive oil and paprika."],
  },

  // Desserts
  {
    id: "chia-pudding-dessert",
    name: "Chia Pudding",
    category: "Desserts",
    description: "Healthy chia seed pudding with coconut milk and fresh fruits.",
    time: "10 min + 2h chill",
    difficulty: "Easy",
    img: "https://th.bing.com/th/id/OIP.HW91K_L0CejfQKdRrxGCqQHaJa?w=202&h=257&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    ingredients: ["3 tbsp chia seeds", "1 cup coconut milk", "1 tbsp maple syrup", "Vanilla extract", "Fresh fruits"],
    steps: ["Mix chia seeds with coconut milk.", "Add maple syrup and vanilla.", "Refrigerate for 2 hours.", "Top with fresh fruits before serving."],
  },
  {
    id: "fruit-yogurt-cup",
    name: "Fruit & Yogurt Cup",
    category: "Desserts",
    description: "Layered dessert with Greek yogurt and seasonal fruits.",
    time: "8 min",
    difficulty: "Easy",
    img: "https://www.giverecipe.com/wp-content/uploads/2014/04/Yogurt-parfaits-for-breakfast.jpg",
    ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey", "Mint"],
    steps: ["Layer yogurt in a glass.", "Add berries and granola.", "Repeat layers.", "Top with honey and mint."],
  },
  {
    id: "banana-oat-bites",
    name: "Banana Oat Bites",
    category: "Desserts",
    description: "Naturally sweet bites made with banana and oats.",
    time: "20 min",
    difficulty: "Easy",
    img: "https://tse4.mm.bing.net/th/id/OIP.ZqZCPuRx1O9x5bav0oNmtQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredients: ["2 ripe bananas", "1 cup oats", "1/4 cup dark chocolate chips", "Cinnamon", "Vanilla"],
    steps: ["Mash bananas in a bowl.", "Mix with oats and chocolate chips.", "Add cinnamon and vanilla.", "Bake at 180°C for 12 minutes."],
  },
  {
    id: "baked-apple-cinnamon",
    name: "Baked Apple with Cinnamon",
    category: "Desserts",
    description: "Warm baked apple filled with cinnamon and honey.",
    time: "25 min",
    difficulty: "Easy",
    img: "https://tse2.mm.bing.net/th/id/OIP.bt7gVB8ENldBhe4DkLg6XgHaJ1?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredients: ["4 apples", "Cinnamon", "Honey", "Walnuts", "Vanilla"],
    steps: ["Core apples and place in baking dish.", "Fill with cinnamon and honey.", "Top with walnuts.", "Bake at 190°C for 20 minutes."],
  }
];

function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card";
  card.setAttribute("data-category", recipe.category);

  card.innerHTML =
    '<img src="' + recipe.img + '" alt="' + recipe.name + '" loading="lazy">' +
    '<div class="recipe-card-body">' +
    '<span class="recipe-card-tag">' + recipe.category + '</span>' +
    "<h3>" + recipe.name + "</h3>" +
    "<p>" + recipe.description + "</p>" +
    '<div class="recipe-meta">' +
    "<span>⏱ " + recipe.time + "</span>" +
    "<span>📊 " + recipe.difficulty + "</span>" +
    "</div>" +
    '<button class="btn btn-outline btn-small view-recipe-btn" data-id="' + recipe.id + '">View Recipe</button>' +
    "</div>";

  return card;
}

function setupRecipes() {
  const grid = document.getElementById("recipe-grid");
  const filterBar = document.getElementById("recipe-filter-bar");

  if (!grid || !filterBar) return;

  function renderRecipes(category) {
    grid.innerHTML = "";

    const filtered = category === "All"
      ? recipeItems
      : recipeItems.filter(function (recipe) { return recipe.category === category; });

    filtered.forEach(function (recipe) {
      grid.appendChild(createRecipeCard(recipe));
    });

    attachModalListeners();
  }

  renderRecipes("All");

  const filterButtons = filterBar.querySelectorAll(".filter-btn");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderRecipes(btn.dataset.category);
    });
  });
}

/* Recipe detail modal */
function attachModalListeners() {
  const viewButtons = document.querySelectorAll(".view-recipe-btn");
  viewButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openRecipeModal(btn.dataset.id);
    });
  });
}

function openRecipeModal(recipeId) {
  const overlay = document.getElementById("recipe-modal");
  if (!overlay) return;

  const recipe = recipeItems.find(function (item) { return item.id === recipeId; });
  if (!recipe) return;

  document.getElementById("modal-image").src = recipe.img;
  document.getElementById("modal-image").alt = recipe.name;
  document.getElementById("modal-title").textContent = recipe.name;
  document.getElementById("modal-time").textContent = "⏱ " + recipe.time;
  document.getElementById("modal-difficulty").textContent = "📊 " + recipe.difficulty;

  const ingredientsList = document.getElementById("modal-ingredients");
  ingredientsList.innerHTML = "";
  recipe.ingredients.forEach(function (ingredient) {
    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientsList.appendChild(li);
  });

  const stepsList = document.getElementById("modal-steps");
  stepsList.innerHTML = "";
  recipe.steps.forEach(function (step) {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeRecipeModal() {
  const overlay = document.getElementById("recipe-modal");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

function setupModalClosing() {
  const overlay = document.getElementById("recipe-modal");
  if (!overlay) return;

  const closeBtn = document.getElementById("modal-close-btn");
  closeBtn.addEventListener("click", closeRecipeModal);

  // Close when clicking outside the modal box (on the overlay itself)
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeRecipeModal();
    }
  });

  // Close when the ESC key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeRecipeModal();
    }
  });
}

/* -----------------------------------------------------
   8. Contact form validation (Contact page)
----------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const successBox = document.getElementById("form-success");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(id, text) {
    document.getElementById(id).textContent = text;
  }

  function clearErrors() {
    ["name-error", "email-error", "subject-error", "message-error"].forEach(function (id) {
      showError(id, "");
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // no backend — handle everything on the client

    clearErrors();
    successBox.classList.remove("is-visible");
    let isValid = true;

    if (nameInput.value.trim() === "") {
      showError("name-error", "Please enter your full name.");
      isValid = false;
    }

    if (emailInput.value.trim() === "") {
      showError("email-error", "Please enter your email address.");
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      showError("email-error", "Please enter a valid email address.");
      isValid = false;
    }

    if (subjectInput.value.trim() === "") {
      showError("subject-error", "Please enter a subject.");
      isValid = false;
    }

    if (messageInput.value.trim() === "") {
      showError("message-error", "Please write a message.");
      isValid = false;
    } else if (messageInput.value.trim().length < 15) {
      showError("message-error", "Your message should be at least 15 characters long.");
      isValid = false;
    }

    if (!isValid) return;

    successBox.classList.add("is-visible");
    form.reset();
  });
}

/* -----------------------------------------------------
   10. Theme Toggle (Light/Dark Mode)
----------------------------------------------------- */
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  
  if (!themeToggle || !themeIcon) return;

  // Get saved theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem("nutriwell-theme") || "light";
  
  // Apply saved theme
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  // Theme toggle click handler
  themeToggle.addEventListener("click", function() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    // Apply new theme
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("nutriwell-theme", newTheme);
    updateThemeIcon(newTheme, themeIcon);
  });
}

function updateThemeIcon(theme, iconElement) {
  if (theme === "dark") {
    iconElement.textContent = "☀️"; // Sun icon for dark mode (to switch to light)
  } else {
    iconElement.textContent = "🌙"; // Moon icon for light mode (to switch to dark)
  }
}

/* -----------------------------------------------------
   11. Newsletter sign-up (Home page promo panel)
----------------------------------------------------- */
function setupNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  const emailInput = document.getElementById("newsletter-email");
  const note = document.getElementById("newsletter-note");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // front-end only, no backend involved

    const email = emailInput.value.trim();

    if (email === "" || !emailPattern.test(email)) {
      note.textContent = "Please enter a valid email address.";
      note.className = "newsletter-note error";
      return;
    }

    note.textContent = "You're in! Check your inbox for a welcome email.";
    note.className = "newsletter-note success";
    form.reset();
  });
}

/* -----------------------------------------------------
   12. Run all setup functions once the DOM is ready
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupDailyTip();
  setupAccordion();
  setupStatsAnimation();
  setupFoodExplorer();
  setupBmiCalculator();
  setupRecipes();
  setupModalClosing();
  setupContactForm();
  setupThemeToggle();
  setupNewsletter();
});
