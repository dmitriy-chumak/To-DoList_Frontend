let allTasks = [];
const headers = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

window.onload = async () => {
  getTaskFromDB();
};

const getTaskFromDB = async () => {
  try {
    const respon = await fetch('http://localhost:8080/tasks', {
      method: "GET",
    });
    const result = await respon.json();
    allTasks = result.data;
    render();
  } catch (e) {
    printError('Ошибка загрузки');
  }
}

const addTask = async () => {
  const input = document.querySelector("input");

  if (input === null) {
    return printError("Ошибка добавления");
  }

  if (!input.value.trim()) {
    input.classList.add("invalid");
    return printError("Поле не может быть пустым");
  }

  input.classList.remove("invalid");

  try {
    const respon = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: input.value
      }),
    });

    const result = await respon.json();
    allTasks.push(result);
    input.value = '';

    render();
  } catch (e) {
    printError('Ошибка добавления');
  }
};

const render = () => {
  const content = document.getElementsByClassName("content")[0];

  if (!content) {
    return printError("Ошибка рендера");
  }

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  const copyAllTasks = [...allTasks];
  copyAllTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);

  copyAllTasks.forEach((element) => {
    const id = element._id;

    const { text: textTask, isCheck: checkTask } = element;
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

    if (!element.isCheck) {
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

    const respon = await fetch(`http://localhost:8080/tasks/isCheck/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        isCheck: changeCheck,
      })
    });

    const result = await respon.json();

    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i]._id === result._id) {
        allTasks[i].isCheck = changeCheck;
        return render();
      }
    }

    throw new Error();
  } catch (e) {
    printError("Ошибка изменения выполнения.");
  }
};

const removeTask = async (id) => {
  try {
    const respon = await fetch(`http://localhost:8080/tasks/${id}`, {
      method: "DELETE",
    });

    const result = await respon.json();

    if (result.deletedCount != 1) {
      throw new Error();
    }

    allTasks.forEach((element, index) => {
      if (element._id === id) {
        allTasks.splice(index, 1);
      }
    });

    render();
  } catch (error) {
    printError('Ошибка удаления');
  }
};

const deleteAll = async () => {
  try {
    const respon = await fetch(`http://localhost:8080/tasks`, {
      method: "DELETE",
    });
    
    const result = await respon.json();

    if (result.deletedCount !== allTasks.length) {
      throw new Error();
    }

    allTasks = [];
    render();
  } catch (error) {
    printError('Ошибка удаления');
  }
}

const changeTask = (id) => {
  const item = document.getElementById(`task-${id}`);

  if (item === null) {
    return printError('Ошибка');
  }

  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }

  const editInput = document.createElement("input");
  editInput.value = allTasks.find(element => element._id === id).text;
  editInput.className = "input-data__input";
  item.appendChild(editInput);
  editInput.focus();

  const buttonConfirm = document.createElement("button");
  buttonConfirm.className = "container__button";

  const confirmEdit = document.createElement("img");
  confirmEdit.className = "container__image";
  confirmEdit.src = "./image/check.svg";
  confirmEdit.alt = "confirm";

  buttonConfirm.appendChild(confirmEdit);
  item.appendChild(buttonConfirm);
  buttonConfirm.onclick = () => {
    editInput.value.trim() ? confirmChange(editInput.value, id) : alert("Нельзя сохранить задачу без текста");
  };

  const buttonCancel = document.createElement("button");
  buttonCancel.className = "container__button";

  const cancelEdit = document.createElement("img");
  cancelEdit.className = "container__image";
  cancelEdit.src = "./image/times.svg";
  cancelEdit.alt = "cancel";

  buttonCancel.appendChild(cancelEdit);
  item.appendChild(buttonCancel);
  buttonCancel.onclick = () => {
    render();
  };
};

const confirmChange = async (editText, id) => {
  try {
    const respon = await fetch(`http://localhost:8080/tasks/text/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        text: editText,
      })
    });

    const result = await respon.json();
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i]._id === result._id) {
        allTasks[i].text = editText;
        return render();
      }
    }

    throw new Error();
  } catch (e) {
    printError('Ошибка принятия изменений');
  }
};

const printError = (text) => {
  let error = document.getElementById('errorBox1');
  if (!error) {
    alert('Ошибка! перезагрузите страницу');
    return;
  }

  error.innerText = text;
  return;
}