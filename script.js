let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let input = null;

window.onload = () => {
  input = document.querySelector("input"); //document 100% have a input
  input.focus();
  render();
};


const addTask = () => {
  if (!input.value.trim() && input.value !== "0") {
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
  const content = document.getElementsByClassName("content")[0]; //If content === null, we skip next step and started render page 
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.forEach((element, index) => {
    const {text: textTask, isCheck: checkTask} = element;
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
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
  const textValue = allTasks[index].text;
  let buttonArray = item.querySelectorAll(".container__button"); //item && buttonArray cannot be equal to null because if they are null, then the elements do not exist, and if they do not exist, we will not be able to get into this script

  buttonArray.forEach((element) => {
    item.removeChild(element);
  });

  buttonArray = item.querySelector(".text-task");
  item.removeChild(buttonArray);

  const editInput = document.createElement("input");
  editInput.value = textValue;
  editInput.className = "input-data__input";
  item.appendChild(editInput);
  editInput.focus();

  const buttonConfirm = document.createElement("button");
  buttonConfirm.className = "container__button";

  const confirmEdit = document.createElement("img");
  confirmEdit.className = "container__image";
  confirmEdit.src = "./image/check.svg";

  buttonConfirm.appendChild(confirmEdit);
  item.appendChild(buttonConfirm);
  buttonConfirm.onclick = () => {
    confirmChange(editInput.value, index);
  };

  const buttonCancel = document.createElement("button");
  buttonCancel.className = "container__button";

  const cancelEdit = document.createElement("img");
  cancelEdit.className = "container__image";
  cancelEdit.src = "./image/times.svg";

  buttonCancel.appendChild(cancelEdit);
  item.appendChild(buttonCancel);
  buttonCancel.onclick = () => {
    render();
  };
};

const confirmChange = (editText, index) => {
  if (!editText) {
    alert("Нельзя сохранить задачу без текста");

    return render();
  }
  allTasks[index].text = editText;  
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};
