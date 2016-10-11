var riot = require('riot');
require('./calendar.tag.html');

window.calendar = riot.mount(document.querySelector('.app'),'riot-calendar',{
    /*isRange: true,
    minDate: '2016-10-05',
    maxDate: '2016-11-02'*/
    //isMultiple: true
});