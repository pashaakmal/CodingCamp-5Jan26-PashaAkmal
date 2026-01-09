const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const filterBtn = document.getElementById("filterBtn");

let todos = [];
let sortOrder = "nearest"; // nearest (terdekat) atau farthest (terlama)

function renderTodos(data = todos) {
    todoList.innerHTML = "";

    if (data.length === 0) {
        todoList.innerHTML = `
            <tr>
                <td colspan="4" class="p-4 text-slate-400">
                    Tidak ada tugas
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((todo, index) => {
        const row = document.createElement("tr");
        row.classList.add("border-b", "border-slate-700");

        // Cek status berdasarkan tanggal
        const todoDate = new Date(todo.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const status = todoDate < today ? "Complete" : "Pending";
        const statusClass = status === "Complete" ? "text-green-400" : "text-yellow-400";

        row.innerHTML = `
            <td class="p-2">${todo.task}</td>
            <td class="p-2">${todo.date}</td>
            <td class="p-2 status ${statusClass}">${status}</td>
            <td class="p-2">
                <button class="delete-btn" onclick="deleteTodo(${index})">
                    Delete
                </button>
            </td>
        `;

        todoList.appendChild(row);
    });
}

todoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = taskInput.value.trim();
    const date = dateInput.value;

    if (task === "" || date === "") {
        alert("Tugas dan tanggal harus diisi!");
        return;
    }

    todos.push({ task, date });
    taskInput.value = "";
    dateInput.value = "";

    renderTodos();
});

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

deleteAllBtn.addEventListener("click", function () {
    if (todos.length === 0) return;

    if (confirm("Hapus semua tugas?")) {
        todos = [];
        renderTodos();
    }
});

filterBtn.addEventListener("click", function () {
    if (todos.length === 0) return;

    // Toggle sort order
    sortOrder = sortOrder === "nearest" ? "farthest" : "nearest";

    // Sort todos berdasarkan kedekatan dengan hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedTodos = [...todos].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Hitung jarak absolut dari hari ini
        const distanceA = Math.abs(dateA - today);
        const distanceB = Math.abs(dateB - today);

        if (sortOrder === "nearest") {
            return distanceA - distanceB; // Yang paling dekat dulu
        } else {
            return distanceB - distanceA; // Yang paling lama dulu
        }
    });

    // Update button text
    filterBtn.textContent = sortOrder === "nearest" ? "Filter (Terdekat)" : "Filter (Terlama)";

    renderTodos(sortedTodos);
});

renderTodos();
