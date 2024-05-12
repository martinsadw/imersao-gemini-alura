function convertDate(dateString) {
    // Check for "Today at" format
    const todayMatch = dateString.match(/^Today at (\d+):(\d+) (AM|PM)$/);
    if (todayMatch) {
        let [hours, minutes, meridian] = todayMatch.slice(1);
        hours = parseInt(hours)
        if (hours === 12)
            hours -= 12
        if (meridian === 'PM')
            hours = hours + 12
        const today = new Date();
        today.setHours(hours, minutes, 0, 0);
        return today;
    }

    // Check for MM/DD/YYYY format
    const mmddyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d+):(\d+) (AM|PM)$/);
    if (mmddyyyyMatch) {
        let [month, day, year, hours, minutes, meridian] = mmddyyyyMatch.slice(1);
        hours = parseInt(hours)
        if (hours === 12)
            hours -= 12
        if (meridian === 'PM')
            hours = hours + 12
        return new Date(year, month - 1, day, hours, minutes, 0, 0);
    }

    // Check for "Yesterday at" format
    const yesterdayMatch = dateString.match(/^Yesterday at (\d+):(\d+) (AM|PM)$/);
    if (yesterdayMatch) {
        let [hours, minutes, meridian] = yesterdayMatch.slice(1);
        hours = parseInt(hours)
        if (hours === 12)
            hours -= 12
        if (meridian === 'PM')
            hours = hours + 12
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(hours, minutes, 0, 0);
        return yesterday;
    }
  
    // Not in a recognized format
    return null;
}

function fetch_projects() {
    posts = Array.from(document.querySelectorAll('ol[data-list-id="chat-messages"] li.messageListItem__050f9'))

    return posts.map((post) => { 
        card = post.children[0].children[1].children[0].children[0].children[0]
        author = card.children[1].children[0].children[1].innerText
        link = card.children[1].children[1].children[1].children[0].href
        description = card.children[1].children[2].children[1].innerText
        submited = convertDate(card.children[2].innerText)

        stars_elem = post.querySelector('div.reactionCount__2c34d')
        if (stars_elem)
            stars = parseInt(stars_elem.innerHTML)
        else {
            console.log("ERRO:")
            console.log(post)
            stars = 0
        }
        return {author, link, description, stars, submited}
    })
}

function update_data(data) {
    fetch_projects().forEach((project) => {
        if (!(project['link'] in data))
            data[project['link']] = project
    })
}

function print_data_to_csv(data) {
    data_strings = Object.values(data).map((proj) => {
        description = proj['description'] ? proj['description'].replaceAll('"', '') : ''
        link = proj['link'] ? proj['link'].replaceAll('"', '') : ''
        author = proj['author'] ? proj['author'].replaceAll('"', '') : ''
        submited = proj['submited'] ? proj['submited'].toUTCString() : ''
        return '"' + author + '","' + link + '","' + description + '","' + submited + '","' + proj['stars'] + '"'
    })
    
    return 'autor,link,descricao,enviado,estrelas\n' + data_strings.join('\n')
}

data = {}

// Etapas:
// executar update_data(data) multiplas vezes enquanto rola a página
// print_data_to_csv(data)
// copiar o texto e colar em um editor de texto
// substituir os '\n' por quebras de linhas em um editor de texto
// remover as aspas simples no começo e no fim do arquivo