const transactionId = document.getElementById("input-id");
const transactionName = document.getElementById("input-desc");
const transactionAmount = document.getElementById("input-amount");
const transactionDate = document.getElementById("input-date");
const transactionCategory = document.getElementById("input-category");
const listContainer = document.getElementById("list-container");
const addBtn = document.getElementById('add-btn');
const showTrendsBtn = document.getElementById('show-trends');

const trendOverlayDiv = document.querySelector('.trend-overlay');
const closeTrendBtn = document.querySelector('.close-trends');

const totalExpenseSpan = document.querySelector('.total-expense');
const categoryExpenseDiv = document.querySelector('.category-expense');


let data = [];

showTrendsBtn.addEventListener('click', () => {
    trendOverlayDiv.style.display = 'flex';

    let totalExpenses = 0;
    data.forEach((item) => {
        totalExpenses += parseInt(item.amount);
    });
    totalExpenseSpan.innerHTML = totalExpenses;

    // expense per category
    let expensePerCategory = {};
    data.forEach((item) => {
        if(expensePerCategory[item.category]){
            expensePerCategory[item.category] += parseInt(item.amount);
        }
        else{
            expensePerCategory[item.category] = parseInt(item.amount);
        }
    });

    Object.keys(expensePerCategory).forEach((key) => {
        console.log(key, expensePerCategory[key], 'key, value');
        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        let expenseDiv = document.createElement('div');
        expenseDiv.classList.add('expense');

        categoryDiv.innerHTML = key;
        expenseDiv.innerHTML = '$'+expensePerCategory[key];
        categoryExpenseDiv.appendChild(categoryDiv);
        categoryExpenseDiv.appendChild(expenseDiv);
    });
    console.log(expensePerCategory);
});

closeTrendBtn.addEventListener('click', () => {
    trendOverlayDiv.style.display = 'none';
    categoryExpenseDiv.innerHTML = '';
    totalExpenseSpan.innerHTML = '';
});


addBtn.addEventListener('click', () => {
    console.table({
        id: transactionId.value,
        name: transactionName.value,
        amount: transactionAmount.value,
        date: transactionDate.value,
        category: transactionCategory.value
    })
    if(transactionId.value === '' || transactionName.value === '' || transactionAmount.value === '' || transactionDate.value === '' || transactionCategory.value === ''){
        alert("You must fill all the input fields!");
        return;
    }
    else{
        let isAlreadyPresent = false;
        data.forEach((item) => {
            if(item.id === transactionId.value){
                alert("Transaction ID already exists!");
                isAlreadyPresent = true
                return;
            }
        });
        if(isAlreadyPresent){
            return;
        }
        let li = document.createElement("li");
        li.classList.add("list-item-" + transactionId.value);
        li.innerHTML = `
            <div>${transactionId.value}</div>
            <div>${transactionName.value}</div>
            <div>${transactionAmount.value}</div>
            <div>${transactionCategory.value}</div>
            <div>${transactionDate.value}</div>
            <span class="edit edit-btn-${transactionId.value}" data-id="${transactionId.value}"><img src="edit.png" class="edit-img"/></span>
            <span class="dlt dlt-btn-${transactionId.value}">x</span>
        `
        listContainer.appendChild(li);
        console.log(listContainer);

        data.push({
            id: transactionId.value,
            name: transactionName.value,
            amount: transactionAmount.value,
            date: transactionDate.value,
            category: transactionCategory.value
        });

        let dltBtn = document.querySelector(`.dlt-btn-${transactionId.value}`);
        let editBtn = document.querySelector(`.edit-btn-${transactionId.value}`);
        let itemToDelete = document.querySelector(`.list-item-${transactionId.value}`);
        console.log(dltBtn, 'dltBtn');
        console.log(transactionId.value);
        dltBtn.addEventListener('click', function() {
            itemToDelete.remove();
        });

        editBtn.addEventListener('click', ($event) => {
            editHandler($event.target.dataset.id);
        });

        transactionId.value = "";
        transactionName.value = "";
        transactionAmount.value = "";
        transactionDate.value = "";
        transactionCategory.value = "";
    }
});


function showTask(){

    data.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("list-item-" + item.id);
        li.innerHTML = `
            <div>${item.id}</div>
            <div>${item.name}</div>
            <div>${item.amount}</div>
            <div>${item.category}</div>
            <div>${item.date}</div>
            <span class="edit"><img src="edit.png" class="edit-img edit-btn-${item.id}" data-id="${item.id}"/></span>
            <span class="dlt dlt-btn-${item.id}">x</span>
        `
        listContainer.appendChild(li);
        let editBtn = document.querySelector(`.edit-btn-${item.id}`);
        let dltBtn = document.querySelector(`.dlt-btn-${item.id}`);

        // delete button
        dltBtn.addEventListener('click', () => {
            let itemToDelete = document.querySelector(`.list-item-${item.id}`);
            console.log(itemToDelete, 'itemToDelete');
            itemToDelete.remove();
            data = data.filter((i) => i.id !== item.id);
        });

        // edit button
        editBtn.addEventListener('click', ($event) => {
            console.log($event);
            editHandler($event.target.dataset.id);
        });
    });
}

const editOverlay = document.querySelector('.edit-overlay');
const closeEditBtn = document.querySelector('.close-edit');
const editName = document.getElementById("edit-desc");
const editAmount = document.getElementById("edit-amount");
const editDate = document.getElementById("edit-date");
const editCategory = document.getElementById("edit-category");
const editSubmitBtn = document.getElementById("edit-btn");
function editHandler(id){
    console.log(id, 'id');

    editOverlay.style.display = 'flex';

    let itemToEdit = data.find((i) => i.id === id);
    console.log(itemToEdit, 'itemToEdit');

   
    editName.value = itemToEdit.name;
    editAmount.value = itemToEdit.amount;
    editDate.value = itemToEdit.date;
    editCategory.value = itemToEdit.category;

    editSubmitBtn.dataset.id = itemToEdit.id;
}
editSubmitBtn.addEventListener('click',  () => {
    console.log("edit button clicked");
    let itemToEdit = data.find((i) => i.id === editSubmitBtn.dataset.id);
    itemToEdit.name = editName.value;
    itemToEdit.amount = editAmount.value;
    itemToEdit.date = editDate.value;
    itemToEdit.category = editCategory.value;
    console.log(itemToEdit, 'itemToEdit2');
    let itemToEditDiv = document.querySelector(`.list-item-${itemToEdit.id}`);
    itemToEditDiv.innerHTML = `
        <div>${itemToEdit.id}</div>
        <div>${itemToEdit.name}</div>
        <div>${itemToEdit.amount}</div>
        <div>${itemToEdit.category}</div>
        <div>${itemToEdit.date}</div>
        <span class="edit"><img src="edit.png" class="edit-img edit-btn-${itemToEdit.id}" data-id="${itemToEdit.id}"/></span>
        <span class="dlt dlt-btn-${itemToEdit.id}">x</span>
    `

    let editBtn = document.querySelector(`.edit-btn-${itemToEdit.id}`);
    let dltBtn = document.querySelector(`.dlt-btn-${itemToEdit.id}`);

    // delete button
    dltBtn.addEventListener('click', () => {
        let itemToDelete = document.querySelector(`.list-item-${itemToEdit.id}`);
        console.log(itemToDelete, 'itemToDelete');
        itemToDelete.remove();
        data = data.filter((i) => i.id !== itemToEdit.id);
    });

    // edit button
    editBtn.addEventListener('click', ($event) => {
        editHandler($event.target.dataset.id);
    });

    editOverlay.style.display = 'none';

});

closeEditBtn.addEventListener('click', () => {
    editOverlay.style.display = 'none';
});

showTask();