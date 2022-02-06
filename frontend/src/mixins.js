import Vue from 'vue';
const eventHub = new Vue();
import axios from 'axios';

export default {
    created: function() {
    },
    data: function() {
        return {
            apiUrl: 'http://127.0.0.1:8000',
            eventHub: eventHub,
            formRules: {
                required: value => !!value || 'Required',
            },
        }
    },
    methods: {
        /**
         * Function to perform an axios call
         * @param url String | specifies the target route
         * @param method String | request methods
         * @param data Form data | Request body
         */
        axiosCall: function(url, method, data) {
            
            let options = {
                method: method,
                url: this.apiUrl + url,
                data: data,
                headers: {}
            };

            if (method.toLowerCase() === 'get' && data) {
                if (Object.keys(data).length > 0) {
                    options.params = data;
                }
            }
            return axios(options)
                .catch((error) => {
                    console.log(error.response);
                });
        },
        /**
         * Function to get the time difference
         */
        timeDifference: function(data) {
            let current =  new Date().getTime();
            let previous =  new Date(data).getTime();
            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;
            
            var elapsed = current - previous;

            if (elapsed < msPerMinute) {
                 return Math.round(elapsed/1000) > 1 ?  Math.round(elapsed/1000) + ' seconds ago' :  Math.round(elapsed/1000) + ' second ago';   
            }
            
            else if (elapsed < msPerHour) {
                 return Math.round(elapsed/msPerMinute) > 1 ? Math.round(elapsed/msPerMinute) + ' minutes ago' :  Math.round(elapsed/msPerMinute) + ' minute ago';   
            }
            
            else if (elapsed < msPerDay ) {
                 return Math.round(elapsed/msPerHour ) > 1 ? Math.round(elapsed/msPerHour ) + ' hours ago' : Math.round(elapsed/msPerHour ) + ' hour ago';   
            }
        
            else if (elapsed < msPerMonth) {
                 return Math.round(elapsed/msPerDay) > 1 ?  + ' days ago' :   Math.round(elapsed/msPerDay) + ' day ago';   
            }
            
            else if (elapsed < msPerYear) {
                 return  Math.round(elapsed/msPerMonth) > 1 ?  Math.round(elapsed/msPerMonth) + ' months ago' :  Math.round(elapsed/msPerMonth) + ' month ago';   
            }
            
            else {
                 return Math.round(elapsed/msPerYear ) > 1 ? Math.round(elapsed/msPerYear ) + ' years ago' :  Math.round(elapsed/msPerYear ) + ' year ago';   
            }
        },
    },

};