var items = [];
var current = -1;
var commandNode = document.getElementById("command");
var handlers = {
  "add": add,
  "list": list,
  "done": done,
  "get": get,
  "save": save,
  "restore": restore,
  "clear": clear,
  "help": help,
  "quit": quit
};

const remote = require('electron').remote;


// configuration parameters
var STORAGE_SUPPORT = false;


document.addEventListener("DOMContentLoaded", function() {
    STORAGE_SUPPORT = typeof("Storage") !== 'undefined';
    document.addEventListener("keypress", key, false);
    commandNode.focus();
});

function key (e) {
    if (e.keyCode == 13) {
        extractCommand();
    }
}

function extractCommand() {
    var command = commandNode.value;
    commandNode.value = "";

    var arr = command.split(" ");
    var com = arr.shift();
    handlers.hasOwnProperty(com) ? handlers[com](arr.join(" ")) : nothing();
}


// 1-layer command
function add(item) {
    items.push(item);
    clearAndShow("new item {" + item + "} has been added.");
}

function list() {
    clearAndShow(items.length <= 0 ? "nothing left" : items)
}

function get() {
    var item = "nothing left."
    if (items.length > 0) {
        current = Math.floor(Math.random()*items.length);
        item = items[current];
    }
    clearUl();
    show(item);
}

function done(item) {
    if (current < -1 || current >= items.length) return;
    items.splice(current, 1);
    clearAndShow("item has been done.");
}

function quit() {
    remote.getCurrentWindow().close();
}

function help() {
    clearAndShow([
        "help: show command usage",
        "add task: task can be something like 'drink water' or 'listen to music' (without quotes)",
        "list: get a list of what you added before",
        "get: randomly choose one item from list and display. you can rerun `get` to change current item.",
        "done: mark current item done and remove it from list",
        "clear: remove all the items in your list",
        "save: save current list in local storage",
        "restore: restore list from local storage. This will override current list.",
        "quit: close current window."
    ]);
}

// local storage
function save () {
    if (STORAGE_SUPPORT) {
        saveInLocal(items);
        clearAndShow("data are saved");
    } else {
        clearAndShow("save is not supported");
    }
}

function restore () {
    if (STORAGE_SUPPORT) {
        items = restoreFromLocal();
        clearAndShow("data are restored");
    } else {
        clearAndShow("restore is not supported");
    }
}

function clear () {
    items = [];
    clearAndShow("data are cleared");
}

function nothing() {
    clearAndShow("invalid command..");
}

// util functions
function clearAndShow(item) {
    current = -1
    clearUl();
    Array.isArray(item)? item.forEach(show) : show(item);
}

function show(item) {
    var li = document.createElement("li");
    li.innerHTML = item;
    var ul = document.getElementById("list");
    ul.appendChild(li);
}

function clearUl() {
    var ul = document.getElementById("list");
    removeChildren(ul);
}

function removeChildren(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function saveInLocal (items) {
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem("items", items.join("#"));
    } else {
        console.log("local storage is not supported");
    }
}

function restoreFromLocal () {
    if (typeof(Storage) !== 'undefined') {
        return localStorage.getItem("items").split("#");
    } else {
        console.log("local storage is not supported");
        return [];
    }
}
