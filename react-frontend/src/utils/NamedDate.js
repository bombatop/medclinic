class NamedDate extends Date {
    
    static monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    static dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    static dayNamesShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    static getMonthAsWord(date) {
        date = new Date(date);
        return this.monthNames[date.getMonth()];
    }

    static getDayOfWeekAsWord(date) {
        date = new Date(date);
        return this.dayNames[date.getDay() % this.dayNames.length];
    }

    static getDayOfWeekAsShortWord(date) {
        date = new Date(date);
        return this.dayNamesShort[date.getDay() % this.dayNamesShort.length];
    }

    static getCardTitle(date) {
        date = new Date(date);
        return this.getDayOfWeekAsWord(date) + ', ' + date.getDate();
    }

    static getTime(date) {
        let d = new Date(date);
        const hours = d.getHours().toString();
        const minutes = d.getMinutes().toString().padStart(2, '0');;
        return `${hours}:${minutes}`;
    }
}

export default NamedDate;
