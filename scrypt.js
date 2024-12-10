const input = document.querySelector('input');
const resultContainer = document.getElementById('results-container');
const saveContainer = document.querySelector('.save-container');

//Сохранение репозиториев
function saveRepo(repo){
        const divSaveCont = document.createElement('div');
        divSaveCont.classList.add('save-container__repos');

        const btnClose = document.createElement('button');
        btnClose.classList.add('btn-repos-close');
        btnClose.addEventListener('click', function(){
            this.parentNode.remove();
        });
        divSaveCont.appendChild(btnClose);

        const repoItemName = document.createElement('li');
        repoItemName.textContent = `Name: ${repo.name}`;
        divSaveCont.appendChild(repoItemName);

        const repoItemOwner = document.createElement('li');
        repoItemOwner.textContent = `Owner: ${repo.owner.login}`;
        divSaveCont.appendChild(repoItemOwner);

        const repoItemStar = document.createElement('li');
        repoItemStar.textContent = `Stars: ${repo.stargazers_count}`;
        divSaveCont.appendChild(repoItemStar);

        saveContainer.prepend(divSaveCont);
}

// Задержка ввода 
function debounce(func, delay = 400){
    let timeoutId;
    return function(...args){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay)
    }
}

//Функция для поиска
async function searchRep(){
    try{
        const query = input.value;
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
        if (!response.ok){
            throw new Error(`Error`);
        }
        const data = await response.json();
        console.log(data);

        const repositories = data.items.slice(0,5);
        resultContainer.innerHTML = '';

        if (repositories.length > 0){
            resultContainer.style.display = 'block';

            repositories.forEach(repo => {
                const repoItem = document.createElement('li');
                repoItem.textContent = repo.name;
                repoItem.addEventListener('click', () => {
                    input.value = '';
                    resultContainer.style.display ='none';
                    saveRepo(repo);
                });
                resultContainer.appendChild(repoItem);
            });
        }
        else{
            resultContainer.style.display = 'none';
        }
    }
    catch(error){
        console.error(`error`);
        resultContainer.style.display = 'none';
    }
}


//Класс для поиска реп
class Search{
    constructor(input){
        this.input = input;
        const debounceSearch = debounce(searchRep);
        this.input.addEventListener('input' , debounceSearch)
    }
}
const search = new Search(input);


