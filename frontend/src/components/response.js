import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Show {
    constructor() {
        this.answer = null;
        this.quiz = null;
        this.showItemsElement = null;
        this.results = null;
        this.showTitleElement = null;
        this.showName = null;
        this.name = null;
        this.lastName = null;
        this.email = null;



        this.routeParams = UrlManager.getQueryParams();
        const user = JSON.parse(localStorage.getItem('userInfo'))
        const results = JSON.parse(localStorage.getItem('resultId'));
        const test = JSON.parse(localStorage.getItem('answerId'));

        this.userId = user.userId;
        this.idTest = this.routeParams.id;
        this.name = user.fullName;
        this.lastName = JSON.parse(localStorage.getItem('lastName'));
        this.email = JSON.parse(localStorage.getItem('email'));
        this.showName = `${this.name}, ${this.email}`;
        this.resultId = results;
        this.answerId = test;


        // UrlManager.checkUserData({
        //     name: this.name,
        //     lastName: this.lastName,
        //     email: this.email
        //  });
        this.init();
    }


    async init() {
        if (this.routeParams.id) {
            try {
                const xhr = await CustomHttp.request(config.host + '/tests/' + this.idTest + '/result/details?userId=' + this.userId);
                if (xhr) {
                    if (xhr.error) {
                        throw new Error(xhr.error);
                    }
                    if (xhr && xhr.test) {
                        this.quiz = xhr;
                    } else {
                        throw new Error('Не удалось получить данные теста');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        this.startShow();
    }


    //
    //     if (this.routeParams.id) {
    //         const xhr = new XMLHttpRequest();
    //         const xhr1 = new XMLHttpRequest();
    //         xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + this.routeParams.id, false);
    //         xhr.send();
    //         xhr1.open('GET', 'https://testologia.site/get-quiz?id=' + this.routeParams.id, false);
    //         xhr1.send();
    //
    //         if (xhr.status === 200 && xhr.responseText) {
    //             try {
    //                 this.answer = JSON.parse(xhr.responseText);
    //             } catch (e) {
    //                 location.href = '#/';
    //             }
    //         } else {
    //             location.href = '#/';
    //         }
    //
    //         if (xhr1.status === 200 && xhr1.responseText) {
    //             try {
    //                 this.quiz = JSON.parse(xhr1.responseText);
    //             } catch (e) {
    //                 location.href = '#/';
    //             }
    //         } else {
    //             location.href = '#/';
    //         }
    //     } else {
    //         location.href = '#/';
    //     }
    //     this.startShow();
    // }


    startShow() {

        const results = JSON.parse(localStorage.getItem('resultId'));
        const test = JSON.parse(localStorage.getItem('answerId'));
        const re = /№\d+/gi;
        this.showTitleElement = test.name.replace(re, '№' + this.routeParams.id);
        this.perfomerTest = document.getElementById("perfomerTest");
        this.perfomerTest.innerHTML += '<span>&nbsp;' + this.showName + '</span>';
        this.wholeQuestions = document.getElementById("responseQuestions");
        this.testName = document.getElementById('name-test');
        this.testName.innerHTML += '<span>&nbsp;' + this.showTitleElement + '</span>';
        this.showItemsElement = results.map(el => el.chosenAnswerId);
        console.log(this.showItemsElement.includes(42));
        test.questions.forEach((activeQuestion, indexQuestion) => {

            this.currentQuestion = document.createElement('div');
            this.titleQuestion = document.createElement('h3');
            this.titleQuestion.className = 'test-question-title';
            this.titleQuestion.innerHTML = '<span>Вопрос ' + (indexQuestion + 1) + ': </span>' + activeQuestion.question;
            activeQuestion.answers.forEach((answer, indexAnswer) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'test-question-option';
                const inputRadio = document.createElement('input');
                inputRadio.setAttribute('type', 'radio');
                inputRadio.setAttribute('name', 'answer-' + indexQuestion);
                inputRadio.setAttribute('disabled', true);
                const labelElement = document.createElement('label');
                labelElement.innerText = answer.answer;
                labelElement.setAttribute('for', 'answer-' + indexQuestion + '-' + indexAnswer);


                if (answer.hasOwnProperty('correct')) {
                    inputRadio.checked = true;
                    if (answer.correct) {

                          labelElement.style.color = '#33dc7c';
                    } else {
                        labelElement.style.color = '#ee0b0b';

                    }
                }

                optionElement.appendChild(inputRadio);
                optionElement.appendChild(labelElement);
                this.currentQuestion.appendChild(optionElement);
            });

            this.wholeQuestions.appendChild(this.titleQuestion);
            this.wholeQuestions.appendChild(this.currentQuestion);
        });
    }
}
