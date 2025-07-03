const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const deleteAllBtn = document.getElementById('delete-all');
const markAllDoneBtn = document.getElementById('mark-all-done');

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

function updateBulkBtns() {
  const hasTasks = list.children.length > 0;
  [markAllDoneBtn, deleteAllBtn].forEach(btn => {
    btn.disabled = !hasTasks;
    btn.style.opacity = hasTasks ? '1' : '0.5';
    btn.style.cursor = hasTasks ? 'pointer' : 'not-allowed';
  });
}

function markAllAsDone() {
  Array.from(list.children).forEach((item, idx) => {
    setTimeout(() => {
      item.classList.add('completed');
      const check = item.querySelector('.todo-check');
      if (check) check.classList.add('checked');
    }, idx * 30);
  });
}

function removeAllTasks() {
  const items = Array.from(list.children);
  items.forEach((item, idx) => {
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => item.remove(), 250);
    }, idx * 40);
  });
  setTimeout(updateBulkBtns, items.length * 40 + 260);
}

markAllDoneBtn.addEventListener('click', () => {
  if (list.children.length === 0) return;
  markAllAsDone();
});

deleteAllBtn.addEventListener('click', () => {
  if (list.children.length === 0) return;
  removeAllTasks();
});

// Update button state on add/remove
const origCreateTodoItem = createTodoItem;
createTodoItem = function(text) {
  const li = origCreateTodoItem(text);
  setTimeout(updateBulkBtns, 20);
  return li;
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  const item = createTodoItem(value);
  list.appendChild(item);
  input.value = '';
  setTimeout(updateBulkBtns, 20);
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
  setTimeout(updateBulkBtns, 260);
});

// Initial state
updateBulkBtns(); 