let allTasks = [];
const localhost = 'http://localhost:8080/tasks'
const headers = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

window.onload = () => {
  getAllTasks();
};

const getAllTasks = async () => {
  try {
    const response = await fetch(`${localhost}`, {
      method: "GET",
    });
    const result = await response.json();
    allTasks = result.data;
    render();
  } catch (err) {
    printError('Ошибка получения данных');
  }
}

const addTask = async () => {
  const input = document.querySelector("input");

  if (input === null) {
    return;
  }

  if (!input.value.trim()) {
    input.classList.add("invalid");
    printError("Поле не может быть пустым");
    return;
  }

  input.classList.remove("invalid");

  try {
    const response = await fetch(`${localhost}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: input.value
      }),
    });

    const result = await response.json();
    allTasks.push(result);
    input.value = '';
    render();
  } catch (err) {
    printError('Ошибка добавления');
  }
};

const render = () => {
  const content = document.getElementsByClassName("content")[0];

  if (content === null) {
    return;
  }

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  const copyAllTasks = [...allTasks];
  copyAllTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);

  copyAllTasks.forEach((element) => {
    const { text: textTask, isCheck: checkTask, _id: id } = element;
    const container = document.createElement("div");
    container.id = `task-${id}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = checkTask;
    checkbox.onchange = () => {
      onChangeCheckbox(id);
    };
    container.appendChild(checkbox);
    const text = document.createElement("p");
    text.innerText = textTask;
    text.className = checkTask ? "text-task done-text" : "text-task";
    container.appendChild(text);

    if (!checkTask) {
      const buttonEdit = document.createElement("button");
      buttonEdit.className = "container__button";

      const imageEdit = document.createElement("img");
      imageEdit.src = "./image/edit.svg";
      imageEdit.alt = "Edit";
      imageEdit.className = "container__image";

      buttonEdit.appendChild(imageEdit);
      container.appendChild(buttonEdit);
      buttonEdit.onclick = () => {
        changeTask(id);
      };
    }

    const buttonDelete = document.createElement("button");
    buttonDelete.className = "container__button";

    const imageDelete = document.createElement("img");
    imageDelete.src = "./image/trash.svg";
    imageDelete.alt = "Delete";
    imageDelete.className = "container__image";

    buttonDelete.appendChild(imageDelete);
    container.appendChild(buttonDelete);
    buttonDelete.onclick = () => {
      removeTask(id);
    };

    content.appendChild(container);
  });
};

const onChangeCheckbox = async (id) => {
  try {  
    const task = allTasks.find(element => element._id === id);
    const changeCheck = !task.isCheck;

    const response = await fetch(`${localhost}/ischeck/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        isCheck: changeCheck,
      })
    });

    const result = await response.json();

    allTasks.forEach(element => {
      if (element._id === result._id) {
        element.isCheck = result.isCheck;
      }
    });

    render();
  } catch (err) {
    printError("Ошибка изменения выполнения.");
  }
};

const removeTask = async (id) => {
  try {
    const response = await fetch(`${localhost}/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.deletedCount !== 1) {
      throw new Error();
    }

    allTasks = allTasks.filter(element => element._id !== id);
    render();
  } catch (err) {
    printError('Ошибка удаления');
  }
};

const deleteAllTasks = async () => {
  try {
    const response = await fetch(`${localhost}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.deletedCount !== allTasks.length) {
      throw new Error();
    }

    allTasks = [];
    render();
  } catch (err) {
    printError('Ошибка удаления');
  }
}

const changeTask = (id) => {
  const task = document.getElementById(`task-${id}`);

  if (task === null) {
    return;
  }

  while (task.firstChild) {
    task.removeChild(task.firstChild);
  }

  const editInput = document.createElement("input");
  editInput.value = allTasks.find(element => element._id === id).text;
  editInput.className = "input-data__input";
  task.appendChild(editInput);
  editInput.focus();

  const buttonConfirm = document.createElement("button");
  buttonConfirm.className = "container__button";

  const confirmEdit = document.createElement("img");
  confirmEdit.className = "container__image";
  confirmEdit.src = "./image/check.svg";
  confirmEdit.alt = "confirm";

  buttonConfirm.appendChild(confirmEdit);
  task.appendChild(buttonConfirm);
  buttonConfirm.onclick = () => {
    confirmChange(editInput.value, id);
  };

  const buttonCancel = document.createElement("button");
  buttonCancel.className = "container__button";

  const cancelEdit = document.createElement("img");
  cancelEdit.className = "container__image";
  cancelEdit.src = "./image/times.svg";
  cancelEdit.alt = "cancel";

  buttonCancel.appendChild(cancelEdit);
  task.appendChild(buttonCancel);
  buttonCancel.onclick = () => {
    render();
  };
};

const confirmChange = async (editText, id) => {
  if (editText.trim() === '') {
    printError("Нельзя сохранить задачу без текста");
    return;
  }

  try {
    const response = await fetch(`${localhost}/text/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        text: editText,
      })
    });
    const result = await response.json();

    if (!result) {
      throw new Error();
    }

    allTasks.forEach(element => {
      if (element._id === result._id) {
        element.text = result.text;
      }
    });

    render();
  } catch (err) {
    printError('Ошибка принятия изменений');
  }
};

const printError = (text) => {
  const error = document.getElementById('error_box');
  if (error === null) {
    return;
  }

  error.innerText = text;
}