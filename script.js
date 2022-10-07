let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let input = null;
let valueInput = "";

window.onload = () => {
  input = document.getElementsByClassName("input-data__input")[0];
  input.addEventListener("change", getInputValue);
  input.focus();
  render();
};

getInputValue = (event) => {
  valueInput = event.target.value;
};

onClickButton = () => {
  if (!valueInput.trim() && valueInput !== "0") {
    alert("Поле не может быть пустым");
    input.classList.add("invalid");
    return;
  }

  input.classList.remove("invalid");

  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  valueInput = "";
  input.value = "";

  render();
};

render = () => {
  const content = document.getElementsByClassName("content")[0];
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.map((element, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = element.isCheck;
    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);
    const text = document.createElement("p");
    text.innerText = element.text;
    text.className = element.isCheck ? "text-task done-text" : "text-task";
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
        editClick(index);
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
      deleteClick(index);
    };

    content.appendChild(container);
  });
};

onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  allTasks = _.sortBy(allTasks, "isCheck");
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

deleteClick = (index) => {
  const flag = confirm("Вы действительно хотите удалить задачу?");
  if (flag) {
    allTasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    render();
  }
  render();
};

editClick = (index) => {
  let item = document.getElementById(`task-${index}`);
  let textValue = allTasks[index].text;
  let child = item.querySelectorAll(".container__button");
  child.forEach((element) => {
    item.removeChild(element);
  });

  child = item.querySelector(".text-task");
  item.removeChild(child);

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

confirmChange = (editText, index) => {
  if (!editText) {
    alert("Нельзя сохранить задачу без текста");
    return render();
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  allTasks[index].text = editText;
  render();
};
