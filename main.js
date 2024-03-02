const container = document.querySelector('.container');
const refreshBtn = document.querySelector('.refreshBtn');
const errorBlock = document.querySelector('.error-message');
const bodyOverlay = document.querySelector('.body-overlay');
const sortSelect = document.getElementById('sortSelect');
const filterInput = document.getElementById('filterInput');

let users = [];

async function getUsers() {
    try {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
        users = data;
        renderUsers(users);
        hideError();
    } catch (err) {
        console.error(err);
        showError('Failed to fetch users. Please try again later.');
    }
}

function renderUsers(usersData) {
    container.innerHTML = '';
    const sortedUsers = sortUsers(usersData, sortSelect.value);
    const filteredUsers = filterUsers(sortedUsers, filterInput.value.trim());
    filteredUsers.forEach(user => {
        const card = createUserCard(user);
        container.appendChild(card);
    });
}

function sortUsers(usersData, parameter) {
    return [...usersData].sort((a, b) => a[parameter].localeCompare(b[parameter]));
}

function filterUsers(usersData, query) {
    if (!query) return usersData;
    return usersData.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-content">
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
        </div>`;
    return card;
}

function showError(message) {
    errorBlock.textContent = message;
    errorBlock.style.display = 'block';
    bodyOverlay.style.display = 'block';
}

function hideError() {
    errorBlock.style.display = 'none';
    bodyOverlay.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', getUsers);
refreshBtn.addEventListener('click', getUsers);
sortSelect.addEventListener('change', () => renderUsers(users));
filterInput.addEventListener('input', () => renderUsers(users));
