const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const deleteAllBtn = document.getElementById('delete-all');

function createTodoItem(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.gap = '0.9rem';

  const check = document.createElement('button');
  check.className = 'todo-check';
  check.setAttribute('aria-label', 'Mark as complete');

  const span = document.createElement('span');
  span.textContent = text;

  left.appendChild(check);
  left.appendChild(span);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const del = document.createElement('button');
  del.className = 'todo-delete';
  del.setAttribute('aria-label', 'Delete task');
  del.textContent = '✕';

  actions.appendChild(del);

  li.appendChild(left);
  li.appendChild(actions);

  // Animate in
  li.style.opacity = '0';
  li.style.transform = 'translateY(20px)';
  setTimeout(() => {
    li.style.opacity = '1';
    li.style.transform = 'translateY(0)';
  }, 10);

  return li;
}

function updateDeleteAllBtn() {
  deleteAllBtn.disabled = list.children.length === 0;
  if (deleteAllBtn.disabled) {
    deleteAllBtn.style.opacity = '0.5';
    deleteAllBtn.style.cursor = 'not-allowed';
  } else {
    deleteAllBtn.style.opacity = '1';
    deleteAllBtn.style.cursor = 'pointer';
  }
}

function removeAllTasks() {
  const items = Array.from(list.children);
  items.forEach((item, idx) => {
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => item.remove(), 250);
    }, idx * 40); // stagger animation
  });
  setTimeout(updateDeleteAllBtn, items.length * 40 + 260);
}

deleteAllBtn.addEventListener('click', () => {
  if (list.children.length === 0) return;
  removeAllTasks();
});

// Update button state on add/remove
const origCreateTodoItem = createTodoItem;
createTodoItem = function(text) {
  const li = origCreateTodoItem(text);
  setTimeout(updateDeleteAllBtn, 20);
  return li;
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  const item = createTodoItem(value);
  list.appendChild(item);
  input.value = '';
  setTimeout(updateDeleteAllBtn, 20);
});

list.addEventListener('click', e => {
  const target = e.target;
  if (target.classList.contains('todo-check')) {
    const item = target.closest('.todo-item');
    item.classList.toggle('completed');
    target.classList.toggle('checked');
  } else if (target.classList.contains('todo-delete')) {
    const item = target.closest('.todo-item');
    // Animate out
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    setTimeout(() => {
      item.remove();
    }, 250);
  }
  setTimeout(updateDeleteAllBtn, 260);
});

// Initial state
updateDeleteAllBtn(); 