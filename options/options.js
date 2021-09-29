const OPTION_AUTOCOMPLETE_KEY = "autocompleteEnabled";
const OPTION_ITEMS_KEY = "items";
const OPTION_MATCH_ONLY_AT_BEGINNING = "matchOnlyAtBeginning";
const OPTION_USE_TAB_KEY = "useTabToChooseItems";
const ELEMENT_AUTOCOMPLETE_ENABLED = "autocomplete-enabled";
const ELEMENT_ITEMS = "items";
const ELEMENT_MATCH_ONLY_AT_BEGINNING = "match-only-at-beginning";
const ELEMENT_USE_TAB_TO_CHOOSE_ITEMS = "use-tab-to-choose-items";

let timeout;

function restoreOptions() {
    browser.storage.local.get([
        OPTION_AUTOCOMPLETE_KEY,
        OPTION_ITEMS_KEY,
        OPTION_MATCH_ONLY_AT_BEGINNING,
        OPTION_USE_TAB_KEY,
    ]).then(
        result => {
            setBooleanValue(ELEMENT_AUTOCOMPLETE_ENABLED, result[OPTION_AUTOCOMPLETE_KEY]);
            setBooleanValue(ELEMENT_MATCH_ONLY_AT_BEGINNING, result[OPTION_MATCH_ONLY_AT_BEGINNING]);
            setBooleanValue(ELEMENT_USE_TAB_TO_CHOOSE_ITEMS, result[OPTION_USE_TAB_KEY]);
            setTextValue(ELEMENT_ITEMS, result[OPTION_ITEMS_KEY]);
        }
    );
}

function enableAutosave() {
    for (const input of document.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea")) {
        input.addEventListener("input", delayedSaveOptions);
    }
    for (const input of document.querySelectorAll("input[type=radio], input[type=checkbox]")) {
        input.addEventListener("change", saveOptions);
    }
}

function setTextValue(elementID, newValue) {
    const oldValue = document.getElementById(elementID).value;

    if (oldValue !== newValue) {
        document.getElementById(elementID).value = newValue;
    }
}

function setBooleanValue(elementID, newValue) {
    document.getElementById(elementID).checked = newValue;
}

function delayedSaveOptions(event) {
    clearTimeout(timeout);
    timeout = setTimeout(saveOptions, 500, event);
}

function saveOptions(event) {
    event.preventDefault();
    browser.storage.local.set({
        [OPTION_AUTOCOMPLETE_KEY]: document.querySelector(`#${ELEMENT_AUTOCOMPLETE_ENABLED}`).checked,
        [OPTION_ITEMS_KEY]: document.querySelector(`#${ELEMENT_ITEMS}`).value,
        [OPTION_MATCH_ONLY_AT_BEGINNING]: document.querySelector(`#${ELEMENT_MATCH_ONLY_AT_BEGINNING}`).checked,
        [OPTION_USE_TAB_KEY]: document.querySelector(`#${ELEMENT_USE_TAB_TO_CHOOSE_ITEMS}`).checked,
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", enableAutosave);
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
