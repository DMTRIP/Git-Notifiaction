


const reposArray = [
    {
        btnId: 0
    }
];

//https://api.github.com/repos/DMTRIP/phonebook/commits?client_id=4159078fc6e642273457&client_secret=3fdc37bd69e7280e0fcbb53eea72b656592d4ea4

const generatorId = () => {
    let over = false;
    let isId = false;
    console.log(`infunction`);
    while (!over) {
        console.log('in while');
        let id = Math.floor(Math.random() * Math.floor(100));
        reposArray.map((e) => {
            isId = id === e.btnId;
        });

        if(!isId) {
            console.log(`create id: ${id}`);
            return id;
        }
    }
};

const initCommitHistory = async () => {
  const res = await fetch('/commit');
  const data = await res.json();
    data.map((e) => {
        console.log(1);

        let commit1 = ` <span class="repo-name">${e.author}</span>: 
                          <span class="commit-text">${e.commit}</span>`,

            output = $('.mesaj-gecmisi');
        // img=`<img align='left' src='${data[0].author.avatar_url}' width='30px'>`,


        const commitE = document.createElement('p');
        commitE.classList.add('commit-p');
        commitE.setAttribute('style','align-self: center; margin: 0;');
        commitE.innerHTML = commit1;

        const img = document.createElement('img');
        img.setAttribute('src',`${e.avatarUrl}`);
        img.classList.add('main-commit-avatar');

        const sil = document.createElement('div');
        sil.classList.add('sill');

        const div = document.createElement('div');
        div.classList.add('main-comment');
        div.appendChild(img);
        div.appendChild(commitE);
        div.appendChild(sil);

        const sonuc = document.querySelector('#sonuc');
        // sonuc.innerHTML = `<div class='sen'>${img}${commitE}${sil}</div>`;
        sonuc.appendChild(div);


        output.scrollTop(
            output[0].scrollHeight - output.height()
        );

        // $("#form")[0].reset();

    });
};

initCommitHistory();

const addToCommitHistory = async (commit,author,avatarUrl) => {
  const res = await fetch('/commit', {
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          'commit': commit,
          'author': author,
          'avatarUrl': avatarUrl
      })
  });

    console.log(res);
};


async function  fetch1(link,btnId) {

    reposArray.map((e) => {
        if( e === link) return;
    });

    const res = await fetch(link);
    const data = await res.json();
    if(res.status !== 200) {
        alert('request status isn\'t 200 please check your client_id and client_secret');
    }


    let firstCommit = data[0].commit.message;
            console.log(`first commit: ${data[0].commit.message}`);
     const interval = setInterval(async () => {
         console.log(interval);
         const res =  await fetch(link);
        const data = await res.json();

        if(firstCommit !== data[0].commit.message) {
            firstCommit = data[0].commit.message;


            let commit1 = `<span class="repo-name">${data[0].commit.author.name} from</span>: 
                          <span class="commit-text">${data[0].commit.message}</span>`,

                output = $('.mesaj-gecmisi');
               // img=`<img align='left' src='${data[0].author.avatar_url}' width='30px'>`,


            const commitE = document.createElement('p');
            commitE.classList.add('commit-p');
            commitE.setAttribute('style','align-self: center; margin: 0;');
            commitE.innerHTML = commit1;

            const img = document.createElement('img');
            img.setAttribute('src',`${data[0].author.avatar_url}`);
            img.classList.add('main-commit-avatar');

            const sil = document.createElement('div');
            sil.classList.add('sill');

            const div = document.createElement('div');
            div.classList.add('main-comment');
            div.appendChild(img);
            div.appendChild(commitE);
            div.appendChild(sil);

            const sonuc = document.querySelector('#sonuc');
            // sonuc.innerHTML = `<div class='sen'>${img}${commitE}${sil}</div>`;
            sonuc.appendChild(div);


            output.scrollTop(
                output[0].scrollHeight - output.height()
            );

            // $("#form")[0].reset();


            console.log('new commit: ',data[0].commit.message);
            addToCommitHistory(data[0].commit.message,data[0].commit.author.name,data[0].author.avatar_url);

        }

    },3000);

     let isInReposArray = false;
    for(let e  of reposArray) {
        if(link === e.link) {
            e.id = interval;
            isInReposArray = true;
            isInReposArray = true;
        }
    }

    if(!isInReposArray) {
        reposArray.push({
            link: link,
            id: interval,
            btnId: btnId
        });
    }




    console.log(reposArray);

}

const addToRepoListToDb = (repo) => {
    console.log(1);
    fetch('/add-repo',{
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          'repo': repo,
      })
  })
};
async function addToReposList(link,btnId) {
    const res = await fetch(link);
    const data = await res.json();

    let reposName = `<p class="repo-list-name" ">${data[0].author.login}</p>`,
        output = $('.repo-mesaj-gecmisi'),
        sil ="<div class='sil'></div>";

    // let btnId;
    // reposArray.map((e) => {
    //     if(e.link === link) {
    //
    //         btnId = e.btnId;
    //
    //     }
    // });

    // const  img = `<a href="${data[0].author.url}" class="d-flex">
    // <img align='left' class="repo-list-img" src='${data[0].author.avatar_url}'>${reposName}</a>`;
    const html = `
<div>
    <a href="${data[0].author.url}" class="d-flex">
    <img align='left' class="repo-list-img" src='${data[0].author.avatar_url}'>${reposName}</a>
   <button link="${link}" type="button" btnId="${btnId}" class="btn btn-primary ">Start</button>
   <button link="${link}" type="button" btnId="${btnId}"  class="btn btn-warning active-stop">Stop</button>
   <button link="${link}" type="button" btnId="${btnId}" class="btn btn-danger">Delete</button>
 </div>`;


    const sonuc = document.querySelector('#repo-sonuc');
    const div = document.createElement('div');
    div.classList.add('sen');
    div.innerHTML = html;

    sonuc.appendChild(div);


    output.scrollTop(
        output[0].scrollHeight - output.height()
    );

    // $("#form")[0].reset();
    const btnStop = [...document.querySelectorAll('.btn-warning')];
    console.log(btnStop);
    btnStop.map((e) => {
        e.addEventListener('click', async function() {
            const btnId = parseInt(this.getAttribute('btnId'));

            this.classList.remove('active-stop');
            this.previousElementSibling.classList.add('active-start');

           // const res = await fetch('/repo-list');
           // const data =  await res.json();
            reposArray.map((e) => {

                if(btnId === e.btnId) {
                    clearInterval(e.id);
                    e.id = -1;
                }
            });
        });
    });

    const btnStart = [...document.querySelectorAll('.btn-primary')];
    btnStart.map((e) => {
        e.addEventListener('click',async function () {
            this.classList.remove('active-start');
            this.nextElementSibling.classList.add('active-stop');
            const btnId = parseInt(this.getAttribute('btnId'));

            reposArray.map((e) => {
                if(e.btnId === btnId) {
                    fetch1(e.link);
                }
            });
        });
    });

    const btnDelete = [...document.querySelectorAll('.btn-danger')];

    btnDelete.map((e) => {
       e.addEventListener('click', async function ()  {
           console.log(this.parentNode.parentNode.remove());
           let url = 0;
           reposArray.map((e) => {
               if(e.btnId === parseInt(this.getAttribute('btnId'))){
                   clearInterval(e.id);
                   e.id = -1;
                  url = e.link;
              }
           });
           fetch('/delete-repo', {
               method: 'post',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   repo: url
               })
           })
       });
    });

    console.log('new commit: ',data[0].commit.message);
}

const initRepoList = async () => {
  const res = await fetch('/repo-list');
  const data = await res.json();



  data.map((el) => {
      const btnId = generatorId();
      addToReposList(el,btnId);
      fetch1(el,btnId);
  });

};

initRepoList();


function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}

const regexLink = (link) => {
    const pattern = /m\/[a-zA-Z]*\/[a-zA-z]*/;
    const firstIndex = link.search(pattern);
    const preOwner = link.slice(firstIndex+1);
    const owner = preOwner.match(/\/[a-zA-z]*/);
    const reversLink = reverseString(link);
    const repo = reversLink.match(/.*?\//);
    const reversRepo = reverseString(repo[0]);
    const repoWithoutSlesha = reversRepo.slice(1,);

    return [owner, repoWithoutSlesha];
};


const repo = document.querySelector('.link');
const linkBtn = document.querySelector('.link-btn');

class Validation {
    dubbleRepo(link) {
        reposArray.map((e) => {
           if(link === e.link) return true;
        });
    }

    // check is inputs field?
    isField(...arr) {
       for(let e of arr) {
           if(e === '') return false;
       }

        return true;
    }

    // check is the link correct?
    isCorrectLink(link) {
        return /https:\/\/github.com/.test(link);
    }
}

const valid = new Validation();

linkBtn.addEventListener('click', async e => {
    const res = await fetch('/repo-list');
    const data =  await res.json();



    const client_id = document.querySelector('.client_id').value;
    const client_secret = document.querySelector('.client_secret').value;
    const linkData = regexLink(repo.value);
    const url = `https://api.github.com/repos${linkData[0]}/${linkData[1]}/commits?client_id=4159078fc6e642273457&client_secret=3fdc37bd69e7280e0fcbb53eea72b656592d4ea4`;
    let isDouble = valid.dubbleRepo(url);
    data.map((e) => {
        if(e === url) isDouble = true;
    });

    if(isDouble) {
        alert(`Repos ${linkData[0].slice(1)} already exits`);
        return;
    }

    // const isFiled = valid.isField(client_id,client_secret,repo.value);
    //
    // if(!isFiled) return  alert('please field all inputs');
    //
    // const isCorectLink = valid.isCorrectLink(repo.value);
    const btnId = generatorId();

    fetch1(url,btnId);
    addToReposList(url,btnId);
    addToRepoListToDb(url);

});



