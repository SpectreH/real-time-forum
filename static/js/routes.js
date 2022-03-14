const routes = [
  {
    path: '/',
    getTemplate: async (params) => {
      let htmlElement = document.createElement('div')
      htmlElement.innerHTML = `
      <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
        <div class="container-fluid justify-content-start">
          <a class="navbar-brand" href="JavaScript:void(0);"  onclick="router.loadRoute('')">Real time forum</a>
          <div class="d-flex ">
            <ul class="navbar-nav me-auto flex-row gap-2">
              <li class="nav-item">
                <a class="nav-link" href="JavaScript:void(0);" onclick="router.loadRoute('new')">New post</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <main class="main-section container">
        <div class="row gap-2">
          <div class="col-9 my-3 p-3 bg-body rounded shadow-sm" auth-data-router-outlet>
            <div class="border-bottom pb-2 mb-0 d-flex">
              <h6 class="">Categories</h6>
            </div>
            <div class="text-center" id="category-list">
            </div>
          </div>
          
          <div class="col-2 my-3 p-3 bg-body rounded shadow-sm">
            <h6 class="border-bottom pb-2 mb-0">User list</h6>
            <div class="d-grid ov" id="user-list"></div>
          </div>
        </div>
      </main> 
      `

      await fetch('/categories-post', { method: "post" }).then(res => res.json()).then(res => {
        if (res.ok) {
          res.data.forEach(category => {
            let categoryList = htmlElement.querySelector("#category-list")

            categoryList.innerHTML += `
              <a href="JavaScript:void(0);" onclick="router.loadRoute('category', '${category}')"
                class="category-box d-inline-flex justify-content-center align-items-center border border-secondary bg-body rounded shadow-sm">
                <h3>${category}</h3>
              </a>
              `
          });
        } else {
          GenerateAlert("Error with getting category list", "error");
        }
      })

      return htmlElement.innerHTML
     }
  },
  {
    path: '/new',
    getTemplate: async (params) => {
      let htmlElement = document.createElement('div')
      htmlElement.innerHTML = `
      <div class="border-bottom pb-2 mb-2 mb-0 d-flex">
        <h6 class="">New Post</h6>
      </div>
      <form class="d-inline needs-validation" action="/new-post" method="post" novalidate>
        <div class="d-grid gap-4">
          <div class="input-group">
            <input type="text" class="form-control" name="title" aria-label="New post header" placeholder="New post header" required>
          </div>
          <div class="input-group">
            <textarea class="new-post-text-content form-control" name="new-content" aria-label="New post content" placeholder="New post content"
              required></textarea>
          </div>
          <div class="d-grid required">
            <h6 class="mb-2">Select category:</h6>
            <div class="new-post-category-selection p-1" id="category-selection-list">
            </div>
          </div>
          <div>
            <button type="submit" class="btn btn-primary" style="width: 100px;">Submit</button>
          </div>
        </div>
      </form>
      `
      
      await fetch('/categories-post', { method: "post" }).then(res => res.json()).then(res => {
        if (res.ok) {
          res.data.forEach(category => {
            let categoryList = htmlElement.querySelector("#category-selection-list")

            categoryList.innerHTML += `
              <div class="form-check d-flex gap-2">
                <input class="form-check-input" type="checkbox" name="category" value="${category}">${category}</input>
              </div>
              `
          });
        } else {
          GenerateAlert("Error with getting category list", "error");
        }
      })

      return htmlElement.innerHTML
    }
  },
  {
    path: '/category/:category',
    getTemplate: async (params) => {
      let htmlElement = document.createElement('div')
      htmlElement.innerHTML = `
      <div class="border-bottom pb-2 mb-0 d-flex">
        <a class="a-link-style" href="JavaScript:void(0);"  onclick="router.loadRoute('')">
          <h6 class="a-link-style">Categories</h6>
        </a>
        <h6 class="">&nbsp>&nbsp${params.category}</h6>
      </div>
      <div id="post-list">
      </div>
      `

      let newFormData = new FormData
      newFormData.append("category", params.category)

      await fetch('/get-post-list', { method: "post", body: newFormData }).then(res => res.json()).then(res => {
        let postList = htmlElement.querySelector("#post-list")

        if (res.length == 0) {
          postList.innerHTML += `<h3 class="text-center">There are no posts in this category</h3>`
        }

        res.forEach(post => {
          const postedTime = getTime(post.created);

          postList.innerHTML += `
            <div class="align-items-center d-flex text-muted">
              <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32"
                xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
              </svg>
              <a href="JavaScript:void(0);"  onclick="router.loadRoute('category', '${params.category}', '${post.id}')" class="post-conclusion pb-3 pt-3 mb-0 small lh-sm border-bottom w-100">
                <div class="d-flex justify-content-between">
                  <strong class="text-gray-dark">${post.title}</strong>
                </div>
                <span class="mt-2 d-block">Author: ${post.authorName}</span>
                <span class="d-block">Created: ${postedTime}</span>
                <span class="d-block">Categories: ${post.categories.join(", ")}</span>
              </a>
            </div>
            `
        })
      })

      return htmlElement.innerHTML
    }
  },
  {
    path: '/category/:category/:postId',
    getTemplate: async (params) => {
      let htmlElement = document.createElement("div")
      let formData = new FormData()
      formData.append("postId", params.postId)

      await fetch('/get-post', { method: "post", body: formData }).then(res => res.json()).then(res => {
        if (res.ok != undefined) {
          htmlElement.innerHTML = `<h3 class="text-center">This post doesn't exist!</h3>`
        } else {
          htmlElement.innerHTML = `
          <div class="border-bottom pb-2 mb-0 d-flex">
            <a class="a-link-style" href="JavaScript:void(0);"  onclick="router.loadRoute('')">
              <h6 class="a-link-style">Categories</h6>
            </a>
            <a class="a-link-style" href="JavaScript:void(0);"  onclick="router.loadRoute('category', '${params.category}')">
              <h6 class="a-link-style">&nbsp> ${params.category}</h6>
            </a>
            <h6 class="">&nbsp> ${res.title}</h6>
          </div>
          <h3 class="border-bottom pt-2 pb-2 mb-2">${res.title}</h6>
          <div class="d-flex justify-content-between">
            <span class="d-block">Author: ${res.authorName}</span>
            <span class="d-block">Created: ${getTime(res.created)}</span>
            <span class="d-block">Categories: ${res.categories.join(", ")}</span>
          </div>
          <div class="mb-4 mt-4" id="post-text-body">
          </div>
          <h3 class="border-bottom pb-2 mb-2">${res.comments} Comments</h6>
          <form class="d-inline needs-validation" action="/new-comment" method="post" novalidate>
            <div class="d-grid gap-4">
              <div class="input-group">
                <input name="postId" value="${params.postId}" style="display: none;"></input>
                <textarea class="new-comment-text-content form-control" name="comment" aria-label="New comment content" placeholder="New comment content"
                  required></textarea>
              </div>
              <div>
                <button type="submit" class="btn btn-primary" style="width: 100px;">Submit</button>
              </div>
            </div>
          </form>
          <div id="comment-section">
          </div>
          `
          let postBody = htmlElement.querySelector("#post-text-body");
          res.paragraphs.forEach(paragraph => {
            postBody.innerHTML += `
            <p>${paragraph}</p>
            `;
          })
          
          let commentSection = htmlElement.querySelector("#comment-section");

          if (res.postComments.length == 0) {
            commentSection.innerHTML += `<h3 class="mt-5 text-center">There are no comments yet. Add your comment.</h3>`
          }

          res.postComments.forEach(comment => {
            let newComment = document.createElement("div");
          
            newComment.innerHTML += `
              <div class="d-grid gap-3 mb-3 mt-3 p-2 bg-body rounded border border-secondary">
                <div class="d-flex border-bottom justify-content-between">
                  <h6 class="d-block">Author: ${comment.authorName}</h6>
                  <h6 class="d-block">Created: ${getTime(comment.created)}</h5>
                </div>
                <div class="p-2" id="comment-body-section"></div>
              </div>
            `;
            let commentBodySection = newComment.querySelector("#comment-body-section")
            comment.paragraphs.forEach(paragraph => {
              commentBodySection.innerHTML += `
              <p>${paragraph}</p>
              `;
            })

            commentSection.innerHTML += newComment.innerHTML;
          })
        }
      })

      return htmlElement.innerHTML;
    }
  },
  {
    path: '/chat/:userid',
    getTemplate: async (params) => { 
      let htmlElement = document.createElement("div")
      htmlElement.innerHTML = `
        <div class="border-bottom pb-2 mb-0 d-flex">
          <h6 class="">Chat</h6>
        </div>
        <div id="category-list">
          <div class="chat-log">
            <div class="text-center">
              <h2>No messages here yeat...</h2>
            </div>
            <div class="chat-log-item">
              <div class="chat-log-message-header">
                <h3>Qwerty</h3>
              </div>
              <div class="chat-log-message">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
              layout. The point of using Lorem Ipsum</div>
              <p class="chat-log-date mb-0 mt-3 font-weight-light">23.02.1222 12:30</p>
            </div>
            <div class="chat-log-item chat-log-item-own">
              <div class="chat-log-message-header">
                <h3>Max Paine</h3>
              </div>
              <div class="chat-log-message">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
              layout. The point of using Lorem Ipsum</div>
              <p class="chat-log-date mb-0 mt-3 font-weight-light">23.02.1222 12:30</p>
            </div>
          </div>
          <div class="input-group">
            <textarea class="chat-textarea form-control" placeholder="Type your message here"
              aria-label="Chat textarea"></textarea>
          </div>
        </div>
      `

      return htmlElement.innerHTML;
    }
  },
  {
    path: '/login',
    getTemplate: (params) => `
      <section id="login-section" class="m-auto d-flex align-items-center text-center login-section">
        <div class="w-100 d-flex justify-content-center">
          <div class="w-50 d-grid gap-4">
            <img src="" alt="">
            <h1>Welcome!</h1>
            <h3>Don't have an account?</h3>
            <div>
              <button class="btn btn-primary w-25" type="submit" onclick="router.loadRoute('registration')">Signup</button>
            </div>
          </div>
        </div>
        <div class="w-100 d-grid gap-4">
          <div class="d-flex justify-content-center">
            <form class="login-form d-grid gap-3 w-50 needs-validation" action="/login-post" method="post" novalidate>
              <h1>Login</h1>
              <div class="form-group">
                <label for="login">Username/Email address</label>
                <input name="login" type="text" class="form-control" id="login" aria-describedby="emailHelp"
                  placeholder="Enter username/email" required>
              </div>
              <div class="form-group">
                <label for="password-login">Password</label>
                <input name="password" type="password" class="form-control" id="password-login" placeholder="Password" autocomplete required>
              </div>
              <div>
                <button type="submit" class="btn btn-primary w-25">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `,
  },
  {
    path: '/registration',
    getTemplate: (params) => `
      <section id="reg-section" class="m-auto d-flex align-items-center text-center login-section">
        <div class="w-100 d-flex justify-content-center">
          <div class="w-50 d-grid gap-4">
            <img src="" alt="">
            <h1>Welcome!</h1>
            <h3>Already have an account?</h3>
            <div>
              <button class="btn btn-primary w-25" type="submit" onclick="router.loadRoute('login')">Login</button>
            </div>
          </div>
        </div>
        <div class="w-100 d-grid gap-4">
          <div class="d-flex justify-content-center">
            <form class="login-form d-grid gap-3 w-50 needs-validation" action="/registration-post" method="post" novalidate>
              <h1>Signup</h1>
              <div class="form-group row">
                <div class="col">
                  <label for="name-reg">Name</label>
                  <input name="firstName" type="text" class="form-control" placeholder="First name" required>
                  <div class="invalid-feedback">
                    Please provide your name.
                  </div>
                </div>
                <div class="col">
                  <label for="surname-reg">Surname</label>
                  <input name="lastName" type="text" class="form-control" placeholder="Last name" required>
                  <div class="invalid-feedback">
                    Please provide your surname.
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="col">
                  <label for="gender-reg">Gender</label>
                  <select name="gender" id="gender-reg" class="form-control" required>
                    <option value="" disabled selected>Your gender</option>
                    <option value="male" >Male</option>
                    <option value="female" >Female</option>
                  </select>
                  <div class="invalid-feedback">
                    Please select your gender.
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="age-reg">Age</label>
                <input name="age" min="18" max="120" type="number" class="form-control" id="age-reg" aria-describedby="ageHelp" placeholder="Age" required>
                <div class="invalid-feedback">
                  You must be at least 18 years old.
                </div>
              </div>
              <div class="form-group">
                <label for="username-reg">Username</label>
                <input name="username" minlength="5" type="text" class="form-control" id="username-reg" aria-describedby="usernameHelp"
                  placeholder="Username" required>
                <div class="invalid-feedback">
                  Please select your username.
                </div>
              </div>
              <div class="form-group">
                <label for="email-reg">Email address</label>
                <input name="email" minlength="5" type="email" class="form-control" id="email-reg" aria-describedby="emailHelp" placeholder="Email" required>
                <div class="invalid-feedback">
                  Please provide your email address.
                </div>
              </div>
              <div class="form-group">
                <label for="password-reg">Password</label>
                <input name="password" minlength="8" type="password" class="form-control" id="password-reg" placeholder="Password" autocomplete required>
                <div class="invalid-feedback">
                  Password min lenght must be 8.
                </div>
              </div>
              <div>
                <button type="submit" class="btn btn-primary w-25">Signup</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `,
  },
];

function getTime(givenTime) {
  const cutTime = givenTime.substring(0, 16)
  const [date, time] = cutTime.split("T");
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year} ${time}`
}