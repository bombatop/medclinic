class CustomDate extends Date {
    constructor(...args) {
        super(...args);
        this.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        this.dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        this.dayNamesShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    }

    getMonthAsWord() {
        return this.monthNames[this.getMonth()];
    }

    getDayOfWeekAsWord() {
        return this.dayNames[this.getDay() % this.dayNames.length];
    }

    getDayOfWeekAsShortWord() {
        return this.dayNamesShort[this.getDay() % this.dayNamesShort.length];
    }

    getCardTitle() {
        return this.getDayOfWeekAsWordl() + ', ' + this.getDate();
    }

    formatDate() {
        const year = this.getFullYear();
        const month = (this.getMonth() + 1).toString().padStart(2, '0');
        const day = this.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatTime() {
        const hours = this.getHours().toString();
        const minutes = this.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

export default CustomDate;
