let sumOfExpenses = 0;
const link = 'http://localhost:8080/expenses';

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

const withBody = async (method, body, id) => {
    const finalLink = id ? `${link}/${id}` : link;
    return fetch(finalLink, {
        method,
        headers,
        body: JSON.stringify(body),
    });
};

const withoutBody = async (method, id) => {
    const finalLink = id ? `${link}/${id}` : link;
    return fetch(finalLink, {
        method,
        headers,
    });
};

const sample = (item) => {
    const container = document.getElementById('expensesContainer');
    container.innerHTML = '';
    sumOfExpenses = 0;

    item.forEach((element) => {
        const { id, name, cost, updatedAt } = element;

        sumOfExpenses += Number(cost);

        const sum = document.getElementById('sum');

        const listItem = document.createElement('li');
        const attributes = document.createElement('ul');
        const storeName = document.createElement('li');
        const storeNameEdit = document.createElement('li');
        const storeNameEditField = document.createElement('input');
        const date = document.createElement('li');
        const spent = document.createElement('li');
        const spentAmountEdit = document.createElement('li');
        const spentAmountEditField = document.createElement('input');
        const secondContainer = document.createElement('div');
        const iconContainer = document.createElement('div');

        const editButtons = document.createElement('li');
        const editIcon = document.createElement('i');

        const deleteButtons = document.createElement('li');
        const deleteIcon = document.createElement('i');

        const confirmButtons = document.createElement('li');
        const confirmIcon = document.createElement('i');

        editButtons.className = 'edit-button';
        deleteButtons.className = 'delete-button';
        confirmButtons.className = 'confirm-button';
        date.className = 'date-field';
        spent.className = 'spent-field';
        storeName.className = 'name-field';
        iconContainer.className = 'icon-container';

        confirmIcon.className = `fa-solid fa-check`;
        editIcon.className = 'fa-solid fa-pen';
        deleteIcon.className = 'fa-solid fa-trash';
        attributes.className = `item`;

        storeNameEdit.className = 'name-edit';
        spentAmountEdit.className = 'amount-edit';
        secondContainer.className = 'second-container';
        spentAmountEditField.type = 'number';

        storeNameEditField.style.width = '200px';
        spentAmountEditField.style.width = '100px';

        storeName.innerText = name;
        date.innerText = updatedAt;
        spent.innerText = `$${cost}`;
        sum.innerText = `Sum: $${sumOfExpenses}`;

        editButtons.append(editIcon);
        editIcon.id = id;

        editIcon.addEventListener('click', ({ target }) => {
            const editElReference = {
                confirmButtons,
                target,
                storeName,
                spent,
                storeNameEditField,
                spentAmountEditField,
            };

            // eslint-disable-next-line no-use-before-define
            editExpenseById(editElReference);
        });

        deleteButtons.append(deleteIcon);
        // eslint-disable-next-line no-use-before-define
        deleteButtons.addEventListener('click', () => deleteExpenseById(id));

        confirmButtons.append(confirmIcon);

        confirmIcon.addEventListener('click', () => {
            const confirmElReference = {
                storeNameEditField,
                spentAmountEditField,
                id,
            };

            // eslint-disable-next-line no-use-before-define
            confirmEditById(confirmElReference);
        });

        iconContainer.append(confirmButtons, editButtons, deleteButtons);

        secondContainer.append(date, spent, spentAmountEdit, iconContainer);

        attributes.append(storeName, storeNameEdit, secondContainer);
        storeNameEdit.append(storeNameEditField);
        spentAmountEdit.append(spentAmountEditField);
        listItem.append(attributes);
        container.append(listItem);
    });
};

const createExpense = async () => {
    const spentWhere = document.getElementById('spentWhereInput');
    const spentAmount = document.getElementById('howMuchSpentInput');
    const errors = document.getElementById('error-text');
    errors.innerHTML = '';
    const errorsArray = [];

    if (!spentWhere.value) {
        errorsArray.push('Name Must Not Be Empty!');
    }
    if (Number.isNaN(Number(spentAmount.value)) || !spentAmount.value) {
        errorsArray.push('Spent Amount Must Be A Number!');
    }

    if (errorsArray.length) {
        errors.style.display = 'block';
        errorsArray.forEach((element) => {
            errors.innerHTML += `<li>${element}</li>`;
        });
    } else {
        try {
            const result = await withBody('POST', {
                name: spentWhere.value,
                cost: Number(spentAmount.value),
            });

            const res = await result.json();
            sample(res);

            spentWhere.value = '';
            spentAmount.value = '';
        } catch (error) {
            errors.style.display = 'block';
            errors.innerHTML = `<li>${error}</li>`;
        }
    }
};

const render = async () => {
    const addButton = document.getElementById('addBtn');
    addButton.addEventListener('click', createExpense);

    const url = await withoutBody('GET');
    const item = await url.json();

    if (item.length) {
        sample(item);
    } else {
        document.getElementById('error-text').style.display = 'block';
        document.getElementById('error-text').innerText =
            'There are no expense records';
        document.getElementById('sum').innerText = 'Sum: $0';
        sample(item);
    }
};

window.onload = () => {
    render();
};
