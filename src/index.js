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
        checkServerReply(countries);
    }).catch(() => {
        Notiflix.Notify.failure("Oops, there is no country with that name");
    });

}

function renderCountriesList(countries) {
    return countries.map(({name, flags}) => {
        return `<li class='country-list__item'>
         <img src="${flags.svg}" alt="${name.official}" width = 50px height = 30px>
         <h2 class="country-list__name">${name.official}</h2></li>`
    }).join('')
}

function renderCountryInfo(countries) {
    return countries.map(({capital, population, languages}) => {
    return `<p><span class='country-info__item'>Capital:</span> ${capital}</p>
        <p><span class='country-info__item'>Population:</span> ${population}</p>
        <p><span class='country-info__item'>Languages:</span> ${Object.values(languages).join(', ')}</p>`
    }).join('')
}

function checkServerReply(countries) {
    if(countries.length === 1) {
        countriesList.insertAdjacentHTML('beforeend', renderCountriesList(countries));
        countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
    } else if(countries.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name");
    } else if(countries.length >=2 && countries.length <=10) {
       countriesList.insertAdjacentHTML('beforeend', renderCountriesList(countries));
    }
}