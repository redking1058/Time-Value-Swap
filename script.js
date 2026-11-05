const slider = document.getElementById('hours-slider');
const hoursVal = document.getElementById('hours-val');
const sixMonthHoursElem = document.getElementById('six-month-hours');
const fullDaysElem = document.getElementById('full-days');
const activitiesContainer = document.getElementById('activities-container');

// Activity default state: Icon, Editable Name, Default Interest %
const activities = [
  { id: 'gym', icon: '🏋️', title: 'Hitting the Gym', interest: 50 },
  { id: 'friends', icon: '🍕', title: 'Hanging with Friends', interest: 40 },
  { id: 'study', icon: '📖', title: 'Studying', interest: 30 },
  { id: 'skill', icon: '🚀', title: 'Learning a Skill', interest: 10 }
];

function renderCards() {
  activitiesContainer.innerHTML = '';

  activities.forEach((act, index) => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
      <div class="card-top">
        <span style="font-size: 1.3rem;">${act.icon}</span>
        <input type="text" class="editable-title" value="${act.title}" data-index="${index}">
      </div>

      <div class="interest-control">
        <div class="interest-header">
          <span>Interest / Preference</span>
          <span class="interest-val" id="interest-val-${index}">${act.interest}%</span>
        </div>
        <input type="range" class="interest-slider" min="0" max="100" step="5" value="${act.interest}" data-index="${index}">
      </div>

      <div class="calculated-hours" id="calc-hours-${index}">
        0 <span>hrs allocated</span>
      </div>
    `;
    activitiesContainer.appendChild(card);
  });

  // Attach event listeners for title edits and interest sliders
  document.querySelectorAll('.editable-title').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      activities[idx].title = e.target.value;
    });
  });

  document.querySelectorAll('.interest-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      activities[idx].interest = parseInt(e.target.value);
      document.getElementById(`interest-val-${idx}`).textContent = `${e.target.value}%`;
      updateCalculations();
    });
  });
}

function updateCalculations() {
  const dailyHours = parseFloat(slider.value);
  hoursVal.textContent = dailyHours;

  const totalHoursIn6Months = Math.round(dailyHours * 182.5);
  const totalFullDays = Math.round(totalHoursIn6Months / 24);

  sixMonthHoursElem.textContent = totalHoursIn6Months;
  fullDaysElem.textContent = totalFullDays;

  // Calculate sum of all interest weights
  const totalInterestSum = activities.reduce((sum, act) => sum + act.interest, 0);

  activities.forEach((act, index) => {
    const hoursElem = document.getElementById(`calc-hours-${index}`);
    if (totalInterestSum === 0) {
      hoursElem.innerHTML = `0 <span>hrs allocated</span>`;
    } else {
      // Split hours proportionally based on interest percentage ratio
      const allocatedHours = Math.round((act.interest / totalInterestSum) * totalHoursIn6Months);
      const weeklyHours = (allocatedHours / 26).toFixed(1); // 26 weeks in 6 months
      hoursElem.innerHTML = `${allocatedHours} <span>total hrs (~${weeklyHours} hrs/wk)</span>`;
    }
  });
}

// Initial Setup
renderCards();
slider.addEventListener('input', updateCalculations);
updateCalculations();