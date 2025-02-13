document.addEventListener("DOMContentLoaded", () => {
    const accountsContainer = document.getElementById("accountsContainer");
    const accountsList = JSON.parse(accountsContainer.dataset.accounts);

    console.log(accountsList);

    // Create Tablet
    const table = document.createElement("table");
    table.id = "accountTable"

    // Create Header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["First Name", "Last Name", "Email", "Type"].forEach(text => {
        let th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table's body
    const tbody = document.createElement("tbody");
    accountsList.forEach(account => {
        let row = document.createElement("tr");
        ["account_firstname", "account_lastname", "account_email", "account_type"].forEach(key => {
            let td = document.createElement("td");
            td.textContent = account[key];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    accountsContainer.appendChild(table);
});
