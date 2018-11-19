import React from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      blogs: [], 
      user: null,
      error: null,
      notification: null,
      author: '',
      title: '',
      url: ''
  }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogCollector')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  } 

  login = async (event) => {
    event.preventDefault()
    console.log("logging in")
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogCollector', JSON.stringify(user))
      this.setState({username:'', password:'', user})
    } catch (error) {
      this.setState({
        error: 'käyttäjätunnus tai salasana virheellinen',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  createBlog = async (event) => {
    event.preventDefault()
    console.log("testing")
    const newBlog = {
      author: this.state.author,
      title: this.state.title,
      url: this.state.url
    }
    const response = await blogService.createBlog(newBlog)
    this.setState({
      blogs: this.state.blogs.concat(response),
      author: '',
      title: '',
      url: '',
      notification: "new blog '" + newBlog.title + "' by " + newBlog.author + " added!"
    })
    setTimeout(() => {
      this.setState({notification: null})
    }, 5000)
}

likeBlog = (id) => {
  return () => {
    console.log("Adding like to " + id)
    const blog = this.state.blogs.find(b => b._id === id)
    const changedBlog = {...blog, likes: blog.likes+1}

    blogService
    .update(id,changedBlog)
    .then(changedBlog => {
      this.setState({
        blogs: this.state.blogs.map(blog => blog._id === id ? changedBlog: blog)
      })
      })
  }
}

deleteBlog = (id) => {
  return () => {
    const blog = this.state.blogs.find(b => b._id === id)
    if (window.confirm("Do you really want to delete blog '" + blog.title + "'?" )) { 
      console.log("Deleting " + id)
      const response = blogService
      .deleteBlog(id)
      .then((response) => {
        blogService.getAll().then(blogs =>
          this.setState({ blogs })
        )
        })
      }
  }
}



  handleLoginFieldChange = (event) => {
     this.setState({[event.target.name]: event.target.value})
  }

  logoutPressed = (event) => {
    window.localStorage.removeItem('loggedBlogCollector')
    this.setState({user: null})
  }

  handleBlogFieldChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
    }

  sortBlogs = () => {
    const sortedblogs = this.state.blogs.sort(function (a,b){
      return b.likes - a.likes
    });
    this.setState({
      blogs: sortedblogs
    })
  }
  
  render() {
    const loginForm = () => (
      <div className='loginForm'>
        <h2>Login</h2>
        <form onSubmit={this.login}>
        <div>
          Username:
          <input
          type = "text"
          name = "username"
          value = {this.state.username}
          onChange = {this.handleLoginFieldChange}
          />
        </div>
        <div>
          Password:
          <input
          name = "password"
          type = "password"
          value = {this.state.password}
          onChange = {this.handleLoginFieldChange}
          />
        </div>
        <button type="submit">Log in</button>
        </form>
      </div>
    )
    
    const blogList = () => (
      <div>
        <h2>Blogs</h2>
        {this.state.user.name} logged in! 
        <button onClick={this.logoutPressed}>Logout</button>
        {this.state.blogs.map(blog => 
          <Blog key={blog._id} blog={blog} likeBlog={this.likeBlog(blog._id)} deleteBlog={this.deleteBlog(blog._id)} user={this.state.user}/>
        )}
      </div>
    )

    const newBlog = () => {
      return (
        <div>
        <Togglable buttonLabel="Show blog adding">
        <NewBlog
          title = {this.state.title}
          author = {this.state.author}
          url = {this.state.url}
          createBlog = {this.createBlog}
          handleBlogFieldChange = {this.handleBlogFieldChange}
          />
        </Togglable>
        </div>
      )
    }


    return (
      <div>
        <p>{this.state.error}</p>
        <p>{this.state.notification}</p>
        {this.state.user === null ? loginForm() :
        <div>
          {blogList()}
          <button onClick={this.sortBlogs}>Sort blogs by likes</button>
          {newBlog()}
        </div>}

      </div>
    );
  }
}

const NewBlog = ({createBlog, handleBlogFieldChange, title, author, url}) => {
  return(
    <div>
    <h2>Add new blog</h2>
    <form onSubmit={createBlog}>
    <div>
      Title:
      <input 
      type = "text"
      name = "title"
      value = {title}
      onChange = {handleBlogFieldChange}
      />
    </div>
    <div>
      Author:
      <input 
      type = "text"
      name = "author"
      value = {author}
      onChange = {handleBlogFieldChange}
      />
    </div>
    <div>
      Url:
      <input 
      type = "text"
      name = "url"
      value = {url}
      onChange = {handleBlogFieldChange}
      />
    </div>
    <button type="submit">Add</button>
    </form>
  </div>
  )
}

NewBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
  handleBlogFieldChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}


export default App;
