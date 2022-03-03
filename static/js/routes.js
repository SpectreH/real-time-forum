const routes = [
  {
    path: '/',
    getTemplate: (params) => `
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Real time forum</a>
        <button class="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="navbar-collapse offcanvas-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">New post</a>
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
        <div class="col-7 my-3 p-3 bg-body rounded shadow-sm">
          <h6 class="border-bottom pb-2 mb-0">Posts</h6>
          <div class="align-items-center d-flex text-muted">
            <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg"
              role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false">
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
            </svg>
        
            <a href="test" class="post-conclusion pb-3 pt-3 mb-0 small lh-sm border-bottom w-100">
              <div class="d-flex justify-content-between">
                <strong class="text-gray-dark">Test message for all users</strong>
              </div>
              <span class="mt-2 d-block">Author: Queryu</span>
              <span class="d-block">Created: 28.03.2012 12:35</span>
              <span class="d-block">Categories: Sport, Music, Hello</span>
            </a>
          </div>
        </div>
        <div class="col-4 my-3 p-3 bg-body rounded shadow-sm">
          <h6 class="border-bottom pb-2 mb-0">Chat</h6>
          <div id="chat">

          </div>
        </div>
      </div>
    </main>
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
