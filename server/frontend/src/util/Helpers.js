
export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      "Январь", "Февраль", "Март",
      "Апрель", "Май", "Июнь", "Июль",
      "Август", "Сентябрь", "Октябрь",
      "Ноябрь", "Декабрь"
    ];
  
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year;
}

export function formatTime(timeString) {
    const time = String(timeString);

    return time.slice(0, 5);
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Янв", "Фев", "Мар", "Апр",
    "Май", "Июн", "Июл", "Авг",
    "Сен", "Окт", "Ноя", "Дек"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}

export function formatRole(roleString) {
    const time = String(roleString);

    return time.slice(5);
}