let allUsers = [];

async function fetchUsers(forceRefresh = false) {
  const userContainer = document.getElementById('user-container');
  const errorMessage = document.getElementById('error-message');
  const loader = document.getElementById('loader');
  userContainer.innerHTML = '';
  errorMessage.innerHTML = '';
  loader.style.display = 'block';

  try {
    if (!forceRefresh && localStorage.getItem('cachedUsers')) {
      // Load from localStorage first (offline mode)
      allUsers = JSON.parse(localStorage.getItem('cachedUsers'));
      displayUsers(allUsers);
      loader.style.display = 'none';
      return;
    }

    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const users = await response.json();
    allUsers = users;

    // Save to localStorage
    localStorage.setItem('cachedUsers', JSON.stringify(users));

    displayUsers(users);
  } catch (error) {
    // Load from cache if fetch fails
    if (localStorage.getItem('cachedUsers')) {
      allUsers = JSON.parse(localStorage.getItem('cachedUsers'));
      displayUsers(allUsers);
      errorMessage.innerHTML = `<div class="error">⚠ Loaded offline data: ${error.message}</div>`;
    } else {
      errorMessage.innerHTML = `<div class="error">⚠ Failed to fetch data: ${error.message}</div>`;
    }
  } finally {
    loader.style.display = 'none';
  }
}

function displayUsers(users) {
  const userContainer = document.getElementById('user-container');
  userContainer.innerHTML = '';

  users.forEach((user, index) => {
    const card = document.createElement('div');
    card.classList.add('user-card');
    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
      <div class="details">
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      const details = card.querySelector('.details');
      details.style.display = details.style.display === 'block' ? 'none' : 'block';
    });
    userContainer.appendChild(card);

    setTimeout(() => card.classList.add('show'), index * 100); // fade-in effect
  });
}

document.getElementById('searchInput').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = allUsers.filter(u => u.name.toLowerCase().includes(query));
  displayUsers(filtered);
});

document.getElementById('sortSelect').addEventListener('change', e => {
  let sorted = [...allUsers];
  if (e.target.value === 'az') sorted.sort((a,b) => a.name.localeCompare(b.name));
  if (e.target.value === 'za') sorted.sort((a,b) => b.name.localeCompare(a.name));
  displayUsers(sorted);
});

// Load cached or fetch fresh data on first load
fetchUsers();
