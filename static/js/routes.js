const routes = [
  {
    path: '/',
    getTemplate: async (params) => {
      let htmlElement = document.createElement('div')
      htmlElement.innerHTML = `
      <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
        <div class="container-fluid">
          <a class="navbar-brand" href="JavaScript:void(0);"  onclick="router.loadRoute('')">Real time forum</a>
          <button class="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
      
          <div class="navbar-collapse offcanvas-collapse">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="JavaScript:void(0);"  onclick="router.loadRoute('')">Home</a>
              </li>
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
            <div class="d-grid ov" id="user-list">
              <div class="d-flex align-items-center" id="user-list-user">
                <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded-circle" width="16" height="16" xmlns="http://www.w3.org/2000/svg"
                  role="img" focusable="false">
                  <rect width="100%" height="100%" id="user-list-status" fill="#28d119" />
                </svg>
                <span class="pe-2" id="user-list-name">Neeooo</span>
                <a href="">
                  <svg width="16" height="16">
                    <use xlink:href="#email" />
                  </svg>
                </a>
              </div>
              <div class="d-flex align-items-center" id="user-list-user">
                <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded-circle" width="16" height="16"
                  xmlns="http://www.w3.org/2000/svg" role="img" focusable="false">
                  <rect width="100%" height="100%" id="user-list-status" fill="#c9c3c3" />
                </svg>
                <span class="pe-2" id="user-list-name">Neeooo</span>
              </div>
            </div>
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
        }
      })
    
      var checkboxes = htmlElement.querySelector("#category-selection-list").querySelectorAll('input[type="checkbox"]');

      console.log(checkboxes)

      return htmlElement.innerHTML
    }
  },
  {
    path: '/category/:category',
    getTemplate: (params) => {
    return  `
    <div class="border-bottom pb-2 mb-0 d-flex">
      <a class="a-link-style" href="JavaScript:void(0);"  onclick="router.loadRoute('')">
        <h6 class="a-link-style">Categories</h6>
      </a>
      <h6 class="">&nbsp> ${params.category}</h6>
    </div>
    <div class="align-items-center d-flex text-muted">
      <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32"
        xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
        preserveAspectRatio="xMidYMid slice" focusable="false">
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
      </svg>

      <a href="JavaScript:void(0);"  onclick="router.loadRoute('category', '${params.category}', '1')" class="post-conclusion pb-3 pt-3 mb-0 small lh-sm border-bottom w-100">
        <div class="d-flex justify-content-between">
          <strong class="text-gray-dark">Test message for all users</strong>
        </div>
        <span class="mt-2 d-block">Author: Queryu</span>
        <span class="d-block">Created: 28.03.2012 12:35</span>
        <span class="d-block">Categories: Sport, Music, Hello</span>
      </a>
    </div>
    `}
  },
  {
    path: '/category/:category/:postId',
    getTemplate: (params) => `
    <div class="border-bottom pb-2 mb-0 d-flex">
      <a class="a-link-style" href="JavaScript:void(0);"  onclick="router.loadRoute('')">
        <h6 class="a-link-style">Categories</h6>
      </a>
      <a class="a-link-style" href="JavaScript:void(0);"  onclick="router.loadRoute('category', '${params.category}')">
        <h6 class="a-link-style">&nbsp> ${params.category}</h6>
      </a>
      <h6 class="">&nbsp> Test message for all users</h6>
    </div>
    <h3 class="border-bottom pt-2 pb-2 mb-2">Test message for all users</h6>
    <div class="d-flex justify-content-between">
      <span class="d-block">Author: Queryu</span>
      <span class="d-block">Created: 28.03.2012 12:35</span>
      <span class="d-block">Categories: Sport, Music, Hello</span>
    </div>
    <div class="mb-4 mt-4">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis arcu risus, quis posuere dui pretium vitae.
        Morbi at elit condimentum, finibus eros quis, porta turpis. Pellentesque et molestie nisi, vel commodo nulla. Nunc
        dapibus elit sed tellus pulvinar rutrum. Curabitur lorem lectus, congue quis orci eget, pulvinar blandit tortor.
        Suspendisse potenti. Phasellus mollis ut odio ac tincidunt. Mauris quis mauris ac dui elementum fermentum. Aliquam risus
        diam, lacinia vel ullamcorper ut, blandit ac enim. Sed id enim nec mi accumsan facilisis. Aenean eu nisi ipsum. Aenean
        sit amet mauris aliquet, hendrerit diam quis, facilisis urna. Sed sagittis felis eu tortor vestibulum, non commodo erat
        sodales.
      </p>
      <p>
        Maecenas pretium ipsum ac quam rhoncus sodales. Nam maximus turpis leo, at blandit massa commodo sit amet. Etiam lacinia
        ligula non dui ullamcorper, eu finibus eros elementum. Nam at mauris eget massa consequat molestie. Curabitur non leo
        sit amet mauris blandit maximus non sed diam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
        ridiculus mus. In blandit tellus orci, eu sodales enim venenatis sit amet. Duis ac volutpat odio. Donec ornare molestie
        felis a tempus. Etiam vitae aliquet nunc. Phasellus feugiat mollis eros, eu porttitor felis feugiat at. Nullam vitae
        interdum ex. Integer porttitor nisl a ipsum tincidunt, at imperdiet magna interdum. Nulla ac pretium tellus, sed luctus
        augue. Phasellus eu nulla at mi accumsan lacinia eget vitae ex. Pellentesque eu nisi nec mauris imperdiet bibendum nec
        vel purus.
      </p>
      <p>
        Mauris pharetra, dui malesuada pretium tincidunt, ipsum eros ornare nulla, vel blandit lorem augue non tortor. Curabitur
        sodales ullamcorper tempus. Quisque sit amet arcu lorem. Vivamus finibus leo ligula, quis gravida felis euismod et.
        Mauris nec nunc vel urna accumsan placerat nec nec ligula. Nullam imperdiet metus sed purus congue, in accumsan purus
        mollis. Cras vitae placerat nisi. Sed finibus aliquam sem, a auctor sapien feugiat eget. Sed porta tincidunt metus a
        suscipit. Aenean eu eros ut sem mattis consequat eget id nisi.
      </p>
      <p>
        Integer eros mi, porttitor quis hendrerit et, volutpat sed leo. Integer nec bibendum urna. In rhoncus maximus velit, vel
        condimentum lacus fringilla at. Phasellus tristique mattis neque non maximus. Pellentesque habitant morbi tristique
        senectus et netus et malesuada fames ac turpis egestas. Cras at dictum nunc. Cras consequat egestas sapien a ultricies.
      </p>
      <p>
        Curabitur eleifend eu lorem ut mollis. Ut vitae nisl ac ex euismod cursus. Nulla convallis urna vitae accumsan
        tincidunt. Mauris gravida orci non nisl elementum, ut mattis arcu suscipit. Cras finibus tristique interdum.
        Pellentesque quis ipsum dictum, aliquam justo ac, pharetra purus. Donec ullamcorper pulvinar nibh at auctor. Sed
        sollicitudin venenatis tellus a placerat. Aliquam a dolor rutrum, molestie magna eu, varius magna. Curabitur egestas
        purus placerat arcu luctus sollicitudin. In hac habitasse platea dictumst. Maecenas tempor tortor turpis, vel interdum
        elit hendrerit non. Aliquam leo augue, facilisis in congue ut, malesuada sit amet nunc. Nam eget blandit nibh, a
        sollicitudin est.
      </p>
    </div>
    <h3 class="border-bottom pb-2 mb-2">Comments</h6>
    <form class="d-inline needs-validation" action="" enctype="multipart/form-data" method="post" novalidate>
      <div class="d-grid gap-4">
        <div class="input-group">
          <textarea class="new-comment-text-content form-control" aria-label="New comment content" placeholder="New comment content"
            required></textarea>
        </div>
        <div>
          <button type="submit" class="btn btn-primary" style="width: 100px;">Submit</button>
        </div>
      </div>
    </form>
    <div class="d-grid gap-3 mb-3 mt-3 p-2 bg-body rounded border border-secondary">
      <div class="d-flex border-bottom justify-content-between">
        <h6 class="d-block">Author: Queryu</h6>
        <h6 class="d-block">Created: 28.03.2012 12:36</h5>
      </div>
      <div class="p-2">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis arcu risus, quis posuere dui pretium
          vitae.
          Morbi at elit condimentum, finibus eros quis, porta turpis. Pellentesque et molestie nisi, vel commodo nulla. Nunc
          dapibus elit sed tellus pulvinar rutrum. Curabitur lorem lectus, congue quis orci eget, pulvinar blandit tortor.
        </p>
      </div>
    </div>
    `
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
