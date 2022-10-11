let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

window.onload = () => {
  render();
};

const addTask = () => {
  let input = document.querySelector("input");

  if (!input) {
    alert("Error. Input not avaliable.");
  }

  if (!input.value.trim()) {
    alert("Поле не может быть пустым");
    input.classList.add("invalid");
    return;
  }

  input.classList.remove("invalid");

  allTasks.push({
    text: input.value,
    isCheck: false,
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  input.value = "";

  render();
};

const render = () => {
  const content = document.getElementsByClassName("content")[0];

  if (!content) {
    alert("Error, render not available.");
    return;
  }

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.forEach((element, index) => {
    const { text: textTask, isCheck: checkTask } = element;
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = checkTask;
    checkbox.onchange = () => {
      onChangeCheckbox(index);
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
        changeTask(index);
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
      removeTask(index);
    };

    content.appendChild(container);
  });
};

const onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  allTasks = _.sortBy(allTasks, "isCheck");
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const removeTask = (index) => {
  const flag = confirm("Вы действительно хотите удалить задачу?");
  if (flag) {
    allTasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  }
  render();
};

const changeTask = (index) => {
  const item = document.getElementById(`task-${index}`);

  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }

  const editInput = document.createElement("input");
  editInput.value = allTasks[index].text;
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
    editInput.value.trim() ? confirmChange(editInput.value, index) : alert("Нельзя сохранить задачу без текста");
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

const confirmChange = (editText, index) => {
  allTasks[index].text = editText;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};
