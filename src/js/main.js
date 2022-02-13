const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

//Configuração geral da Api, chamando a Api
axios.defaults.baseURL = `https://jsonplaceholder.typicode.com`;

const get = () => {
    //Quando fazemos uma chamada na Api, esperamos uma promessa ou promec
    axios.get(`/posts`)
    // .then() e essa função tem como parametro a resposta da Api
   .then((resp) => {
    //passando a função criada para a resposta aparecer na tela
    renderOutput(resp)
})       
    
}

const post = () => {
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };
    axios.post('/posts', data )
    .then((resp) => {
        renderOutput(resp)
    })
}

const put = () => {
    //PUT adicionar informações no Back
    const data = {
        title: 'Laravue',
        body: 'bar',
        userId: 1,
    };
    axios.put(`/posts/1`, data)
    .then((resp) => {
        renderOutput(resp)
    })
}

const patch = () => {
    const data = {
        title: 'foot',
    }
    axios.patch(`/posts/1`, data)
    .then((resp) => {
        renderOutput(resp)
    })
}

const del = () => {
    axios.delete(`/posts/1`, data)
    .then((resp) => {
        renderOutput(resp)
    })
}

const multiple = () => {
    Promise.all([
        axios.get('/posts'),
        axios.get('/users')
    ])
    .then((resp) => {
        console.log(resp[0].data);
        console.log(resp[1].data);
    });
}

const transform = () => {
    const config = {
        params: {
            _limit: 5
        },
        transformResponse: [function (data) {
            const payload = JSON.parse(data).map(o => {
                return {
                    ...o,
                    first_name: 'Jon',
                    last_name: 'Snow',
                    full_name: 'Jon Snow',
                }
            });

            return payload;
        }],
    };
    axios.get('posts', config)
        .then((response) => renderOutput(response));
}

const errorHandling = () => {
    axios.get('postsz')
        .then((response) => renderOutput(response))
        .catch((error) => renderOutput(error.response));
}

const cancel = () => {
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    };
    axios.get('posts', config)
        .then((response) => renderOutput(response))
        .catch((e) => {
            console.log(e.message);
        })

    controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
