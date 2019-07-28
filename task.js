(function() {

    //масив с месяцами
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const calendares = [];

    //конструктор создания календаря
    function Calendar(year, month) {
        this.date = new Date(year, month);
        this.wrapper = null;
        this.generateDOMInterface(); //возвращвет врапер с таблицей
    };

    //устанавливаем дату со следующим месяцем
    Calendar.prototype.nextMonth = function() {
        this.date.setMonth(this.date.getMonth() + 1);
    };

    //устанавливаем дату с предыдущим месяцем
    Calendar.prototype.previousMonth = function() {
        this.date.setMonth(this.date.getMonth() - 1);
    };

    //устанавливаем дату со следующим годом
    Calendar.prototype.nextYear = function() {
        this.date.setFullYear(this.date.getFullYear() + 1);
    };

    //устанавливаем дату с предыдущим годом
    Calendar.prototype.previousYear = function() {
        this.date.setFullYear(this.date.getFullYear() - 1);
    };

    Calendar.prototype.generateDOMInterface = function() {
        if (this.wrapper) {
            return this.wrapper;
        };

        this.wrapper = document.createElement('div'); //создаем див-обертку куда вставим таблицу календаря
        let table = document.createElement('table'); //создаем таблицу и туда будем вставлять thead, tbody
        this.wrapper.append(table); //вставляем таблицу в врапер
        table.append(this.generateControlPanel()); //вставляем в таблицу  thead- панель с кнопками
        this.updateInterface(); //обновлем интрефейс-перерисовка таблицы и панели с месяцем и годом
        return this.wrapper;
    }

    //метод создает 1 строку с кнопками для переключения месяца и  года
    Calendar.prototype.generateControlPanel = function() {
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');
        thead.append(tr);
        let self = this;
        tr.id = 'panel';
        tr.innerHTML = `<td class="change_year"><button class="btn_year" id="prevyearBtn">&lt;&lt;</button></td><td class="change_month"><button class="btn_month" id="previousmonthBtn">&lt;</button></td><td colspan="3" id="display_month"><div id="descripMonth"></div><div id="descripYear"></div></td><td class="change_month"><button class="btn_month" id="nextmonthBtn">&gt;</button></td><td class="change_year"><button class="btn_year" id="nextyearBtn">&gt;&gt;</button></td>`;

        tr.querySelector("#prevyearBtn").addEventListener("click", function() {
            self.previousYear(); //при клике на пред год вызываем метод у календаря previousYear
            self.updateInterface(); //меняем надпись в панеле+перерисовываем таблицу
        });

        tr.querySelector("#previousmonthBtn").addEventListener("click", function() {
            self.previousMonth(); //при клике на пред месяц вызываем метод у календаря previousMonth
            self.updateInterface(); //меняем надпись в панеле+перерисовываем таблицу
        });

        tr.querySelector("#nextmonthBtn").addEventListener("click", function() {
            self.nextMonth(); //при клике на след месяц вызываем метод у календаря nextMonth
            self.updateInterface(); //меняем надпись в панеле+перерисовываем таблицу
        });

        tr.querySelector("#nextyearBtn").addEventListener("click", function() {
            self.nextYear(); //при клике на след год вызываем метод у календаря nextYear
            self.updateInterface(); //меняем надпись в панеле+перерисовываем таблицу
        });
        return thead;
    }

    Calendar.prototype.getDay = function(date) { // получить номер дня недели, от 0(пн) до 6(вс)
        var day = date.getDay();
        if (day == 0) { day = 7 };
        return day - 1;
    };

    Calendar.prototype.updateInterface = function() {
        let table = this.wrapper.querySelector("table");
        let tbody = table.querySelector('tbody');
        if (tbody) { //удаляем 1 строку с кнопками если она есть
            tbody.remove();
        };

        tbody = this.generateCalendarPanel(); //перерисовываем таблицу с переданной датой(изменнненой)
        table.append(tbody); //вставляем tbody  в  таблицу

        //меняем надпись месяца и года в 1 строке с кнопками таблицы
        table.querySelector("#descripMonth").innerText = monthNames[this.date.getMonth()];
        table.querySelector("#descripYear").innerText = `${this.date.getFullYear()} год`;


        //при клике на ячейку - выделение красным цветом
        var selectedTd;
        tbody.addEventListener('click', function(event) {
            var target = event.target;
            if (target.tagName != 'TD') return;
            highlight(target);

            function highlight(node) {
                if (selectedTd) {
                    selectedTd.classList.remove('highlight');
                }
                if (selectedTd !== node) {
                    selectedTd = node;
                    selectedTd.classList.add('highlight');
                } else {
                    selectedTd = null;
                };
            };
        });

        //выделение красным на ховер ячейки
        tbody.addEventListener('mouseover', function(event) {
            var target = event.target;
            if (target.tagName = 'TD') {
                target.classList.add('hoverCell');
            };
        });

        tbody.addEventListener('mouseout', function(event) {
            var target = event.target;
            if (target.tagName = 'TD') {
                target.classList.remove('hoverCell');
            };
        });
    };

    //генерируем календарь-таблицу
    Calendar.prototype.generateCalendarPanel = function() {
        let year = this.date.getYear();
        let next_month = this.date.getMonth() + 1;
        let previous_month = this.date.getMonth();
        let date = new Date(this.date.getFullYear(), this.date.getMonth()); //создаем копию переданной из селекта даты
        let datenextMonth = new Date(year, next_month);
        let datepreviousMonth = new Date(year, previous_month, 0);
        datepreviousMonth.setDate(datepreviousMonth.getDate() - this.getDay(date));
        let table = '<tr>';

        // ячейки предыд месяца
        for (let i = 0; i < this.getDay(date); i++) {
            datepreviousMonth.setDate(datepreviousMonth.getDate() + 1);
            table += '<td id="Pmonth"> ' + datepreviousMonth.getDate() + '</td>';
        };

        // ячейки календаря с датами
        while (date.getMonth() == this.date.getMonth()) {

            if ((this.getDay(date) % 7 == 6) || (this.getDay(date) % 7 == 5)) {
                table += '<td id="weekend">' + date.getDate() + '</td>';
            } else {
                table += '<td>' + date.getDate() + '</td>';
            };

            let newDate = new Date(date.getTime());
            newDate.setDate(newDate.getDate() + 1);
            let nextDayMonth = newDate.getMonth();
            if (this.getDay(date) % 7 == 6 && nextDayMonth == this.date.getMonth()) { // вс, последний день - перевод строки
                table += '</tr><tr>';
            }
            date.setDate(date.getDate() + 1);
        };

        // добить таблицу  ячейками след месяца
        if (this.getDay(date) != 0) {
            for (let i = this.getDay(date); i < 7; i++) {
                table += '<td id="Nmonth">' + datenextMonth.getDate() + '</td>';
                datenextMonth.setDate(datenextMonth.getDate() + 1);
            };
        };

        table += '</tr>';
        let tbody = document.createElement("tbody"); //создаем tbody  и вставляем в таблицу
        tbody.id = "bodyCalendar";
        tbody.innerHTML = table;
        return tbody;
    };

    Calendar.prototype.remove = function() {
        this.wrapper.remove(); //удаляет из DOM сам врапер
    };

    //создаем хэдер с кнопками и селектами
    var header = document.getElementById("header");
    var divMonth = document.createElement('div');
    divMonth.id = "fieldMonth";
    header.appendChild(divMonth);

    //создаем div с месяцем
    let namesMonthArr = ["Выбрать месяц", ...monthNames];
    var strMonth = '<label for="month">Месяц</label><select name="month" id="monthId" class="select-field">';
    for (var i = 0; i < namesMonthArr.length; i++) {
        strMonth += `<option value = "${i}">${namesMonthArr[i]}</option>`;
    };
    strMonth += '</select>';
    divMonth.innerHTML = strMonth;

    //создаем div с годом
    var divYear = document.createElement('div');
    divYear.id = "fieldYear";
    header.appendChild(divYear);

    var yearsArr = ["Выбрать год", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988",
        "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999",
        "2000", "2001", "2002", "2003", "2000", "2001", "2002", "2003", "2000", "2001", "2002",
        "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013",
        "2014", "2015", "2016", "2017", "2018", "2019", "2020"
    ];

    var strYear = '<label for="year">Год</label><select name="year" id="yearId" class="select-field">';

    for (var i = 0; i < yearsArr.length; i++) {
        strYear += `<option value = "${yearsArr[i]}">${yearsArr[i]}</option>`;
    };

    strYear += '</select>';
    divYear.innerHTML = strYear;

    //создаем кнопку создать календарь
    var buttonCreateCalend = document.createElement('button');
    buttonCreateCalend.id = "createCalend";
    header.appendChild(buttonCreateCalend);
    buttonCreateCalend.innerText = "Создать";

    //создаем кнопку удалить календарь
    var buttonRemoveCalend = document.createElement('button');
    buttonRemoveCalend.id = "removeCalend";
    buttonRemoveCalend.innerText = "Удалить";
    buttonRemoveCalend.setAttribute('disabled', true);
    buttonRemoveCalend.classList.add('disabled');
    header.appendChild(buttonRemoveCalend);

    var selectMonth = document.getElementById('monthId'); //селект для месяца
    var selectYear = document.getElementById('yearId'); //селект для года

    //по дефолту дизейблим кнопку
    buttonCreateCalend.setAttribute('disabled', true);
    buttonCreateCalend.classList.add('disabled');


    selectMonth.addEventListener('change', function() {
        if (!selectYear.options[0].selected) {
            buttonCreateCalend.classList.remove('disabled');
            buttonCreateCalend.removeAttribute('disabled', true);
        };
    });

    selectYear.addEventListener('change', function() {
        if (!selectMonth.options[0].selected) {
            buttonCreateCalend.classList.remove('disabled');
            buttonCreateCalend.removeAttribute('disabled', true);
        };
    });

    selectMonth.addEventListener('change', function() {
        if ((selectMonth.options[0].selected) && (!selectYear.options[0].selected)) {
            buttonCreateCalend.classList.add('disabled');
            buttonCreateCalend.setAttribute('disabled', true);
        };
    });

    selectYear.addEventListener('change', function() {
        if ((selectYear.options[0].selected) && (!selectMonth.options[0].selected)) {
            buttonCreateCalend.classList.add('disabled');
            buttonCreateCalend.setAttribute('disabled', true);
        }
    });

    buttonCreateCalend.addEventListener('click', addCalendar);
    var count = 0; //для каждого врапера айдишник генерируется из count

    //функция по добавлению календаря
    function addCalendar() {
        var selectMonth = document.getElementById('monthId'); //селект для месяца
        var selectYear = document.getElementById('yearId'); //селект для года

        var OptionMonth = selectMonth.options[selectMonth.selectedIndex].value; //значение из селекта месяца
        var OptionYear = selectYear.options[selectYear.selectedIndex].value; //значение из селекта года
        var month = parseInt(OptionMonth);
        var year = parseInt(OptionYear);
        var _month = month - 1;

        let calendar = new Calendar(year, _month); //создается новый объект из конструктора

        calendares.push(calendar); //добавляется в массив

        var wraperCalendar = calendar.generateDOMInterface(); //создается врапер с календарем
        var section = document.getElementById('section');
        count = count + 1;
        wraperCalendar.id = `"${count}"`;
        section.appendChild(wraperCalendar); //вставляем врапер в section
        wraperCalendar.style.cssText = "display:flex;flex-direction: column;justify-content: center;align-items: center;height: 500px;width: 100%;";

        //в масиве есть календарей кнопка удалить енейбл
        buttonRemoveCalend.classList.remove('disabled');
        buttonRemoveCalend.removeAttribute("disabled");

        //сбрасывыаем селекты до дефолтных значений
        function setSelectedIndex(select, item) {
            select.options[item - 1].selected = true;
            return;
        }
        setSelectedIndex(selectMonth, 1);
        setSelectedIndex(selectYear, 1);

        //и дизейблим кнопку Создать
        buttonCreateCalend.classList.add('disabled');
        buttonCreateCalend.setAttribute('disabled', true);
    };

    buttonRemoveCalend.addEventListener('click', removeCalendar);

    function removeCalendar() {
        if (calendares.length) {
            calendares.shift().remove(); //из массива удаляем первый календарь
        }
        if (calendares.length == 0) {
            buttonRemoveCalend.classList.add('disabled');
            buttonRemoveCalend.setAttribute('disabled', true);
        };
    };


}())