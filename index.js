var items = [];
var command = "";
var current = -1;
var btn = document.getElementById("btn");
var commandNode = document.getElementById("command");


// configeration parameters
var STORAGE_SUPPORT = false;
document.addEventListener("DOMContentLoaded", function() {
  // code...
    // alert("hello");
    STORAGE_SUPPORT = typeof("Storage") !== 'undefined';
    document.addEventListener("keypress", key, false);
    commandNode.focus();
});

function key (e) {
    if (e.keyCode == 13) {
        // run
        extractCommand();
        // var command = document.getElementById("command");
        commandNode.value = "";
    }
}

function run() {
    // var btn = document.getElementById("btn");
    btn.addEventListener("click", extractCommand);
}

// function test() {
    // var command = document.getElementById("command").value;
    // alert(command);
// }

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
        default:
            nothing();
    }

}

function command(command) {
    add(extractCommand(command));
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
        // item.list();
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
