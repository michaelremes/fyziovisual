import React, { Component } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../styles/Login/Login.css'
import { Alert, notification} from 'antd'
import { api_url } from "../../config/config"

import {
  getFromStorage,
  setInStorage
} from '../../utils/storage'

const theme = createTheme({
  palette: {
    background: '#b6ffff'
  }
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordLabel: 'Heslo',
      emailLabel: 'Přihlašovací email',
      passwordState: 'error',
      signInEmail: '',
      signInPassword: '',
      email_error: null,
      pswd_error: null,
      email_helper_text: 'Špatný email',
      token: '',
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
  }
  handleEmailChange = (e) => {
    if (!validateEmail(e.target.value)) {
      this.setState({
        emailLabel: "Error",
        email_error: true,
        email_helper_text: "Nesprávná emailová adresa",
      });
    }
    else {
      this.setState({
        emailLabel: 'Přihlašovací email',
        email_error: null,
        email_helper_text: '',
      });
    }
    this.setState({ signInEmail: e.target.value });
  }
  handlePasswordChange = (e) => {
    this.setState({ signInPassword: e.target.value });
  };




  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    // Post request to backend to login in
    fetch(api_url + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {

        console.log(JSON.stringify(json));
        if (json.code === 200) {
          setInStorage('user_session', { token: json.data.token });
          localStorage.setItem('email', signInEmail);
          localStorage.setItem('userId', json.data.user_id);
          localStorage.setItem('user_role', json.data.user_role);
          this.props.history.push(`/dashboard`);
          this.openNotificationWithIcon('success', 'Úspěšné přihlášení');
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
          });

        }
        else {
          console.log('error login')
          this.openNotificationWithIcon('error', 'Špatné přihlašovací údaje');
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  openNotificationWithIcon(type, message) {
    notification[type]({
      message: message,
    });
  };

  render() {
    const {
      email_error,
      pswd_error,
      signInEmail,
      signInPassword,
      email_helper_text,
    } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className='loginDiv'>
          <ThemeProvider theme={theme}>
            {pswd_error ? <Alert
              message="Error"
              description="Zadali jste špatné přihlašovací údaje."
              type="error"
              showIcon
            /> : null}

            <Container component="main" maxWidth="xl">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h1 className="mb-3">FyzioVisual</h1>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Přihlásit se
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={this.onSignIn}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Přihlašovací email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={signInEmail}
                    onChange={this.handleEmailChange}
                    error={email_error}
                    helperText={email_error ? email_helper_text : null}
                  />
                  <TextField
                    type="password"
                    value={signInPassword}
                    onChange={this.handlePasswordChange}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Heslo"
                    id="outlined-error-helper-text"
                    autoComplete="current-password"
                    error={pswd_error}
                    helperText={pswd_error ? "Špatné přihlašovací údaje" : null}
                  />
                  <Button
                    fullWidth
                    onClick={this.onSignIn}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Přihlásit se
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      );
    }
  }
}