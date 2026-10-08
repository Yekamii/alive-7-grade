// 6 ბიოლოგიური თვისება
const TRAITS = [
  { id: "metabolism", label: "🔄 ნივთიერებათა და ენერგიის ცვლა" },
  { id: "nutrition", label: "🌱 კვება და სუნთქვა" },
  { id: "growth", label: "📈 ზრდა და ინდივიდუალური განვითარება" },
  { id: "reproduction", label: "🧬 გამრავლება (შთამომავლობის დატოვება)" },
  { id: "irritability", label: "⚡ გაღიზიანებადობა (რეაგირება გაღიზიანებაზე)" },
  { id: "locomotion", label: "🏃 სივრცეში აქტიური გადაადგილება (ლოკომოცია)" }
];

// 2 ობიექტი ზუსტი ბიოლოგიური პროფილებით
const ORGANISMS = [
  {
    id: "plant",
    name: "🌻 მცენარე (ყვავილი)",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400",
    scenario: "მცენარე ნიადაგიდან ითვისებს წყალს და მინერალებს, ფოტოსინთეზით წარმოქმნის ორგანულ ნივთიერებებს, იზრდება, ყვავილობს და რეაგირებს სინათლის მიმართულებაზე.",
    // მცენარეს ახასიათებს 5 თვისება (გარდა აქტიური გადაადგილებისა):
    correctTraits: ["metabolism", "nutrition", "growth", "reproduction", "irritability"],
    analysis: "მცენარე არ ახორციელებს სივრცეში აქტიურ გადაადგილებას (ლოკომოციას), თუმცა ის სრულფასოვანი ცოცხალი ორგანიზმია."
  },
  {
    id: "dog",
    name: "🐕 ცხოველი (ძაღლი)",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
    scenario: "ძაღლი იღებს საკვებს, სუნთქავს ჟანგბადს, აქტიურად გადაადგილდება გარემოში, რეაგირებს ბგერით და ვიზუალურ სიგნალებზე და ტოვებს შთამომავლობას.",
    // ცხოველს ახასიათებს ყველა 6 თვისება:
    correctTraits: ["metabolism", "nutrition", "growth", "reproduction", "irritability", "locomotion"],
    analysis: "ცხოველისთვის სივრცეში აქტიური გადაადგილება ევოლუციურად ჩამოყალიბებული ადაპტაციაა საკვების მოპოვებისა და თავდაცვისთვის."
  }
];

let selectedOrganism = null;

const organismGrid = document.getElementById("organismGrid");
const workspace = document.getElementById("workspace");
const traitsGrid = document.getElementById("traitsGrid");
const activeImg = document.getElementById("activeImg");
const activeName = document.getElementById("activeName");
const activeScenario = document.getElementById("activeScenario");
const checkBtn = document.getElementById("checkBtn");
const resultCard = document.getElementById("resultCard");
const feedbackText = document.getElementById("feedbackText");
const nextBtn = document.getElementById("nextBtn");

function initOrganisms() {
  organismGrid.innerHTML = "";
  ORGANISMS.forEach(org => {
    const card = document.createElement("div");
    card.className = "org-card";
    card.onclick = () => selectOrganism(org, card);
    card.innerHTML = `
      <img src="${org.image}" alt="${org.name}">
      <h4>${org.name}</h4>
    `;
    organismGrid.appendChild(card);
  });
}

function selectOrganism(org, cardElement) {
  selectedOrganism = org;
  
  document.querySelectorAll(".org-card").forEach(c => c.classList.remove("selected"));
  cardElement.classList.add("selected");

  activeImg.src = org.image;
  activeName.innerText = org.name;
  activeScenario.innerText = `📋 ბიოლოგიური აღწერა: ${org.scenario}`;

  renderTraits();

  workspace.classList.remove("hidden");
  resultCard.classList.add("hidden");
  workspace.scrollIntoView({ behavior: 'smooth' });
}

function renderTraits() {
  traitsGrid.innerHTML = "";
  TRAITS.forEach(trait => {
    const label = document.createElement("label");
    label.className = "trait-option";
    label.id = `trait-box-${trait.id}`;
    label.innerHTML = `
      <span class="trait-option-label">
        <input type="checkbox" value="${trait.id}" id="cb-${trait.id}">
        <span>${trait.label}</span>
      </span>
      <span class="status-badge" id="badge-${trait.id}"></span>
    `;
    traitsGrid.appendChild(label);
  });
}

checkBtn.onclick = () => {
  if (!selectedOrganism) return;

  const correct = selectedOrganism.correctTraits;
  let allCorrect = true;

  TRAITS.forEach(trait => {
    const checkbox = document.getElementById(`cb-${trait.id}`);
    const box = document.getElementById(`trait-box-${trait.id}`);
    const badge = document.getElementById(`badge-${trait.id}`);
    
    const isChecked = checkbox.checked;
    const shouldBeChecked = correct.includes(trait.id);

    // გასუფთავება
    box.className = "trait-option";
    badge.innerText = "";

    if (isChecked && shouldBeChecked) {
      // სწორად მონიშნული -> მწვანე
      box.classList.add("status-correct");
      badge.innerText = "✓ სწორია";
    } else if (isChecked && !shouldBeChecked) {
      // არასწორად მონიშნული -> წითელი
      box.classList.add("status-wrong-selected");
      badge.innerText = "✕ არასწორია (არ ახასიათებს)";
      allCorrect = false;
    } else if (!isChecked && shouldBeChecked) {
      // არასწორად გამოტოვებული (უნდა მოენიშნა) -> წითელი ჩარჩო/ტექსტი
      box.classList.add("status-missing");
      badge.innerText = "✕ გამოტოვებულია (ახასიათებს)";
      allCorrect = false;
    }
  });

  let feedbackHtml = `<strong>ანალიზის შედეგი (${selectedOrganism.name}):</strong><br><br>`;
  
  if (allCorrect) {
    feedbackHtml += `✅ <b>პასუხი სრულიად ზუსტია!</b><br>${selectedOrganism.analysis}`;
  } else {
    feedbackHtml += `⚠️ <b>დაფიქსირდა შეცდომები (იხილეთ წითლად მონიშნული ველები).</b><br>${selectedOrganism.analysis}`;
  }

  feedbackText.innerHTML = feedbackHtml;
  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: 'smooth' });
};

nextBtn.onclick = () => {
  workspace.classList.add("hidden");
  resultCard.classList.add("hidden");
  document.querySelectorAll(".org-card").forEach(c => c.classList.remove("selected"));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

initOrganisms();