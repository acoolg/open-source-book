import { getRandom, jumpTo, userData, getCookie, writeNewData } from "../script/little.js"

var nowq = 0;
var que = undefined;
var thatque = undefined;
var no = 0; // 定义 no 变量，初始化为 0

async function fetchDataAndExtractIds(dataPath) {
    try {
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        const ids = data.map(item => item.id); // 提取每个题目的 id
        return ids; // 返回一个数组
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getdata(dataPath) {
    try {
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getQuestionById(id) {
    try {
        const data = await getdata("../data/choose.json");
        const question = data.find(item => item.id === id);
        if (question) {
            return {
                question: question.question,
                answer: question.answer,
                a: question.a,
                b: question.b,
                c: question.c,
                clue: question.clue,
                tag: question.tag,
                id: question.id
            };
        } else {
            console.error('No question found with id:', id);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function render(question) {
    const questi = document.getElementById("quizthing");
    const ase = [question.answer, question.a, question.b, question.c];
    const bse = shuffle(ase);

    questi.innerHTML = "";

    questi.innerHTML += `<h1>${question.question}</h1>`;
    for (let i = 0; i < bse.length; i++) {
        if (bse[i] === question.answer) {
            questi.innerHTML += `<button id="assa">${bse[i]}</button>`;
        } else {
            questi.innerHTML += `<button>${bse[i]}</button>`;
        }
    }
    document.getElementById("assa").addEventListener("click", itis);
}

async function renderQuestionById(questionId) {
    const question = await getQuestionById(questionId);
    if (question) {
        render(question);
    }
}

async function main() {
    try {
        const ids = await fetchDataAndExtractIds("../data/choose.json");
        console.log('Extracted IDs:', ids); // 打印结果
        return ids;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function set() {
    try {
        nowq = 0;
        que = await main(); // 等待 main 函数完成
        thatque = shuffle(que); // 洗牌

        console.log('Shuffled IDs:', thatque);
        await renderQuestionById(thatque[no]);
    } catch (error) {
        console.error('Error loading question:', error);
    }
}

async function ask(no) {
    try {
        console.log('Shuffled IDs:', thatque);
        await renderQuestionById(thatque[no]);
    } catch (error) {
        console.error('Error loading question:', error);
    }
}

window.onload = async function() {
    await set();
    await ask(nowq); // 传递 no 参数
}

async function itis() {
    console.log('Answer clicked');
    nowq++;
    await ask(nowq);
    console.log(nowq);
    if(nowq == thatque.length + 1){
        set()
    }
}

let lastCompletionDate = new Date(userData.last_login) // Example last completion date
let streak = 5; // Example current streak

function updateStreak(currentDate) {
    // Calculate the difference in days between the current date and the last completion date
    const diffTime = Math.abs(currentDate - lastCompletionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // If the last completion date was yesterday, increment the streak
        streak += 1;
    } else if (diffDays > 1) {
        // If the last completion date was more than a day ago, reset the streak
        streak = 1;
    }
    // Update the last completion date to the current date
    lastCompletionDate = currentDate;
}

// Example usage
let today = new Date();
updateStreak(today);
console.log("Current Streak: " + streak); // Output: Current Streak: 6