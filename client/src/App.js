import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import Payment from './pages/Payment/Payment';
import StartContestPage from './pages/StartContestPage/StartContestPage';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Home from './pages/Home/Home';
import ContestPage from './pages/ContestPage/ContestPage';
import UserProfile from './pages/UserProfile/UserProfile';
import ContestCreationPage from './pages/ContestCreation/ContestCreationPage';
import browserHistory from './browserHistory';
import ChatContainer from './components/Chat/ChatComponents/ChatContainer/ChatContainer';
import PrivateRoute from './components/Routes/PrivateRoute';
import { authActionCancel, authActionRefresh } from './actions/actionCreator';
import CONSTANTS from './constants';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = localStorage.getItem(CONSTANTS.REFRESH_TOKEN);
    if (refreshToken) {
      dispatch(authActionRefresh({ refreshToken }));
    }
    else {
      dispatch(authActionCancel());
    }
  }, []);

  return (
    <Router history={browserHistory}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/registration" component={RegistrationPage} />
        <PrivateRoute
          exact
          path="/payment"
          roles={[CONSTANTS.CUSTOMER]}
          component={Payment}
        />
        <PrivateRoute
          exact
          path="/startContest"
          roles={[CONSTANTS.CUSTOMER]}
          component={StartContestPage}
        />
        <PrivateRoute
          exact
          path="/startContest/nameContest"
          roles={[CONSTANTS.CUSTOMER]}
        >
          <ContestCreationPage
            contestType={CONSTANTS.NAME_CONTEST}
            title={'Company Name'}
          />
        </PrivateRoute>
        <PrivateRoute
          exact
          path="/startContest/taglineContest"
          roles={[CONSTANTS.CUSTOMER]}
        >
          <ContestCreationPage
            contestType={CONSTANTS.TAGLINE_CONTEST}
            title={'TAGLINE'}
          />
        </PrivateRoute>
        <PrivateRoute
          exact
          path="/startContest/logoContest"
          roles={[CONSTANTS.CUSTOMER]}
        >
          <ContestCreationPage
            contestType={CONSTANTS.LOGO_CONTEST}
            title={'LOGO'}
          />
        </PrivateRoute>
        <PrivateRoute
          exact
          path="/dashboard"
          roles={[CONSTANTS.CUSTOMER, CONSTANTS.CREATOR]}
          component={Dashboard}
        />
        <PrivateRoute
          exact
          path="/contest/:id"
          roles={[CONSTANTS.CUSTOMER, CONSTANTS.CREATOR]}
          component={ContestPage}
        />
        <PrivateRoute
          exact
          path="/account"
          roles={[CONSTANTS.CUSTOMER, CONSTANTS.CREATOR]}
          component={UserProfile}
        />
        <Route component={NotFound} />
      </Switch>
      <ChatContainer />
    </Router>
  );
}

export default App;
