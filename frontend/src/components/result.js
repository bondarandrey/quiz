import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Result  {

        constructor() {
            this.routeParams = UrlManager.getQueryParams();

            this.showResponseElement = null;
            const url = UrlManager.getQueryParams()
                this.init();
            this.showResponseElement = document.getElementById('response');
            this.showResponseElement.onclick = this.showResponse.bind(this, url.id);
        }
        showResponse (dataId) {
            if(dataId) {
                location.href = '#/response' + '?id=' + dataId;
            }
        }

        async init() {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/'
            }
           if (this.routeParams.id) {
               try {
                   const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);
                   if (result) {
                       if (result.error) {
                           throw new Error(result.error);
                       }
                       document.getElementById('result-score').innerText =  result.score + '/' +  result.total;
                       return;
                   }
               } catch (error) {
                   console.log(error);
               }


           }
            location.href = '#/'
        }
    }
