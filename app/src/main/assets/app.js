const FOODS = [
  { name: "Ovo", calories: 70 },
  { name: "Arroz", calories: 130 },
  { name: "Frango grelhado", calories: 165 },
  { name: "Batata doce", calories: 103 },
  { name: "Banana", calories: 105 },
  { name: "Pão francês", calories: 135 },
  { name: "Feijão", calories: 77 },
  { name: "Carne bovina", calories: 250 }
];

const STORAGE_MEALS = "zen_meals";
const STORAGE_GOAL = "zen_goal";

let meals = JSON.parse(localStorage.getItem(STORAGE_MEALS) || "[]");
let goal = parseInt(localStorage.getItem(STORAGE_GOAL) || "2000", 10);

function $(id){ return document.getElementById(id); }

function saveState(){
  localStorage.setItem(STORAGE_MEALS, JSON.stringify(meals));
  localStorage.setItem(STORAGE_GOAL, String(goal));
}

function populateFoods(){
  const select = $("presetFood");
  select.innerHTML = '<option value="">Selecione um alimento</option>';
  FOODS.forEach(food => {
    const option = document.createElement("option");
    option.value = JSON.stringify(food);
    option.textContent = `${food.name} - ${food.calories} kcal`;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    if (!select.value) return;
    const food = JSON.parse(select.value);
    $("foodName").value = food.name;
    $("foodCalories").value = food.calories;
  });
}

function renderMeals(){
  const list = $("mealList");
  list.innerHTML = "";
  let total = 0;
  meals.forEach(meal => {
    total += meal.calories;
    const li = document.createElement("li");
    li.innerHTML = `<span>${meal.name}</span><strong>${meal.calories} kcal</strong>`;
    list.appendChild(li);
  });
  $("emptyLabel").style.display = meals.length ? "none" : "block";
  $("totalCalories").textContent = `${total} kcal`;
  $("remaining").textContent = Math.max(goal - total, 0);
  $("goalInput").value = goal;
  $("mealCount").textContent = meals.length;
  $("average").textContent = meals.length ? Math.round(total / meals.length) + " kcal" : "0 kcal";
  $("bar").style.width = Math.min((total / goal) * 100, 100) + "%";
}

function openTab(id){
  document.querySelectorAll(".panel").forEach(el => el.classList.remove("active"));
  $(id).classList.add("active");
}

function addMeal(){
  const name = $("foodName").value.trim();
  const calories = parseInt($("foodCalories").value, 10);
  if (!name || Number.isNaN(calories) || calories <= 0) {
    alert("Preencha os campos corretamente.");
    return;
  }
  meals.push({ name, calories });
  saveState();
  $("foodName").value = "";
  $("foodCalories").value = "";
  $("presetFood").value = "";
  renderMeals();
  openTab("home");
}

function saveGoal(){
  const value = parseInt($("goalInput").value, 10);
  if (Number.isNaN(value) || value <= 0) {
    alert("Digite uma meta válida.");
    return;
  }
  goal = value;
  saveState();
  renderMeals();
  openTab("home");
}

function clearMeals(){
  meals = [];
  saveState();
  renderMeals();
  openTab("home");
}

document.addEventListener("DOMContentLoaded", () => {
  populateFoods();
  renderMeals();
});
