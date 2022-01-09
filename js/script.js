document.addEventListener('DOMContentLoaded', async()=>{
    const btnLogout = document.getElementById('logout');
    document.querySelectorAll('.nav-link').forEach(function(link){
        if (link.href == window.location.href || window.location.href.includes('chat') && link.href.includes('chat'))
            link.classList.add('active')
    })

    async function isOnline() {
        const req = await fetch('/api/chat/online', {
            method: 'POST'
        })
        return req.json()
    }

    async function logout() {
        const formData = new FormData()
        formData.append('method', 'logout')
        const request = await fetch('/api/login/logout/', {
            method: "POST",
            headers: {
                contentType: "application/x-www-form-urlencoded"
            },
            mode: 'no-cors',
            body: formData,
        })
        const response = await request.json()
        return response
    }

    if (window.location.href != 'https://petroz.ru/login/register') {
        await isOnline()
        setInterval(await isOnline, 60000)
    }

    btnLogout?.addEventListener('click', async(e)=>{
        const response = await logout()
        if(response.success){
            window.location.reload()
        }
    })

    const search = document.querySelector('[type="search"]')
    const btnSearch = document.querySelector('#search')
    const searchBox = document.querySelector('#search-box')
    btnSearch.addEventListener('click', async (event) => {
        event.preventDefault()
    })
    const usersSearch = new Set();
    const users = await getUsers()
    search.addEventListener('input', async (event) => {
        usersSearch.clear()
        users.forEach(user => {
            if ((user['name'].toLowerCase()).indexOf((event.target.value).toLowerCase()) + 1) {
                const find = document.createElement('li')
                searchBox.classList.add('show')
                find.className = 'dropdown-item bottom-0 start-0';
                find.innerText = user['name'];
                usersSearch.add(find)
            }
        })
        usersSearch.forEach(user=>searchBox.append(user))
        console.log(usersSearch);
    })

    async function getUsers() {
        const req = await fetch('/api/chat/users', {
            method: 'POST'
        })
        return await req.json()
    }
})