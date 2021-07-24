import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from "axios";
import { Container, Card, FormControl, Button, Form, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setUser, updateUser } from '../../actions/actions';

import './profile-view.scss';

export class ProfileView extends React.Component {

  constructor() {
    super();
    this.state = {
      UsernameError: "",
      EmailError: "",
      PasswordError: "",
      BirthdateError: "",
    };
  }

  removeFavorite(movie) {
    const token = localStorage.getItem("token");
    const url = "https://myflixcl.herokuapp.com/users/" + localStorage.getItem("user") + "/movies/" + movie._id;
    axios
      .delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        alert(movie.Title + " removed from your Favorites.");
      });
  }

  handleDelete() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    axios
      .delete(
        `https://myflixcl.herokuapp.com/users/${user}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert(user + " has been deleted.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.pathname = "/";
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleUpdate(_e) {
      let token = localStorage.getItem("token");
      let user = localStorage.getItem("user");
      console.log(this.state);
      let setisValid = this.formValidation(username);
        username || user.Username
        email || user.Email
        birthdate || user.brithdate
        password || undefined
      if (setisValid) {
        axios.put(`https://myflixcl.herokuapp.com/users/${user}`,
          {
            Username: user.Username,
            Password: user.Password,
            Email: user.Email,
            Birthdate: user.Birthdate,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((response) => {
            this.props.setUser(response.data);
            alert(user + " has been updated.");
            console.log(response);
          })
          .catch(function (error) {
            console.log(error.response.data);
          });
      }
    }

  formValidation( username, password, email, birthdate ) {
    let { user } = this.props;
      console.log(_e.target);
    //const username = _e.target[0].value;
    //const password = _e.target[1].value;
    //const email = _e.target[2].value;
    //const birthdate = _e.target[3].value;
    let UsernameError = {};
    let EmailError = {};
    let PasswordError = {};
    let BirthdateError = {};
    let isValid = true;
    if (user.Username.trim().length < 5) {
      UsernameError.usernameShort = "Must be alphanumeric and contains at least 5 characters";
      isValid = false;
    }
    if (user.Password.trim().length < 3) {
      PasswordError.passwordMissing = "You must enter a current or new password.(minimum 4 characters) ";
      isValid = false;
    }
    if (!(user.Email && user.Email.includes(".") && user.Email.includes("@"))) {
      EmailError.emailNotEmail = "A valid email address is required.";
      isValid = false;
    }
    if (user.Birthdate === '') {
      BirthdateError.birthdateEmpty = "Please enter your birthdate.";
      isValid = false;
    }
    this.setState({
      UsernameError: UsernameError,
      PasswordError: PasswordError,
      EmailError: EmailError,
      BirthdateError: BirthdateError,
    })
    return isValid;
  };

  handleChange(e) {
    let { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const { movies, user } = this.props;
    const { UsernameError, EmailError, PasswordError, BirthdateError } = this.state;
    const FavoriteMovieList = movies.filter((movie) => {
      return user.FavoriteMovies.includes(movie._id);
    });
    return (
      <div className="userProfile" style={{ display: "flex" }}>
        <Container>
          <Row className="justify-content-md-center">
            <Col md={12}>
              <Form className="justify-content-md-center mb-30">
                <h1 style={{ textAlign: "center" }}>My Account</h1>

                <Form.Group controlId="formUsername">
                  <Form.Label>Username: </Form.Label>
                  <FormControl size="sm"
                    type="text"
                    name="Username"
                    onChange={(e) => this.handleChange(e)}
                    placeholder={user.Username} />
                  {Object.keys(UsernameError).map((key) => {
                    return (
                      <div key={key} style={{ color: "red" }}>
                        {UsernameError[key]}
                      </div>
                    );
                  })}

                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password: </Form.Label>
                  <FormControl size="sm"
                    type="password"
                    name="Password"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Enter current or new password" />
                  {Object.keys(PasswordError).map((key) => {
                    return (
                      <div key={key} style={{ color: "red" }}>
                        {PasswordError[key]}
                      </div>
                    );
                  })}

                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email: </Form.Label>
                  <FormControl
                    size="sm"
                    type="email"
                    name="Email"
                    onChange={(e) => this.handleChange(e)}
                    placeholder={user.Email} />
                  {Object.keys(EmailError).map((key) => {
                    return (
                      <div key={key} style={{ color: "red" }}>
                        {EmailError[key]}
                      </div>
                    );
                  })}

                </Form.Group>
                <Form.Group controlId="formBirthdate">
                  <Form.Label>Date of Birth: </Form.Label>
                  <FormControl
                    size="sm"
                    type="text"
                    name="Birthdate"
                    onChange={(e) => this.handleChange(e)}
                    placeholder={user.Birthdate} />
                  {Object.keys(BirthdateError).map((key) => {
                    return (
                      <div key={key} style={{ color: "red" }}>
                        {BirthdateError[key]}
                      </div>
                    );
                  })}

                </Form.Group>

                <Link to={`/users/${user.Username}`}>
                  <Button className="mb-2" variant="dark"
                    type="link"
                    size="md"
                    block
                    onClick={(e) => this.handleUpdate(e)}
                  >
                    Save changes
                    </Button>
                </Link>

                <Link to={`/`}>
                  <Button className="mb-2"
                    variant="primary"
                    type="submit"
                    size="md"
                    block
                  >
                    Back to Main
                  </Button>
                </Link>

                <Button className="mb-2" variant="danger"
                  size="md"
                  block
                  onClick={() => this.handleDelete()}
                >
                  Delete Account
                </Button>
              </Form>

              <div
                className="favoriteMovies"
                style={{
                  float: "center",
                  textAlign: "center",
                }}
              >
                <Card.Text className="mt-200" as='h3'>Favorite Movies:</Card.Text>
                <Row className='mb-20'>
                  {FavoriteMovieList.map((movie) => {
                    return (
                      <Col md={3} key={movie._id}>
                        <div key={movie._id}>
                          <Card className="movieCard">
                            <Link to={`/movies/${movie._id}`}>
                            <Card.Img variant="top" src={movie.ImagePath}/>
                            </Link>
                            <Card.Body>
                              <Link to={`/movies/${movie._id}`}>
                                <Button variant="link">Open</Button>
                              </Link>
                                <Button onClick={() => this.removeFavorite(movie)}>Remove</Button>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div >
    );
  }
}
ProfileView.propTypes = {
  movies: PropTypes.array.isRequired
};

let mapStateToProps = state => {
  return {
    movies: state.movies,
    user: state.user
  }
}

export default connect(mapStateToProps, { setUser, updateUser })(ProfileView);
