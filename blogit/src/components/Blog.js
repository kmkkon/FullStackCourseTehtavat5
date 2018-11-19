import React from 'react'

class Blog extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      showdeletebutton: false
    }
  }

  render() {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }
    if (this.props.blog.user === undefined) this.state.showdeletebutton = true
    else if (this.props.blog.user.username === this.props.user.username) this.state.showdeletebutton = true
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }
    const hideButton = { display: this.state.showdeletebutton ? '' : 'none' }

    return (
      <div>
      <div >
        <p className="nameTitle" onClick={e => this.setState({ visible: true })}>"{this.props.blog.title}" {this.props.blog.author}</p>
      </div>
      <div style = {showWhenVisible} className="moreContent">
      <div style = {blogStyle}>
      <div>{this.props.blog.url}</div>
      <div>{this.props.blog.likes} likes <button onClick={this.props.likeBlog}>Like</button></div>
      <div>added by {this.props.blog.user === undefined ? 'unknown' : this.props.blog.user.name}</div>
      <div style = {hideButton}><button onClick={this.props.deleteBlog}>Delete</button></div>
      <button onClick={e => this.setState({ visible: false })}>hide</button>
      </div>
      </div>
    </div>  
    )
  }
  }

export default Blog