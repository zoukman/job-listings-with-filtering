"use strict";

import { users } from "./users.js";

const $main = document.querySelector("#container-main");
let techsCounter = 0;

const usersObj = {};

users.forEach(user => {
   

    $main.insertAdjacentHTML(
        "beforeend",
        `
            <div class="user" id="user${user.id}">
                <div class="media__top">

                
                    <div class="user__l1-logo">
                        <image class="user__l2-logo" src="${user.logo}" alt="company name"> </image>
                    </div>
                

                    <div class="user__l1-company">
                        <div class="user__l2-company">
                            ${user.company}
                        </div>

                        <div class="user__l2-new user__l2-notifications hidden">
                            NEW!
                        </div>

                        <div class="user__l2-featured user__l2-notifications hidden">
                            FEATURED
                        </div>
                    </div>


                    <div class="user__l1-position">
                        <div class="user__l2-position">
                            ${user.position}
                        </div>
                    </div>


                    <div class="user__l1-information">
                        <div class="user__l2-posted">
                            ${user.postedAt}
                        </div>

                        <div class="user__l2-contract">
                            ${user.contract}
                        </div>

                        <div class="user__l2-location">
                            ${user.location}
                        </div>
                    </div>

                </div>

                <div class="media__bottom">
                    <div class="user__hr"></div>
                    <div class="user__l1-techs"></div>
                </div>
            </div>
   
    `
    );

    if (user.new) {
        const userL2New = document.querySelectorAll(".user__l2-new");
        userL2New[userL2New.length - 1].classList.toggle("hidden");
    }

    if (user.featured) {
        const userL2Featured = document.querySelectorAll(".user__l2-featured");
        userL2Featured[userL2Featured.length - 1].classList.toggle("hidden");
    }

    // созданим массив всех юзеров
    let $user = document.querySelectorAll(".user");

    if (user.new && user.featured) {
        $user[$user.length - 1].classList.toggle('border-left');
    }

    // ----------------------------------------------------------
    // будем создавать фильтер-кнопки в user__l1-techs блоке
    // ----------------------------------------------------------

    // созданим массив фильтер-блоков всех юзеров
    const $userL1TechsAll = document.querySelectorAll('.user__l1-techs');


    // созданим разметку для ключа role
    $userL1TechsAll[techsCounter].insertAdjacentHTML('beforeend', `
        <div class="user__l2-tech ${user.role.toLowerCase()}">
            ${user.role}
        </div>
    `);

    // созданим разметку для ключа level
    $userL1TechsAll[techsCounter].insertAdjacentHTML('beforeend', `
        <div class="user__l2-tech ${user.level.toLowerCase()}">
            ${user.level}
        </div>
    `);

    // создадим разметку для ключа languages
    user.languages.forEach(lang => {
        $userL1TechsAll[techsCounter].insertAdjacentHTML('beforeend', `
            <div class="user__l2-tech ${lang.toLowerCase()}">
                ${lang}
            </div>
        `);  
    });

    // создадим разметку для ключа tools
    user.tools.forEach(tool => {
        $userL1TechsAll[techsCounter].insertAdjacentHTML('beforeend', `
            <div class="user__l2-tech ${tool.toLowerCase()}">
                ${tool}
            </div>
        `);  
    });

    techsCounter++;

    // все фильтр-кнопки юзера мы добавляли в их собственный массив
    usersObj[user.id] = new Array();
    usersObj[user.id].push(user.role.toLowerCase());
    usersObj[user.id].push(user.level.toLowerCase());
    // добавляем фильтр-кнопки в массив онных
    user.languages.forEach(lang => {
        usersObj[user.id].push(lang.toLowerCase());
    });
    user.tools.forEach(tool => {
        usersObj[user.id].push(tool.toLowerCase());
    });

});


// --------------------------------------------------------------
// будем слушать фильтр-кнопки, чтобы добавлять их в блок clear
// --------------------------------------------------------------

// созданим массив всех фильтр-кнопок
const $userL2TechAll = document.querySelectorAll('.user__l2-tech');
// сюда будем их добавлять при клике
const $filtersL1Content = document.querySelector('.filters__l1-content');
// в этом массиве храняется список классов фильтр-кнопок которые мы добавляли
let filterButtonsArray = [];

$userL2TechAll.forEach(filterButton => {
    filterButton.addEventListener('click', () => {

        if (!filterButtonsArray.includes(filterButton.textContent.trim().toLowerCase())) {
            $filtersL1Content.insertAdjacentHTML('beforeend', `
                <div class="user__l2-tech-filter ${filterButton.textContent.trim().toLowerCase()} ${filterButton.textContent.trim().toLowerCase()}--filter">
                    ${filterButton.textContent.trim()}
                    <div class="filters__cross filters__cross--${filterButton.textContent.trim().toLowerCase()}"> </div>
                </div>
            `);    

            filterButtonsArray.push(filterButton.textContent.trim().toLowerCase());
            document.querySelector('.filters').classList.remove('hidden');

            

            // ---------------------------------------------------------------------
            // будем слушать крестики кнопок-фильтров, если клинкут, то удалим их
            // ---------------------------------------------------------------------
            document.querySelector(`.filters__cross--${filterButton.textContent.trim().toLowerCase()}`)
            .addEventListener('click', () => {
                // если кликает на фильтр-крестик, то удаляет фильтр-кнопку по классу
                document.querySelector(`.${filterButton.textContent.trim().toLowerCase()}--filter`).remove();
                // мы удалим эту инфу из массива, при нажатии крестика
                filterButtonsArray.splice(filterButtonsArray.indexOf(filterButton.textContent.trim().toLowerCase(), 0), 1);   
                
                // проверяет, если массив добавленный фильтров пустой, то:
                if (filterButtonsArray.length === 0) {
                    // скрыть блок с фильтрами в целом
                    document.querySelector('.filters').classList.toggle('hidden');
                    // и отобразить всех юзеров
                    document.querySelectorAll('.user').forEach(user => {
                        user.classList.remove('hidden');
                    });
                }
    
                

                for (let key in usersObj) {
                    let filterInCounter = 0;
                    for (let filter of filterButtonsArray) {
                        if (!usersObj[key].includes(filter)) {
                            document.querySelector(`#user${key}`).classList.add('hidden');
                        } else {
                            filterInCounter++;
                            if (filterInCounter >= filterButtonsArray.length) {
                                document.querySelector(`#user${key}`).classList.remove('hidden');
  
                            }
                            
                        }
                    }
                }           
                
   
            });
        }
        
        // у каждого юзера есть своё id. и у каждого айди есть свой массив кнопок-фильтров
        // каждый раз, когда мы добавляем новый фильтр, то мы смотрим, у каких юзеров он есть
        // в массиве. у кого те, тех юзеров оставляем, а остальных скрываем через id
        for (let key in usersObj) {
            if (!usersObj[key].includes(filterButton.textContent.trim().toLowerCase())) {
                document.querySelector(`#user${key}`).classList.add('hidden');
            }
        }
    });
});




// ----------------------------------------------
// при клике на кнопку clear отчистим всё
// ----------------------------------------------

const $filtersL1Clear = document.querySelector('.filters__l1-clear');
$filtersL1Clear.addEventListener('click', () => {
    $filtersL1Content.textContent = '';
    filterButtonsArray = [];
    document.querySelector('.filters').classList.toggle('hidden');
    document.querySelectorAll('.user').forEach(user => {
        user.classList.remove('hidden');
    });
});


