// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import FormLogin from './pages/FormLogin';
import DashboardAdministrador from './pages/DashboardAdministrador';
import DashboardCliente from './pages/DashboardCliente';
import Agenda from '../pages/Agenda/[userId]/[token]';
import AdminDashboard from '../pages/dashboard-administrador/[userId]/[token]';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = React.useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};

const App = () => (
    <AuthProvider>
        <Router>
            <Switch>
                <Route path="/login" component={FormLogin} />
                <PrivateRoute path="/dashboard-administrador/:userId/:token" component={AdminDashboard} />
                <PrivateRoute path="/dashboard-cliente/:userId/:token" component={DashboardCliente} />
                <PrivateRoute path="/Agenda/:userId/:token" component={Agenda} />
                <Redirect from="/" to="/login" />
            </Switch>
        </Router>
    </AuthProvider>
);

export default App;
