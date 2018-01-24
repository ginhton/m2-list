var items = [];
var command = "";
var current = -1;
var btn = document.getElementById("btn");
var commandNode = document.getElementById("command");

const remote = require('electron').remote;


// configeration parameters
var STORAGE_SUPPORT = false;


document.addEventListener("DOMContentLoaded", function() {
    STORAGE_SUPPORT = typeof("Storage") !== 'undefined';
    document.addEventListener("keypress", key, false);
    commandNode.focus();
});

function key (e) {
    if (e.keyCode == 13) {
        // run
        extractCommand();
        commandNode.value = "";
    }
}

function run() {
    btn.addEventListener("click", extractCommand);
}

function extractCommand() {

    var command = commandNode.value;
    commandNode.value = "";

    var arr = command.split(" ");
    var com = arr.shift();
    // alert(com);
    switch(com) {
        case "add":
            var item = arr.join(" ");
            add(item);
            break;
        case "list":
            list();
            break;
        case "done":
            done();
            break;
        case "get":
            get();
            break;
        case "save":
            save();
            break;
        case "restore":
            restore();
            break;
        case "clear":
            clear();
            break;
        case "quit":
            quit();
            break;
        case "help":
            help();
            break;
        default:
            nothing();
    }

}


// 1-layer command
function add(item) {
    items.push(item);
    clearAndShow("new item {" + item + "} has been added.");
}

function list() {
    current = -1;
    clearUl();
    if (items.length <= 0) {
        show("nothing left.")
        return;
    }
    for(var idx in items) {
        show(items[idx]);
    }
}

function get() {
    clearUl();
    var item = "nothing left."
    if (items.length > 0) {
        current = Math.floor(Math.random()*items.length);
        item = items[current];
    }
    show(item);
}

function done(item) {
    // item.done();
    clearUl();
    if (current < -1 || current >= items.length) return;
    items.splice(current, 1);
    current = -1;
    clearAndShow("item has been done.");
}

function quit() {
    var window = remote.getCurrentWindow();
    window.close();
}

function help() {
    clearUl();
    show("help: show command usage")
    show("add task: task can be something like 'drink water' or 'listen to music' (without quotes)")
    show("list: get a list of what you added before")
    show("get: randomly choose one item from list and display. you can rerun `get` to change current item.")
    show("done: mark current item done and remove it from list")
    show("clear: remove all the items in your list")
    show("save: save current list in local storage")
    show("restore: restore list from local storage. This will override current list.")
    current = -1
}

function nothing() {
    // nothing here
    clearAndShow("invalid command..");
    console.log("nothing happened");
}

function clearAndShow(item) {
    clearUl();
    show(item);
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



// local storage
function save () {
    if (STORAGE_SUPPORT) {
        current = -1;
        clearUl();
        saveInLocal(items);
        clearAndShow("data are saved");
    } else {
        clearAndShow("save is not supported");
    }
}

function restore () {
    if (STORAGE_SUPPORT) {
        current = -1;
        clearUl();
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
