const $ = selector => document.querySelector(selector);
const storeKey = 'fs-panic-team-workspace-v1';
const ADMIN_EMAIL = 'axel348347@gmail.com';
const ADMIN_PASSWORD = 'Axel@7744';
const adminMember = { id: 'member-admin-axel', name: 'Axel', email: ADMIN_EMAIL, role: 'Workspace admin' };
const initialData = {
  members: [
    { id: 'member-sam', name: 'Sam Rivera', email: 'sam@example.com', role: 'Product designer' },
    { id: 'member-jules', name: 'Jules Park', email: 'jules@example.com', role: 'Developer' },
    { id: 'member-taylor', name: 'Taylor Morgan', email: 'taylor@example.com', role: 'Content' },
    adminMember
  ], tasks: [], submissions: [], suggestions: [], attendance: {}
};
let state = loadState();
let activeRole = 'member';
let toastTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey));
    if (saved && Array.isArray(saved.members) && Array.isArray(saved.tasks) && Array.isArray(saved.submissions) && Array.isArray(saved.suggestions)) {
      if (!saved.members.some(member => member.email?.toLowerCase() === ADMIN_EMAIL)) saved.members.push({ ...adminMember });
      return { ...saved, attendance: saved.attendance && typeof saved.attendance === 'object' ? saved.attendance : {} };
    }
  } catch (error) {
    console.warn('Could not load saved workspace data.', error);
  }
  return structuredClone(initialData);
}

function saveState() {
  try {
    localStorage.setItem(storeKey, JSON.stringify(state));
  } catch (error) {
    notify('Could not save this data in browser storage.');
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function notify(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function openAdminEmailDraft(subject, body) {
  const mailto = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function personName(id) {
  return state.members.find(member => member.id === id)?.name || 'Former teammate';
}

function renderMembers() {
  const list = $('#teamList');
  const dayRecord = state.attendance[$('#attendanceDate').value] || {};
  list.innerHTML = state.members.length ? state.members.map(member => `
    <div class="member-entry"><button class="member-chip" type="button" data-member="${escapeHtml(member.id)}" aria-label="Select ${escapeHtml(member.name)}">
      <span class="member-avatar">${escapeHtml(member.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase())}</span>
      <span class="member-meta"><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(member.email)}</small><small class="member-attendance ${dayRecord[member.id] === 'Present' ? 'is-present' : dayRecord[member.id] === 'Absent' ? 'is-absent' : ''}">${dayRecord[member.id] === 'Present' ? 'Present' : dayRecord[member.id] === 'Absent' ? 'Not present' : 'Not recorded'}</small></span>
    </button></div>`).join('') : '<div class="empty-state">No teammates yet. Add someone to build your directory.</div>';
  const previousAssignee = $('#taskAssignee').value;
  const previousSubmissionAuthor = $('#submissionAuthor').value;
  const previousSuggestionAuthor = $('#suggestionAuthor').value;
  const options = state.members.map(member => `<option value="${escapeHtml(member.id)}">${escapeHtml(member.name)} · ${escapeHtml(member.email)}</option>`).join('');
  $('#taskAssignee').innerHTML = options || '<option value="">Add a teammate first</option>';
  $('#submissionAuthor').innerHTML = options || '<option value="">Add a teammate first</option>';
  $('#suggestionAuthor').innerHTML = options || '<option value="">Add a teammate first</option>';
  const defaultAuthorId = state.members.find(member => member.email.toLowerCase() === ADMIN_EMAIL)?.id || state.members[0]?.id || '';
  $('#taskAssignee').value = state.members.some(member => member.id === previousAssignee) ? previousAssignee : state.members[0]?.id || '';
  $('#submissionAuthor').value = state.members.some(member => member.id === previousSubmissionAuthor) ? previousSubmissionAuthor : defaultAuthorId;
  $('#suggestionAuthor').value = state.members.some(member => member.id === previousSuggestionAuthor) ? previousSuggestionAuthor : defaultAuthorId;
  $('#memberCount').textContent = state.members.length;
  applyRole();
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function absenceStreak(memberId, dateKey) {
  let streak = 0;
  const cursor = new Date(`${dateKey}T00:00:00`);
  while (state.attendance[localDateKey(cursor)]?.[memberId] === 'Absent') {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function renderAttendance() {
  const date = $('#attendanceDate').value;
  const dayRecord = state.attendance[date] || {};
  $('#attendanceList').innerHTML = state.members.length ? state.members.map(member => `
    <div class="attendance-row"><div class="attendance-person"><strong>${escapeHtml(member.name)}</strong><a href="mailto:${encodeURIComponent(member.email)}">${escapeHtml(member.email)}</a></div><label class="attendance-status">Status<select data-attendance-member="${escapeHtml(member.id)}" ${activeRole !== 'admin' ? 'disabled' : ''}><option value="">Not recorded</option><option value="Present" ${dayRecord[member.id] === 'Present' ? 'selected' : ''}>Present</option><option value="Absent" ${dayRecord[member.id] === 'Absent' ? 'selected' : ''}>Absent</option></select></label></div>`).join('') : '<div class="empty-state">Add teammates to start tracking attendance.</div>';
  const present = state.members.filter(member => dayRecord[member.id] === 'Present').length;
  const absent = state.members.filter(member => dayRecord[member.id] === 'Absent').length;
  $('#attendanceSummary').textContent = `${present} PRESENT · ${absent} ABSENT`;
  const flagged = state.members.map(member => ({ member, streak: absenceStreak(member.id, date) })).filter(entry => entry.streak >= 3);
  $('#attendanceWarnings').innerHTML = flagged.length ? flagged.map(({ member, streak }) => {
    const subject = encodeURIComponent('Attendance follow-up');
    const body = encodeURIComponent(`Hi ${member.name},\n\nOur attendance record shows you have been absent for ${streak} consecutive recorded days. Please check in with the team and let us know if you need support.\n\nThank you.`);
    return `<article class="attendance-warning"><div><strong>${escapeHtml(member.name)}</strong><span>${streak} consecutive absent days</span><a href="mailto:${encodeURIComponent(member.email)}">${escapeHtml(member.email)}</a></div>${activeRole === 'admin' ? `<a class="warning-mail" href="mailto:${encodeURIComponent(member.email)}?subject=${subject}&body=${body}">Prepare warning email ↗</a>` : ''}</article>`;
  }).join('') : '<div class="empty-state">No three-day absence warnings for this date. Attendance needs to be recorded for each day.</div>';
  renderAttendanceHistory();
}

function renderAttendanceHistory() {
  const dates = Object.keys(state.attendance).filter(date => state.attendance[date] && typeof state.attendance[date] === 'object').sort((a, b) => b.localeCompare(a));
  $('#attendanceHistoryCount').textContent = `${dates.length} ${dates.length === 1 ? 'DAY' : 'DAYS'}`;
  $('#attendanceHistory').innerHTML = dates.length ? dates.map(date => {
    const record = state.attendance[date];
    const present = state.members.filter(member => record[member.id] === 'Present').length;
    const absent = state.members.filter(member => record[member.id] === 'Absent').length;
    const people = state.members.length ? state.members.map(member => {
      const status = record[member.id] || 'Not recorded';
      return `<div class="attendance-history-person"><span>${escapeHtml(member.name)}</span><span class="history-status ${status === 'Present' ? 'is-present' : status === 'Absent' ? 'is-absent' : ''}">${escapeHtml(status)}</span></div>`;
    }).join('') : '<p class="form-hint">No current team members.</p>';
    return `<article class="attendance-history-day"><div class="attendance-history-heading"><strong>${escapeHtml(date)}</strong><span class="micro-label">${present} PRESENT · ${absent} ABSENT</span><button class="status-button" type="button" data-attendance-history-date="${escapeHtml(date)}">Open date</button></div><div class="attendance-history-people">${people}</div></article>`;
  }).join('') : '<div class="empty-state">Saved daily attendance will appear here for future reference.</div>';
}

function renderTasks() {
  const currentMember = $('#submissionAuthor').value;
  const tasks = activeRole === 'admin' ? state.tasks : state.tasks.filter(task => task.assigneeId === currentMember);
  $('#taskBoardLabel').textContent = activeRole === 'admin' ? 'ALL TASKS' : 'YOUR TASKS';
  $('#taskList').innerHTML = tasks.length ? tasks.slice().reverse().map(task => `
    <article class="task-card"><div class="task-top"><div><h4>${escapeHtml(task.title)}</h4><p>${escapeHtml(task.description || 'No additional instructions.')}</p></div>${activeRole === 'admin' ? `<div class="task-actions"><button class="status-button" type="button" data-task="${escapeHtml(task.id)}">${task.status === 'Done' ? 'Reopen' : 'Mark done'}</button><button class="delete-button" type="button" data-delete-task="${escapeHtml(task.id)}" aria-label="Delete ${escapeHtml(task.title)}">Delete</button></div>` : ''}</div>
      <div class="task-meta"><span class="tag">${escapeHtml(task.category)}</span><span>${escapeHtml(personName(task.assigneeId))}</span>${task.due ? `<span>Due ${escapeHtml(task.due)}</span>` : ''}<span class="priority ${task.priority.toLowerCase()}">${escapeHtml(task.priority)} priority</span><span>${escapeHtml(task.status)}</span></div></article>`).join('') : `<div class="empty-state">${activeRole === 'admin' ? 'No tasks assigned yet. Create your first task using the form.' : 'No tasks assigned to this teammate yet.'}</div>`;
  const taskOptions = tasks.filter(task => task.status !== 'Done').map(task => `<option value="${escapeHtml(task.id)}">${escapeHtml(task.title)}</option>`).join('');
  $('#submissionTask').innerHTML = `<option value="">No task selected</option>${taskOptions}`;
  $('#taskCount').textContent = state.tasks.filter(task => task.status !== 'Done').length;
}

function makePreviewDocument(html, css, js) {
  const safeCss = String(css || '').replace(/<\/style/gi, '<\\/style');
  const safeJs = String(js || '').replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:Arial,sans-serif;padding:16px;color:#222}${safeCss}</style></head><body>${html || ''}<script>${safeJs}${String.fromCharCode(60)}/script></body></html>`;
}

function renderSubmissions() {
  $('#feedCount').textContent = `${state.submissions.length} ${state.submissions.length === 1 ? 'ITEM' : 'ITEMS'}`;
  $('#submissionCount').textContent = state.submissions.length;
  const items = state.submissions.slice().reverse();
  $('#submissionFeed').innerHTML = items.length ? items.map(item => {
    let body = '';
    if (item.type === 'text') body = `<p>${escapeHtml(item.text).replace(/\n/g, '<br>')}</p><div class="feed-meta"><span>${(item.text.trim().match(/\S+/g) || []).length} words</span><span>${item.text.length} characters</span></div>`;
    if (item.type === 'image') body = item.imageUrl ? `<a href="${escapeHtml(item.imageUrl)}" target="_blank" rel="noopener"><img class="feed-image" src="${escapeHtml(item.imageUrl)}" alt="Submitted work by ${escapeHtml(item.author)}"></a>` : '<p>Image preview is available in the browser session where it was selected.</p>';
    if (item.type === 'code') body = `<p>HTML, CSS, and JavaScript submission${item.taskTitle ? ` for ${escapeHtml(item.taskTitle)}` : ''}.</p><pre>${escapeHtml(item.html || '')}</pre><iframe class="feed-preview" title="Live preview of ${escapeHtml(item.taskTitle || 'submitted code')}" sandbox="allow-scripts" data-preview="${escapeHtml(item.id)}"></iframe><div class="feed-actions"><button class="copy-button" type="button" data-copy="${escapeHtml(item.id)}">Copy code</button></div>`;
    return `<article class="feed-card"><div class="feed-top"><div><h4>${escapeHtml(item.taskTitle || item.typeLabel)}</h4><span class="feed-type">${escapeHtml(item.typeLabel.toUpperCase())} · BY ${escapeHtml(item.author.toUpperCase())}</span></div><div class="feed-tools"><time class="micro-label">${escapeHtml(item.date)}</time>${activeRole === 'admin' ? `<button class="delete-button" type="button" data-delete-submission="${escapeHtml(item.id)}" aria-label="Delete submitted project">Delete</button>` : ''}</div></div>${body}${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}</article>`;
  }).join('') : '<div class="empty-state">Submitted work will show up here for the team to review.</div>';
  $('#submissionFeed').querySelectorAll('[data-preview]').forEach(frame => {
    const item = state.submissions.find(submission => submission.id === frame.dataset.preview);
    if (item) frame.srcdoc = makePreviewDocument(item.html, item.css, item.js);
  });
}

function renderSuggestions() {
  $('#suggestionCount').textContent = state.suggestions.length;
  $('#suggestionList').innerHTML = state.suggestions.length ? state.suggestions.slice().reverse().map(item => `
    <article class="suggestion-card"><div class="suggestion-top"><strong>${escapeHtml(item.author)}</strong><time>${escapeHtml(item.date)}</time>${activeRole === 'admin' ? `<button class="delete-button" type="button" data-suggestion="${escapeHtml(item.id)}" aria-label="Delete suggestion">Delete</button>` : ''}</div><p>${escapeHtml(item.message)}</p></article>`).join('') : '<div class="empty-state">No ideas posted yet. Start the conversation.</div>';
}

function applyRole() {
  const isAdmin = activeRole === 'admin';
  document.body.classList.toggle('member-view', !isAdmin);
  $('#adminLoginOpen').hidden = isAdmin;
  $('#adminLogout').hidden = !isAdmin;
  const currentId = $('#submissionAuthor')?.value;
  if (activeRole === 'member' && currentId) {
    $('#taskAssignee').value = currentId;
    $('#suggestionAuthor').value = currentId;
  }
  renderTasks();
  renderSuggestions();
  renderAttendance();
}

function previewCode() {
  $('#codePreview').srcdoc = makePreviewDocument($('#codeHtml').value, $('#codeCss').value, $('#codeJs').value);
}

$('#attendanceDate').addEventListener('change', renderMembers);
$('#attendanceHistory').addEventListener('click', event => {
  const button = event.target.closest('[data-attendance-history-date]');
  if (!button || activeRole !== 'admin') return;
  $('#attendanceDate').value = button.dataset.attendanceHistoryDate;
  renderMembers();
});
$('#attendanceForm').addEventListener('submit', event => {
  event.preventDefault();
  if (activeRole !== 'admin') return notify('Sign in as Admin to record attendance.');
  const date = $('#attendanceDate').value;
  const record = {};
  $('#attendanceList').querySelectorAll('[data-attendance-member]').forEach(select => {
    if (select.value) record[select.dataset.attendanceMember] = select.value;
  });
  state.attendance[date] = record;
  saveState();
  renderMembers();
  notify('Attendance saved.');
});

$('#memberForm').addEventListener('submit', event => {
  event.preventDefault();
  if (activeRole !== 'admin') return notify('Only the admin can add teammates in this demo.');
  const email = $('#memberEmail').value.trim().toLowerCase();
  if (state.members.some(member => member.email.toLowerCase() === email)) return notify('That email is already in the team directory.');
  const member = { id: makeId(), name: $('#memberName').value.trim(), email, role: $('#memberRole').value.trim() || 'Team member' };
  state.members.push(member);
  saveState();
  event.target.reset();
  renderMembers();
  $('#taskAssignee').value = member.id;
  $('#submissionAuthor').value = member.id;
  $('#suggestionAuthor').value = member.id;
  renderTasks();
  notify(`${member.name} added to the team.`);
});

$('#teamList').addEventListener('click', event => {
  const chip = event.target.closest('[data-member]');
  if (!chip) return;
  const id = chip.dataset.member;
  $('#taskAssignee').value = id;
  $('#submissionAuthor').value = id;
  $('#suggestionAuthor').value = id;
  $('#teamList').querySelectorAll('.member-chip').forEach(button => button.classList.toggle('selected', button === chip));
  renderTasks();
  notify(`${personName(id)} selected.`);
});

$('#taskForm').addEventListener('submit', event => {
  event.preventDefault();
  if (activeRole !== 'admin') return notify('Switch to Admin view to assign tasks.');
  const assigneeId = $('#taskAssignee').value;
  const assignee = state.members.find(member => member.id === assigneeId);
  if (!assignee) return notify('Add a teammate before assigning a task.');
  const task = { id: makeId(), assigneeId, title: $('#taskTitle').value.trim(), category: $('#taskCategory').value, description: $('#taskDescription').value.trim(), due: $('#taskDue').value, priority: $('#taskPriority').value, status: 'Pending', createdAt: Date.now() };
  state.tasks.push(task);
  saveState();
  renderTasks();
  const subject = encodeURIComponent(`New task: ${task.title}`);
  const body = encodeURIComponent(`Hi ${assignee.name},\n\nA new task has been assigned to you.\n\nTask: ${task.title}\nCategory: ${task.category}\nDeadline: ${task.due || 'Not specified'}\nPriority: ${task.priority}\n\nInstructions:\n${task.description || 'No additional instructions.'}`);
  event.target.reset();
  $('#taskAssignee').value = assigneeId;
  notify(`Task saved for ${assignee.name}. Opening an email draft…`);
  window.location.href = `mailto:${encodeURIComponent(assignee.email)}?subject=${subject}&body=${body}`;
});

$('#taskList').addEventListener('click', event => {
  if (activeRole !== 'admin') return notify('Sign in as Admin to manage tasks.');
  const deleteButton = event.target.closest('[data-delete-task]');
  if (deleteButton) {
    const task = state.tasks.find(item => item.id === deleteButton.dataset.deleteTask);
    if (!task || !window.confirm(`Delete the task “${task.title}”?`)) return;
    state.tasks = state.tasks.filter(item => item.id !== task.id);
    saveState();
    renderTasks();
    notify('Task deleted.');
    return;
  }
  const button = event.target.closest('[data-task]');
  if (!button) return;
  const task = state.tasks.find(item => item.id === button.dataset.task);
  if (!task) return;
  task.status = task.status === 'Done' ? 'Pending' : 'Done';
  saveState();
  renderTasks();
});

$('#submissionType').addEventListener('change', () => {
  const type = $('#submissionType').value;
  $('#textFields').classList.toggle('hidden', type !== 'text');
  $('#imageFields').classList.toggle('hidden', type !== 'image');
  $('#codeFields').classList.toggle('hidden', type !== 'code');
  if (type === 'code') previewCode();
});

$('#submissionText').addEventListener('input', () => {
  const text = $('#submissionText').value;
  $('#textCount').textContent = `${(text.trim().match(/\S+/g) || []).length} words · ${text.length} characters`;
});
['#codeHtml', '#codeCss', '#codeJs'].forEach(selector => $(selector).addEventListener('input', previewCode));
$('#submissionImage').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 700 * 1024) {
    event.target.value = '';
    return notify('Choose an image smaller than 700 KB for this browser demo.');
  }
  const reader = new FileReader();
  reader.onload = () => { $('#submissionImageUrl').value = String(reader.result); };
  reader.readAsDataURL(file);
});

$('#submissionForm').addEventListener('submit', event => {
  event.preventDefault();
  const type = $('#submissionType').value;
  const authorId = $('#submissionAuthor').value;
  const author = state.members.find(member => member.id === authorId);
  if (!author) return notify('Add a teammate before submitting work.');
  const task = state.tasks.find(item => item.id === $('#submissionTask').value);
  const item = { id: makeId(), type, typeLabel: type === 'text' ? 'Text content' : type === 'image' ? 'Graphics / photo' : 'Coding', author: author.name, taskTitle: task?.title || '', note: $('#submissionNote').value.trim(), date: new Date().toLocaleDateString(), createdAt: Date.now() };
  if (type === 'text') {
    item.text = $('#submissionText').value.trim();
    if (!item.text) return notify('Add your text before submitting.');
  } else if (type === 'image') {
    item.imageUrl = $('#submissionImageUrl').value.trim();
    if (!item.imageUrl) return notify('Choose an image or provide an image URL.');
  } else {
    item.html = $('#codeHtml').value;
    item.css = $('#codeCss').value;
    item.js = $('#codeJs').value;
    if (!item.html && !item.css && !item.js) return notify('Add some code before submitting.');
  }
  state.submissions.push(item);
  saveState();
  renderSubmissions();
  event.target.reset();
  $('#submissionAuthor').value = state.members.find(member => member.email.toLowerCase() === ADMIN_EMAIL)?.id || state.members[0]?.id || '';
  $('#submissionType').value = 'text';
  $('#textFields').classList.remove('hidden');
  $('#imageFields').classList.add('hidden');
  $('#codeFields').classList.add('hidden');
  $('#submissionImageUrl').value = '';
  $('#textCount').textContent = '0 words · 0 characters';
  previewCode();
  notify('Your work has been added. An email draft is opening for the admin.');
  openAdminEmailDraft('New team submission', `A new submission was added to the team workspace.\n\nSubmitted by: ${item.author}\nWork type: ${item.typeLabel}\nRelated task: ${item.taskTitle || 'None'}\nDate: ${item.date}\nNote: ${item.note || 'None'}`);
});

$('#submissionFeed').addEventListener('click', async event => {
  const deleteButton = event.target.closest('[data-delete-submission]');
  if (deleteButton) {
    if (activeRole !== 'admin') return notify('Only the admin can delete submitted work.');
    const item = state.submissions.find(submission => submission.id === deleteButton.dataset.deleteSubmission);
    if (!item || !window.confirm('Delete this submitted project? This cannot be undone.')) return;
    state.submissions = state.submissions.filter(submission => submission.id !== item.id);
    saveState();
    renderSubmissions();
    notify('Submitted project deleted.');
    return;
  }
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  const item = state.submissions.find(submission => submission.id === button.dataset.copy);
  if (!item) return;
  const source = `HTML:\n${item.html || ''}\n\nCSS:\n${item.css || ''}\n\nJavaScript:\n${item.js || ''}`;
  try {
    await navigator.clipboard.writeText(source);
    notify('Code copied to clipboard.');
  } catch {
    notify('Clipboard access is unavailable in this browser.');
  }
});

$('#suggestionForm').addEventListener('submit', event => {
  event.preventDefault();
  const author = state.members.find(member => member.id === $('#suggestionAuthor').value);
  const message = $('#suggestionText').value.trim();
  if (!author) return notify('Add a teammate before posting.');
  if (!message) return notify('Write a suggestion first.');
  state.suggestions.push({ id: makeId(), author: author.name, message, date: new Date().toLocaleString() });
  saveState();
  event.target.reset();
  $('#suggestionAuthor').value = state.members.find(member => member.email.toLowerCase() === ADMIN_EMAIL)?.id || state.members[0]?.id || '';
  renderSuggestions();
  notify('Suggestion posted. An email draft is opening for the admin.');
  openAdminEmailDraft('New team suggestion', `A new suggestion was posted to the team workspace.\n\nFrom: ${author.name}\nDate: ${new Date().toLocaleString()}\n\nSuggestion:\n${message}`);
});

$('#suggestionList').addEventListener('click', event => {
  const button = event.target.closest('[data-suggestion]');
  if (!button) return;
  if (activeRole !== 'admin') return notify('Only the admin can delete suggestions.');
  state.suggestions = state.suggestions.filter(item => item.id !== button.dataset.suggestion);
  saveState();
  renderSuggestions();
  notify('Suggestion deleted.');
});

$('#adminLoginOpen').addEventListener('click', () => $('#adminLoginDialog').showModal());
$('#adminLoginClose').addEventListener('click', () => $('#adminLoginDialog').close());
$('#adminLoginForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = $('#adminEmail').value.trim().toLowerCase();
  const password = $('#adminPassword').value;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    $('#adminPassword').value = '';
    return notify('Incorrect admin email or password.');
  }
  activeRole = 'admin';
  $('#adminLoginDialog').close();
  event.target.reset();
  $('#adminEmail').value = ADMIN_EMAIL;
  applyRole();
  renderMembers();
  notify('Admin signed in.');
});
$('#adminLogout').addEventListener('click', () => {
  activeRole = 'member';
  applyRole();
  renderMembers();
  notify('Signed out of Admin.');
});
$('#submissionAuthor').addEventListener('change', () => { if (activeRole === 'member') applyRole(); });

const menuToggle = $('#menuToggle');
const siteNav = $('#siteNav');
menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
siteNav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
});

$('#attendanceDate').value = localDateKey(new Date());
renderMembers();
renderTasks();
renderSubmissions();
renderSuggestions();
previewCode();
