/// <reference types="Cypress" />

describe('Blog app', function () {
  const user = {
    username: 'bird',
    name: 'bird',
    password: 'bird1234'
  }
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request(
      'POST',
      'http://localhost:3003/api/users',
      user
    )
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#btn-login').click()

      cy.contains(`${user.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password + '12345')
      cy.get('#btn-login').click()

      cy.get('.notification')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {

    const firstBlog = {
      title: 'my title 200',
      author: user.name,
      url: 'xxx.example.org',
      likes: 0
    }

    beforeEach(function () {
      cy.login(user)
      cy.createBlog(firstBlog)
    })

    it('A blog can be created', function () {
      const blog = {
        title: 'my title 100',
        author: user.name,
        url: 'xxx.example'
      }
      cy.contains('new note').click()
      cy.get('#inputTitle').type(blog.title)
      cy.get('#inputAuthor').type(blog.author)
      cy.get('#inputUrl').type(blog.url)
      cy.get('#btn-create-blog').click()

      cy.get('.notification')
        .should('contain', `a new blog ${blog.title}! by added ${user.name}`)
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('.blog-item').should('contain', `${blog.title} ${blog.author}`)
      cy.get('.viewAll').should('contain', 'view')
    })

    it('A blog can be liked', function () {
      cy.get('.viewAll').click()
      cy.get('.btnLikes').click()

      cy.contains(`likes ${firstBlog.likes + 1}`)
    })

    describe('delete a blog', function () {
      it('A blog which the user is created can be deleted', function () {
        cy.get('.viewAll').click()
        cy.get('.btn-delete-blog').click()

        cy.get('div')
          .should('not.contain', `${firstBlog.title} ${firstBlog.author}`)
      })

      it('A blog which the user is created cannot be deleted by the other user', function () {
        const userBen = {
          username: 'ben',
          name: 'ben',
          password: 'ben1234'
        }
        cy.createUser(userBen)
        cy.login(userBen)

        cy.get('.viewAll').click()
        cy.get('.btn-delete-blog').should('have.css', 'display', 'none')
      })
    })

    it.only('Sort by likes in descending order', function () {
      const secondBlog = {
        ...firstBlog,
        title: firstBlog.title + '123445',
        url: 'xxx.io',
        likes: 0
      }
      cy.createBlog(secondBlog)


      const blogs = [firstBlog, secondBlog]
      blogs.sort(function (a, b) {
        return b.likes - a.likes
      })

      cy.visit('http://localhost:3000')
      cy.get('.viewAll').click({ multiple: true })

      cy.get('.blog-item').eq(0).should('contain', blogs[0].title)
      cy.get('.blog-item').eq(1).should('contain', blogs[1].title)


      blogs[1].likes = blogs[1].likes + 1
      cy.get('.btnLikes').eq(1).click()
      blogs.sort(function (a, b) {
        return b.likes - a.likes
      })


      cy.wait(1000)

      cy.get('.blog-item').eq(0).should('contain', blogs[0].title)
      cy.get('.blog-item').eq(1).should('contain', blogs[1].title)
    })
  })

})