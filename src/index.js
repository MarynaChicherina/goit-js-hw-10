import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import debounce from "lodash.debounce";
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
    e.preventDefault;
    const searchValue = input.value.trim();
    if(!searchValue) {
        return
    }
    fetchCountries(searchValue).then(countries => {
        countriesList.innerHTML = '';
        countryInfo.innerHTML = '';
        checkFeedback(countries)
    }).catch(error => {
        Notiflix.Notify.failure("Oops, there is no country with that name");
    });

}

function renderCountriesList(countries) {
    return countries.map(({name, flags}) => {
        return `<li class='country-list__item'>
         <img src="${flags.svg}" alt="${name.official}" width = 40px height = 30px>
         <h1 class="country-list__name">${name.official}</h1></li>`
    }).join('');
}

function renderCountryInfo(countries) {
    return countries.map(({capital, population, languages}) => {
    return `<span>Capital: ${capital}</span>
        <span>Population: ${population}</span>
        <span>Languages: ${Object.values(languages).join(', ')}</span>`
    }).join('')
}

function checkFeedback(countries) {
    if(countries.length === 1) {
        countriesList.insertAdjacentHTML('beforeend', renderCountriesList(counrties));
        countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(counrties));
    } else if(countries.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name");
    } else if(countries.length >=2 && countries.length <=10) {
       countriesList.insertAdjacentHTML('beforeend', renderCountriesList(counrties));
    }
}



